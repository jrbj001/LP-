#!/usr/bin/env python3
"""Render the Adaptive Layer explainer as clean motion design (Pillow frames + Gemini narration)."""

from __future__ import annotations

import json
import math
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))

from render_adaptive_layer_film import (  # noqa: E402
    configure,
    find_ffmpeg,
    load_key,
    render_score,
    render_tts,
    wav_seconds,
)

ROOT = Path(__file__).resolve().parents[2]
SPEC_PATH = Path(__file__).with_name("adaptive-layer-motion.json")
OUT = ROOT / "tmp" / "gaistudio-motion"

W, H = 1920, 1080
S = 2  # supersampling factor
SR = 24000  # narration sample rate

FONT_CANDIDATES = [
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/Supplemental/Helvetica.ttc",
]
MONO_CANDIDATES = ["/System/Library/Fonts/SFNSMono.ttf"]

_font_index: dict[str, tuple[str, int]] = {}
_font_cache: dict[tuple[str, int], ImageFont.FreeTypeFont] = {}


def build_font_index() -> None:
    for path in FONT_CANDIDATES + MONO_CANDIDATES:
        if not Path(path).exists():
            continue
        for idx in range(12):
            try:
                font = ImageFont.truetype(path, 20, index=idx)
            except Exception:
                break
            try:
                family, style = font.getname()
            except Exception:
                continue
            key = f"{family} {style}".strip()
            _font_index.setdefault(key, (path, idx))


def font(style: str, size: int) -> ImageFont.FreeTypeFont:
    """style: 'regular' | 'medium' | 'bold' | 'mono'."""
    wanted = {
        "regular": ["Helvetica Neue Regular", "Helvetica Regular", "Helvetica Neue", "Helvetica"],
        "medium": ["Helvetica Neue Medium", "Helvetica Neue Bold", "Helvetica Bold"],
        "bold": ["Helvetica Neue Bold", "Helvetica Bold", "Helvetica Neue Medium"],
        "mono": ["SF Mono Regular", ".SF NS Mono Regular", "SFMono Regular"],
    }[style]
    cache_key = (style, size)
    if cache_key in _font_cache:
        return _font_cache[cache_key]
    for name in wanted:
        if name in _font_index:
            path, idx = _font_index[name]
            f = ImageFont.truetype(path, size, index=idx)
            _font_cache[cache_key] = f
            return f
    # fallback: first indexed font, else default
    if _font_index:
        path, idx = next(iter(_font_index.values()))
        f = ImageFont.truetype(path, size, index=idx)
    else:
        f = ImageFont.load_default()
    _font_cache[cache_key] = f
    return f


# ---------------------------------------------------------------- color / ease


def hex_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def mix(fg: tuple[int, int, int], bg: tuple[int, int, int], a: float) -> tuple[int, int, int]:
    a = max(0.0, min(1.0, a))
    return tuple(int(round(f * a + b * (1 - a))) for f, b in zip(fg, bg))  # type: ignore[return-value]


def clamp01(v: float) -> float:
    return max(0.0, min(1.0, v))


def ease_out(t: float) -> float:
    t = clamp01(t)
    return 1 - pow(1 - t, 3)


def ease_in_out(t: float) -> float:
    t = clamp01(t)
    return 4 * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 3) / 2


def seg(t: float, start: float, end: float) -> float:
    if end <= start:
        return 1.0 if t >= end else 0.0
    return clamp01((t - start) / (end - start))


def fade(t: float, a: float, b: float, c: float, d: float) -> float:
    """Trapezoid opacity: 0 before a, 1 between b and c, 0 after d."""
    if t < a or t > d:
        return 0.0
    if t < b:
        return ease_out(seg(t, a, b))
    if t > c:
        return 1 - ease_out(seg(t, c, d))
    return 1.0


# ---------------------------------------------------------------- draw helpers


class Scene:
    def __init__(self, palette: dict[str, str]):
        self.bg = hex_rgb(palette["bg"])
        self.ink = hex_rgb(palette["ink"])
        self.muted = hex_rgb(palette["muted"])
        self.hairline = hex_rgb(palette["hairline"])
        self.accent = hex_rgb(palette["accent"])
        self.img = Image.new("RGB", (W * S, H * S), self.bg)
        self.d = ImageDraw.Draw(self.img)

    def col(self, rgb: tuple[int, int, int], alpha: float) -> tuple[int, int, int]:
        return mix(rgb, self.bg, alpha)

    def line(self, x1: float, y1: float, x2: float, y2: float, rgb, alpha: float, w: float = 1.0) -> None:
        if alpha <= 0.003:
            return
        self.d.line(
            [(x1 * S, y1 * S), (x2 * S, y2 * S)],
            fill=self.col(rgb, alpha),
            width=max(1, int(round(w * S))),
        )

    def dot(self, cx: float, cy: float, r: float, rgb, alpha: float) -> None:
        if alpha <= 0.003 or r <= 0:
            return
        self.d.ellipse(
            [(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S],
            fill=self.col(rgb, alpha),
        )

    def ring(self, cx: float, cy: float, r: float, rgb, alpha: float, w: float = 1.0) -> None:
        if alpha <= 0.003 or r <= 0:
            return
        self.d.ellipse(
            [(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S],
            outline=self.col(rgb, alpha),
            width=max(1, int(round(w * S))),
        )

    def rrect(
        self,
        cx: float,
        cy: float,
        w: float,
        h: float,
        radius: float,
        alpha: float,
        outline=None,
        fill=None,
        width: float = 1.0,
    ) -> None:
        if alpha <= 0.003:
            return
        box = [(cx - w / 2) * S, (cy - h / 2) * S, (cx + w / 2) * S, (cy + h / 2) * S]
        self.d.rounded_rectangle(
            box,
            radius=radius * S,
            outline=self.col(outline, alpha) if outline is not None else None,
            fill=self.col(fill, alpha) if fill is not None else None,
            width=max(1, int(round(width * S))),
        )

    def text(
        self,
        x: float,
        y: float,
        label: str,
        f: ImageFont.FreeTypeFont,
        rgb,
        alpha: float,
        anchor: str = "lm",
        tracking: float = 0.0,
    ) -> None:
        if alpha <= 0.003 or not label:
            return
        color = self.col(rgb, alpha)
        if tracking == 0.0:
            self.d.text((x * S, y * S), label, font=f, fill=color, anchor=anchor)
            return
        track = tracking * S
        widths = [self.d.textlength(ch, font=f) for ch in label]
        total = sum(widths) + track * (len(label) - 1)
        if anchor[0] == "m":
            cursor = x * S - total / 2
        elif anchor[0] == "r":
            cursor = x * S - total
        else:
            cursor = x * S
        vanchor = "l" + anchor[1]
        for ch, cw in zip(label, widths):
            self.d.text((cursor, y * S), ch, font=f, fill=color, anchor=vanchor)
            cursor += cw + track

    def text_width(self, label: str, f: ImageFont.FreeTypeFont, tracking: float = 0.0) -> float:
        if not label:
            return 0.0
        widths = [self.d.textlength(ch, font=f) for ch in label]
        return (sum(widths) + tracking * S * (len(label) - 1)) / S

    def chip(
        self,
        cx: float,
        cy: float,
        label: str,
        f: ImageFont.FreeTypeFont,
        alpha: float,
        pad_x: float = 34,
        height: float = 78,
        solid: bool = False,
        accent: bool = False,
    ) -> float:
        if alpha <= 0.003:
            return 0.0
        tw = self.text_width(label, f)
        w = tw + pad_x * 2
        stroke = self.accent if accent else self.hairline
        if solid:
            self.rrect(cx, cy, w, height, height / 2, alpha, fill=self.ink)
            self.text(cx, cy, label, f, self.bg, alpha, anchor="mm")
        else:
            self.rrect(cx, cy, w, height, height / 2, alpha, outline=stroke, fill=self.bg, width=1.2)
            self.text(cx, cy, label, f, self.accent if accent else self.ink, alpha, anchor="mm")
        return w

    def finish(self) -> Image.Image:
        return self.img.resize((W, H), Image.LANCZOS)


# ---------------------------------------------------------------- layout


Y_SOURCE = 330.0
Y_LAYER = 580.0
Y_CONSUMER = 830.0
Y_STATEMENT = 985.0
X_LEFT = 150.0
X_RIGHT = W - 150.0
X_MID = W / 2
CHIP_H = 78.0


def source_x(i: int, n: int) -> float:
    span = 1300.0
    if n == 1:
        return X_MID
    step = span / (n - 1)
    return X_MID - span / 2 + step * i


def consumer_x(i: int, n: int) -> float:
    span = 1040.0
    if n == 1:
        return X_MID
    step = span / (n - 1)
    return X_MID - span / 2 + step * i


# ---------------------------------------------------------------- beat drawing


def draw_frame(spec: dict, timeline: list[dict], t: float) -> Image.Image:
    sc = Scene(spec["palette"])
    labels = spec["labels"]
    total = timeline[-1]["end"]

    starts = {b["id"]: b["start"] for b in timeline}
    ends = {b["id"]: b["end"] for b in timeline}

    f_brand = font("medium", 21)
    f_label = font("regular", 34)
    f_small = font("regular", 26)
    f_token = font("regular", 28)
    f_stmt = font("medium", 58)
    f_sign = font("bold", 104)
    f_signsub = font("regular", 38)

    outro_start = starts["sign"]
    world = 1 - ease_in_out(seg(t, outro_start + 0.15, outro_start + 1.0))

    # persistent brand mark
    brand_a = fade(t, 0.15, 0.9, outro_start, outro_start + 0.6)
    sc.text(X_LEFT, 112, labels["brand"], f_brand, sc.muted, brand_a * 0.9, tracking=3.4)

    # ---- statement line (bottom left), cross-fading per beat
    for beat in timeline:
        if not beat["statement"]:
            continue
        a = fade(t, beat["start"] + 0.10, beat["start"] + 0.55, beat["end"] - 0.45, beat["end"] - 0.05)
        if a <= 0.003:
            continue
        rise = (1 - ease_out(seg(t, beat["start"] + 0.10, beat["start"] + 0.70))) * 16
        sc.text(X_LEFT, Y_STATEMENT + rise, beat["statement"], f_stmt, sc.ink, a)
        sc.line(X_LEFT, Y_STATEMENT + 58, X_LEFT + 74, Y_STATEMENT + 58, sc.accent, a * 0.85, 2.4)

    # ---- sources
    src = labels["sources"]
    n_src = len(src)
    for i, name in enumerate(src):
        a = fade(t, 0.25 + i * 0.14, 0.9 + i * 0.14, outro_start, outro_start + 0.5) * world
        if a <= 0.003:
            continue
        x = source_x(i, n_src)
        drop = (1 - ease_out(seg(t, 0.25 + i * 0.14, 1.0 + i * 0.14))) * 20
        sc.chip(x, Y_SOURCE - drop, name, f_label, a)
        # idle pulse before the layer exists: each system on its own
        solo = 1 - ease_out(seg(t, starts["layer"], starts["layer"] + 0.7))
        if solo > 0.01:
            ph = math.sin(t * 2.2 + i * 1.7) * 0.5 + 0.5
            sc.dot(x, Y_SOURCE - drop - 68, 4.6, sc.muted, a * solo * (0.25 + ph * 0.5))

    # ---- the layer line
    lay_p = ease_in_out(seg(t, starts["layer"] + 0.12, starts["layer"] + 1.25))
    lay_a = fade(t, starts["layer"] + 0.12, starts["layer"] + 0.5, outro_start + 0.05, outro_start + 0.65)
    if lay_p > 0.001 and lay_a > 0.003:
        half = (X_RIGHT - X_LEFT) / 2 * lay_p
        x1, x2 = X_MID - half, X_MID + half
        for gw, ga in ((10, 0.10), (6, 0.18)):
            sc.line(x1, Y_LAYER, x2, Y_LAYER, sc.accent, lay_a * ga, gw)
        sc.line(x1, Y_LAYER, x2, Y_LAYER, sc.accent, lay_a, 3.0)

    # connectors sources -> layer
    conn_a = fade(t, starts["layer"] + 0.55, starts["layer"] + 1.35, outro_start, outro_start + 0.5) * world
    for i in range(n_src):
        x = source_x(i, n_src)
        p = ease_out(seg(t, starts["layer"] + 0.55 + i * 0.09, starts["layer"] + 1.5 + i * 0.09))
        y_end = Y_SOURCE + 44 + (Y_LAYER - Y_SOURCE - 44) * p
        sc.line(x, Y_SOURCE + 44, x, y_end, sc.hairline, conn_a, 1.3)

    # ---- identity: tokens fall and merge into one record
    id_s = starts["identity"]
    tokens = labels["tokens"]
    merge = ease_in_out(seg(t, id_s + 1.15, id_s + 2.15))
    tok_a = fade(t, id_s + 0.15, id_s + 0.6, id_s + 1.6, id_s + 2.2) * world
    for i, tok in enumerate(tokens):
        if tok_a <= 0.003:
            break
        sx = source_x(i, n_src)
        p = ease_in_out(seg(t, id_s + 0.2 + i * 0.12, id_s + 1.3 + i * 0.12))
        x = sx + (X_MID - sx) * merge
        y = Y_SOURCE + 84 + (Y_LAYER - Y_SOURCE - 84) * p
        sc.chip(x, y, tok, f_token, tok_a * (1 - merge * 0.85), pad_x=24, height=58)

    rec_a = fade(t, id_s + 1.9, id_s + 2.4, ends["fork"] - 0.1, ends["fork"] + 0.4) * world
    rec_pop = ease_out(seg(t, id_s + 1.9, id_s + 2.5))
    fork_s = starts["fork"]
    split = ease_in_out(seg(t, fork_s + 0.5, fork_s + 1.6))
    rec_x = X_MID
    if rec_a > 0.003:
        w = sc.chip(rec_x, Y_LAYER, labels["record"], f_label, rec_a * (1 - split), accent=True)
        if rec_pop < 1.0:
            sc.ring(rec_x, Y_LAYER, 58 + (1 - rec_pop) * 84, sc.accent, rec_a * (1 - rec_pop) * 0.5, 1.8)
        del w

    # ---- fork: number stays a record, text becomes vector
    fk_a = fade(t, fork_s + 0.6, fork_s + 1.3, outro_start, outro_start + 0.5) * world
    if fk_a > 0.003 and split > 0.001:
        off = 420 * split
        # left: record (fact)
        lx = X_MID - off
        sc.line(X_MID, Y_LAYER, lx, Y_LAYER, sc.hairline, fk_a * 0.7, 1.3)
        sc.rrect(lx, Y_LAYER, 172, 78, 14, fk_a, outline=sc.ink, fill=sc.bg, width=1.6)
        sc.text(lx, Y_LAYER, labels["fact"], f_small, sc.ink, fk_a, anchor="mm")
        sc.text(lx, Y_LAYER - 78, labels["factHint"], f_small, sc.muted, fk_a * 0.85, anchor="mm")
        # right: chunks -> vectors
        rx = X_MID + off
        sc.line(X_MID, Y_LAYER, rx, Y_LAYER, sc.hairline, fk_a * 0.7, 1.3)
        chunk = ease_in_out(seg(t, fork_s + 1.5, fork_s + 2.5))
        for k in range(3):
            cx = rx - 62 + k * 62
            sq_a = fk_a * (1 - chunk)
            sc.rrect(cx, Y_LAYER, 46, 62, 8, sq_a, outline=sc.muted, fill=sc.bg, width=1.4)
            sc.dot(cx, Y_LAYER, 10 * chunk, sc.accent, fk_a * chunk)
            if chunk > 0.05:
                sc.ring(cx, Y_LAYER, 10 + 14 * chunk, sc.accent, fk_a * chunk * 0.25, 1.2)
        sc.text(rx, Y_LAYER - 78, labels["vectorHint"], f_small, sc.muted, fk_a * 0.85, anchor="mm")
        sc.text(rx, Y_LAYER + 78, labels["vector"], f_small, sc.accent, fk_a * chunk, anchor="mm")

    # ---- consumers + query
    q_s = starts["query"]
    cons = labels["consumers"]
    n_con = len(cons)
    for i, name in enumerate(cons):
        a = fade(t, q_s + 0.1 + i * 0.13, q_s + 0.7 + i * 0.13, outro_start, outro_start + 0.5) * world
        if a <= 0.003:
            continue
        x = consumer_x(i, n_con)
        rise = (1 - ease_out(seg(t, q_s + 0.1 + i * 0.13, q_s + 0.9 + i * 0.13))) * 20
        sc.chip(x, Y_CONSUMER + rise, name, f_label, a)
        sc.line(x, Y_LAYER + 10, x, Y_CONSUMER - 44, sc.hairline, a * 0.55, 1.2)

    # query dot rises, gate checks, two answers come back
    if world > 0.01:
        qx = consumer_x(1, n_con)
        up = ease_in_out(seg(t, q_s + 1.15, q_s + 2.0))
        up_a = fade(t, q_s + 1.15, q_s + 1.35, q_s + 1.95, q_s + 2.15) * world
        if up_a > 0.003:
            y = Y_CONSUMER - 48 - (Y_CONSUMER - 48 - Y_LAYER - 20) * up
            sc.dot(qx, y, 9, sc.ink, up_a)

        gate = fade(t, q_s + 1.95, q_s + 2.15, q_s + 2.75, q_s + 3.05) * world
        if gate > 0.003:
            sc.ring(qx, Y_LAYER, 38, sc.accent, gate, 2.0)
            sc.text(qx, Y_LAYER - 78, labels["gate"], f_small, sc.accent, gate, anchor="mm")

        down = ease_in_out(seg(t, q_s + 2.6, q_s + 3.5))
        dn_a = fade(t, q_s + 2.6, q_s + 2.85, ends["query"] - 0.5, ends["query"] - 0.1) * world
        if dn_a > 0.003:
            y = Y_LAYER + 20 + (Y_CONSUMER - 48 - Y_LAYER - 20) * down
            sc.dot(qx - 22, y, 9, sc.ink, dn_a)  # o fato
            sc.ring(qx + 22, y, 9, sc.accent, dn_a, 2.0)  # o trecho

    # ---- signature
    sig_a = fade(t, outro_start + 0.85, outro_start + 1.5, total - 0.40, total - 0.05)
    if sig_a > 0.003:
        rule = ease_out(seg(t, outro_start + 0.95, outro_start + 1.8))
        sc.line(X_MID - 37 * rule, H / 2 - 132, X_MID + 37 * rule, H / 2 - 132, sc.accent, sig_a * 0.9, 2.4)
        sc.text(X_MID, H / 2 - 34, labels["signTitle"], f_sign, sc.ink, sig_a, anchor="mm")
        sc.text(X_MID, H / 2 + 60, labels["signLine"], f_signsub, sc.muted, sig_a, anchor="mm")

    return sc.finish()


# ---------------------------------------------------------------- audio


def read_wav_mono(path: Path) -> np.ndarray:
    with wave.open(str(path), "rb") as wav:
        frames = wav.readframes(wav.getnframes())
        data = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
        if wav.getnchannels() == 2:
            data = data.reshape(-1, 2).mean(axis=1)
    return data


def write_wav_mono(path: Path, data: np.ndarray, rate: int = SR) -> None:
    clipped = np.clip(data, -1.0, 1.0)
    pcm = (clipped * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm.tobytes())


def build_timeline(spec: dict, vo_paths: list[Path]) -> list[dict]:
    gap_before = float(spec["gapBefore"])
    gap_after = float(spec["gapAfter"])
    min_beat = float(spec["minBeatSeconds"])
    timeline: list[dict] = []
    cursor = 0.0
    for beat, vo in zip(spec["beats"], vo_paths):
        speech = wav_seconds(vo)
        duration = max(gap_before + speech + gap_after, min_beat)
        timeline.append(
            {
                "id": beat["id"],
                "statement": beat.get("statement", ""),
                "start": cursor,
                "end": cursor + duration,
                "speechStart": cursor + gap_before,
                "speech": speech,
                "vo": vo,
            }
        )
        cursor += duration
    return timeline


def build_vo_track(timeline: list[dict], dest: Path) -> Path:
    total = timeline[-1]["end"]
    track = np.zeros(int(math.ceil(total * SR)) + SR, dtype=np.float32)
    for beat in timeline:
        data = read_wav_mono(beat["vo"])
        start = int(round(beat["speechStart"] * SR))
        track[start : start + len(data)] += data
    write_wav_mono(dest, track[: int(round(total * SR))])
    return dest


# ---------------------------------------------------------------- pipeline


def render_frames(spec: dict, timeline: list[dict], frames_dir: Path) -> int:
    fps = int(spec["fps"])
    total = timeline[-1]["end"]
    count = int(round(total * fps))
    if frames_dir.exists():
        shutil.rmtree(frames_dir)
    frames_dir.mkdir(parents=True, exist_ok=True)
    for i in range(count):
        t = i / fps
        img = draw_frame(spec, timeline, t)
        img.save(frames_dir / f"{i:05d}.png")
        if i % 48 == 0:
            print(f"  frame {i}/{count}  t={t:.1f}s")
    return count


def encode(spec: dict, frames_dir: Path, vo: Path, score: Path | None, dest: Path) -> Path:
    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        raise RuntimeError("ffmpeg não encontrado")
    fps = int(spec["fps"])
    inputs = [
        "-framerate",
        str(fps),
        "-i",
        str(frames_dir / "%05d.png"),
        "-i",
        str(vo),
    ]
    if score and score.exists():
        inputs.extend(["-stream_loop", "-1", "-i", str(score)])
        afilter = (
            "[1:a]aresample=48000,volume=1.25[vo];"
            "[2:a]aresample=48000,volume=0.13[m];"
            "[vo][m]amix=inputs=2:duration=first:dropout_transition=2[a]"
        )
        map_a = "[a]"
    else:
        afilter = "[1:a]aresample=48000,volume=1.25[a]"
        map_a = "[a]"
    cmd = [
        ffmpeg,
        "-y",
        *inputs,
        "-filter_complex",
        afilter,
        "-map",
        "0:v",
        "-map",
        map_a,
        "-c:v",
        "libx264",
        "-crf",
        "17",
        "-preset",
        "slow",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        str(dest),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return dest


def main(argv: list[str] | None = None) -> None:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", default=str(SPEC_PATH))
    parser.add_argument("--out", default=str(OUT))
    parser.add_argument("--no-audio", action="store_true", help="render mudo, sem chamar a API")
    args = parser.parse_args(argv)

    spec_path = Path(args.spec)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "vo").mkdir(exist_ok=True)
    configure(spec_path, out_dir)

    build_font_index()
    spec = json.loads(spec_path.read_text())
    print("SPEC", spec_path.name, "OUT", out_dir)

    if args.no_audio:
        fps = int(spec["fps"])
        timeline = []
        cursor = 0.0
        for beat in spec["beats"]:
            duration = 4.0
            timeline.append(
                {
                    "id": beat["id"],
                    "statement": beat.get("statement", ""),
                    "start": cursor,
                    "end": cursor + duration,
                    "speechStart": cursor,
                    "speech": duration,
                    "vo": None,
                }
            )
            cursor += duration
        frames_dir = out_dir / "frames"
        render_frames(spec, timeline, frames_dir)
        ffmpeg = find_ffmpeg()
        dest = out_dir / "adaptive-layer-motion-mudo.mp4"
        subprocess.run(
            [
                ffmpeg, "-y", "-framerate", str(fps), "-i", str(frames_dir / "%05d.png"),
                "-c:v", "libx264", "-crf", "17", "-preset", "slow", "-pix_fmt", "yuv420p", str(dest),
            ],
            check=True,
            capture_output=True,
        )
        print("MOTION", dest, dest.stat().st_size)
        return

    key = load_key()
    print("== TTS ==")
    vo_paths = [render_tts(key, spec, beat) for beat in spec["beats"]]
    timeline = build_timeline(spec, vo_paths)
    for beat in timeline:
        print(f"  {beat['id']:<9} {beat['start']:6.2f} → {beat['end']:6.2f}  fala {beat['speech']:.1f}s")
    print(f"  TOTAL {timeline[-1]['end']:.1f}s")

    print("== SCORE ==")
    score = render_score(key, spec)

    print("== VO TRACK ==")
    vo_track = build_vo_track(timeline, out_dir / "vo-track.wav")

    print("== FRAMES ==")
    frames_dir = out_dir / "frames"
    count = render_frames(spec, timeline, frames_dir)
    print(f"  {count} frames")

    print("== ENCODE ==")
    dest = encode(spec, frames_dir, vo_track, score, out_dir / "adaptive-layer-motion.mp4")
    print(f"MOTION {dest} {dest.stat().st_size} bytes {timeline[-1]['end']:.1f}s")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print("FAIL", exc, file=sys.stderr)
        sys.exit(1)

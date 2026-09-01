#!/usr/bin/env python3
"""Compose Ray 3.2 segments with exact typography, Gemini TTS and Lyria."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

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
DEFAULT_SPEC = Path(__file__).with_name("adaptive-layer-premium.json")
FONT = "/System/Library/Fonts/HelveticaNeue.ttc"

OVERLAYS = [
    (0.35, 4.60, "A operação já sabe.", ""),
    (5.00, 8.85, "O conhecimento explica.", ""),
    (9.15, 13.80, "Falta contexto.", ""),
    (14.10, 19.70, "Evento. Entidade. Conhecimento.", ""),
    (20.05, 25.75, "Qualquer modelo.", "A mesma verdade."),
    (26.00, 30.00, "Adaptive Layer™", "Contexto pronto para inteligência."),
]


def ease_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def opacity(t: float, start: float, end: float) -> float:
    fade = 0.42
    if t < start or t > end:
        return 0.0
    if t < start + fade:
        return ease_out((t - start) / fade)
    if t > end - fade:
        return 1 - ease_out((t - (end - fade)) / fade)
    return 1.0


def font(size: int, index: int = 0) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT, size, index=index)


def render_overlay_frames(out: Path, width: int, height: int, fps: int = 24) -> Path:
    frames = out / "type-frames"
    if frames.exists():
        shutil.rmtree(frames)
    frames.mkdir(parents=True)

    margin_x = round(width * 0.07)
    margin_y = round(height * 0.085)
    large = font(round(height * 0.055))
    small = font(round(height * 0.023))
    eyebrow = font(round(height * 0.016))
    ink = (24, 24, 27)
    muted = (108, 108, 114)
    blue = (27, 77, 255)

    for frame in range(30 * fps):
        t = frame / fps
        image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(image)

        # Persistent quiet brand mark.
        brand_alpha = 0 if t > 25.8 else 125
        draw.text(
            (margin_x, margin_y),
            "ADAPTIVE LAYER™",
            font=eyebrow,
            fill=(ink[0], ink[1], ink[2], brand_alpha),
        )

        for start, end, title, subtitle in OVERLAYS:
            a = opacity(t, start, end)
            if a <= 0:
                continue
            is_signature = start >= 26
            rise = round((1 - ease_out(min(1, max(0, (t - start) / 0.65)))) * height * 0.018)
            if is_signature:
                bbox = draw.textbbox((0, 0), title, font=large)
                tw = bbox[2] - bbox[0]
                x = (width - tw) // 2
                y = round(height * 0.43) + rise
                line_w = round(width * 0.045 * ease_out((t - start) / 0.7))
                draw.rounded_rectangle(
                    (
                        width // 2 - line_w // 2,
                        y - round(height * 0.075),
                        width // 2 + line_w // 2,
                        y - round(height * 0.071),
                    ),
                    radius=2,
                    fill=(*blue, round(255 * a)),
                )
                draw.text((x, y), title, font=large, fill=(*ink, round(255 * a)))
                if subtitle:
                    sb = draw.textbbox((0, 0), subtitle, font=small)
                    sw = sb[2] - sb[0]
                    draw.text(
                        ((width - sw) // 2, y + round(height * 0.085)),
                        subtitle,
                        font=small,
                        fill=(*muted, round(235 * a)),
                    )
            else:
                x = margin_x
                y = height - margin_y - round(height * 0.09) + rise
                # Soft glass label keeps text legible without becoming a card.
                bbox = draw.textbbox((x, y), title, font=large)
                box_right = bbox[2] + round(width * 0.028)
                box_top = y - round(height * 0.026)
                box_bottom = y + round(height * 0.12 if subtitle else height * 0.085)
                draw.rounded_rectangle(
                    (x - round(width * 0.020), box_top, box_right, box_bottom),
                    radius=round(height * 0.020),
                    fill=(251, 251, 250, round(218 * a)),
                )
                draw.rectangle(
                    (x, y - round(height * 0.024), x + round(width * 0.036), y - round(height * 0.020)),
                    fill=(*blue, round(255 * a)),
                )
                draw.text((x, y), title, font=large, fill=(*ink, round(255 * a)))
                if subtitle:
                    draw.text(
                        (x, y + round(height * 0.073)),
                        subtitle,
                        font=small,
                        fill=(*muted, round(235 * a)),
                    )

        image.save(frames / f"{frame:05d}.png", optimize=True)
        if frame % 120 == 0:
            print(f"  type {frame}/{30 * fps}", flush=True)
    return frames


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", default=str(DEFAULT_SPEC))
    parser.add_argument(
        "--ray-dir",
        default=str(ROOT / "tmp" / "adaptive-layer-premium" / "ray32"),
    )
    parser.add_argument(
        "--out",
        default=str(ROOT / "tmp" / "adaptive-layer-premium" / "draft"),
    )
    parser.add_argument("--resolution", choices=("720p", "1080p"), default="720p")
    args = parser.parse_args()

    spec_path = Path(args.spec)
    spec = json.loads(spec_path.read_text())
    ray_dir = Path(args.ray_dir)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "vo").mkdir(exist_ok=True)
    configure(spec_path, out)
    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        raise RuntimeError("ffmpeg não encontrado")

    clips = [
        ray_dir / f"01-disconnected-{args.resolution}.mp4",
        ray_dir / f"02-context-{args.resolution}.mp4",
        ray_dir / f"03-governed-{args.resolution}.mp4",
    ]
    missing = [str(path) for path in clips if not path.exists()]
    if missing:
        raise RuntimeError(f"Clipes ausentes: {', '.join(missing)}")

    print("== CONCAT ==", flush=True)
    concat_list = out / "concat.txt"
    concat_list.write_text("".join(f"file '{clip.resolve()}'\n" for clip in clips))
    bed = out / "ray32-bed.mp4"
    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_list),
            "-c",
            "copy",
            str(bed),
        ],
        check=True,
        capture_output=True,
    )

    print("== AUDIO ==", flush=True)
    key = load_key()
    voice = render_tts(
        key,
        spec,
        {"id": "premium-voiceover", "voice": spec["voiceover"]},
    )
    score = render_score(key, spec)
    print(f"  voice {wav_seconds(voice):.1f}s score={bool(score)}", flush=True)

    print("== TYPOGRAPHY ==", flush=True)
    width, height = (1280, 720) if args.resolution == "720p" else (1920, 1080)
    type_frames = render_overlay_frames(out, width, height)

    print("== COMPOSE ==", flush=True)
    final = out / f"adaptive-layer-premium-{args.resolution}.mp4"
    inputs = [
        "-i",
        str(bed),
        "-framerate",
        "24",
        "-i",
        str(type_frames / "%05d.png"),
        "-i",
        str(voice),
    ]
    if score:
        inputs.extend(["-stream_loop", "-1", "-i", str(score)])
        audio_filter = (
            "[2:a]adelay=350|350,aresample=48000,volume=1.18[vo];"
            "[3:a]aresample=48000,volume=0.14[m];"
            "[vo][m]amix=inputs=2:duration=longest:dropout_transition=2[a]"
        )
    else:
        audio_filter = "[2:a]adelay=350|350,aresample=48000,volume=1.18[a]"

    subprocess.run(
        [
            ffmpeg,
            "-y",
            *inputs,
            "-filter_complex",
            f"[0:v][1:v]overlay=0:0:format=auto[v];{audio_filter}",
            "-map",
            "[v]",
            "-map",
            "[a]",
            "-t",
            "30",
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
            "-movflags",
            "+faststart",
            str(final),
        ],
        check=True,
        capture_output=True,
    )
    print(f"FINAL {final} {final.stat().st_size} bytes", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL {exc}", file=sys.stderr)
        sys.exit(1)

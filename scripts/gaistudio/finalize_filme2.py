#!/usr/bin/env python3
"""Pós do filme 2: watermark permanente pixelpulselab.dev + end card com fade.

Uso:
  python3 scripts/gaistudio/finalize_filme2.py \
    --in tmp/gaistudio-filme2/adaptive-layer-cinema.mp4 \
    --out tmp/gaistudio-filme2/adaptive-layer-executivo-final.mp4
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

FONT = "/System/Library/Fonts/Menlo.ttc"
WATERMARK = "pixelpulselab.dev"
ENDCARD_TITLE = "Adaptive Layer™"
ENDCARD_SUB = "pixelpulselab.dev"
ENDCARD_S = 3.0


def find_ffmpeg() -> str:
    for candidate in ("ffmpeg", "/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg"):
        try:
            subprocess.run([candidate, "-version"], check=True, capture_output=True)
            return candidate
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def probe_duration(ffmpeg: str, src: Path) -> float:
    proc = subprocess.run([ffmpeg, "-i", str(src)], capture_output=True, text=True)
    match = re.search(r"Duration: (\d+):(\d+):(\d+\.?\d*)", proc.stderr)
    if not match:
        raise SystemExit(f"não achei Duration em {src}")
    h, m, s = match.groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--in", dest="src", required=True)
    parser.add_argument("--out", dest="dest", required=True)
    parser.add_argument("--poster", dest="poster", default=None, help="opcional: extrair poster JPG neste caminho")
    parser.add_argument("--poster-at", dest="poster_at", type=float, default=12.0)
    args = parser.parse_args()

    src = Path(args.src)
    dest = Path(args.dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg = find_ffmpeg()
    duration = probe_duration(ffmpeg, src)
    fade_start = duration - ENDCARD_S
    text_start = duration - ENDCARD_S + 0.6

    def esc(text: str) -> str:
        return text.replace(":", r"\:").replace("'", r"\'")

    vf = (
        # watermark permanente, canto inferior direito, discreto
        f"drawtext=fontfile={FONT}:text='{esc(WATERMARK)}':fontsize=26:fontcolor=white@0.35:"
        f"x=w-tw-42:y=h-th-34,"
        # fade para preto nos últimos segundos
        f"fade=t=out:st={fade_start:.2f}:d={ENDCARD_S:.2f}:color=black,"
        # end card: título
        f"drawtext=fontfile={FONT}:text='{esc(ENDCARD_TITLE)}':fontsize=64:fontcolor=white:"
        f"x=(w-tw)/2:y=(h-th)/2-46:alpha='if(lt(t,{text_start:.2f}),0,min(1,(t-{text_start:.2f})/0.8))',"
        # end card: pixelpulselab.dev em destaque
        f"drawtext=fontfile={FONT}:text='{esc(ENDCARD_SUB)}':fontsize=34:fontcolor=0x34d399:"
        f"x=(w-tw)/2:y=(h-th)/2+42:alpha='if(lt(t,{text_start:.2f}),0,min(1,(t-{text_start:.2f})/0.8))'"
    )

    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(src),
        "-vf",
        vf,
        "-af",
        f"afade=t=out:st={fade_start + 0.5:.2f}:d={ENDCARD_S - 0.5:.2f}",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "19",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        str(dest),
    ]
    subprocess.run(cmd, check=True)
    print(f"FINAL {dest} {dest.stat().st_size} bytes {duration:.1f}s")

    if args.poster:
        poster = Path(args.poster)
        poster.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-ss",
                f"{args.poster_at:.2f}",
                "-i",
                str(dest),
                "-frames:v",
                "1",
                "-q:v",
                "3",
                str(poster),
            ],
            check=True,
            capture_output=True,
        )
        print(f"POSTER {poster} {poster.stat().st_size} bytes")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print("FAIL", exc, file=sys.stderr)
        sys.exit(1)

#!/usr/bin/env python3
"""Render the Adaptive Layer product film.

Pipeline
  1. Gemini TTS renders one narration clip per beat.
  2. Beat durations are derived from the narration, so picture follows voice.
  3. Chrome replays film.html frame by frame against that timeline.
  4. Lyria scores the piece; ffmpeg muxes everything into 1080p.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE.parent))

import render_adaptive_layer_film as gai  # noqa: E402

SPEC_PATH = HERE / "spec.json"
OUT = ROOT / "tmp" / "product-film"
SAMPLE_RATE = 24000


def build_timeline(spec: dict, vo: dict[str, Path], target: float) -> list[dict]:
    """Lay beats end to end, each long enough for its narration to breathe."""
    beats = []
    cursor = 0.0
    for beat in spec["beats"]:
        speech = gai.wav_seconds(vo[beat["id"]]) if beat["id"] in vo else 0.0
        needed = beat["gapBefore"] + speech + beat["gapAfter"]
        duration = max(beat["minSeconds"], needed)
        beats.append(
            {
                "id": beat["id"],
                "start": round(cursor, 3),
                "end": round(cursor + duration, 3),
                "voiceAt": round(cursor + beat["gapBefore"], 3),
                "speech": round(speech, 3),
            }
        )
        cursor += duration

    # Absorb any shortfall in the signature so the film lands on target.
    if cursor < target:
        beats[-1]["end"] = round(beats[-1]["end"] + (target - cursor), 3)
    return beats


def concat_voiceover(beats: list[dict], vo: dict[str, Path], dest: Path) -> Path:
    """Place each narration clip at its cue on one continuous track."""
    total_frames = int(round(beats[-1]["end"] * SAMPLE_RATE))
    track = bytearray(total_frames * 2)

    for beat in beats:
        path = vo.get(beat["id"])
        if not path:
            continue
        with wave.open(str(path), "rb") as w:
            pcm = w.readframes(w.getnframes())
        offset = int(round(beat["voiceAt"] * SAMPLE_RATE)) * 2
        end = min(offset + len(pcm), len(track))
        track[offset:end] = pcm[: end - offset]

    dest.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(dest), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        w.writeframes(bytes(track))
    return dest


def capture_frames(timeline: list[dict], fps: int, scale: int, frames_dir: Path) -> None:
    timeline_path = OUT / "timeline.json"
    timeline_path.write_text(json.dumps(timeline, indent=2))
    subprocess.run(
        [
            "node",
            str(HERE / "capture.mjs"),
            f"--html={HERE / 'film.html'}",
            f"--out={frames_dir}",
            f"--timeline={timeline_path}",
            f"--fps={fps}",
            f"--scale={scale}",
        ],
        check=True,
        cwd=str(ROOT),
    )


def encode(
    frames_dir: Path, fps: int, vo: Path | None, score: Path | None, dest: Path, duration: float
) -> Path:
    ffmpeg = gai.find_ffmpeg()
    if not ffmpeg:
        raise SystemExit("ffmpeg ausente")

    cmd = [ffmpeg, "-y", "-framerate", str(fps), "-i", str(frames_dir / "f_%05d.jpg")]
    if vo:
        cmd += ["-i", str(vo)]
    if score:
        cmd += ["-stream_loop", "-1", "-i", str(score)]

    if vo and score:
        fade_out = max(duration - 4.0, 0.0)
        cmd += [
            "-filter_complex",
            f"[2:a]atrim=0:{duration:.2f},volume=0.11,"
            f"afade=t=in:st=0:d=2,afade=t=out:st={fade_out:.2f}:d=3.5[bed];"
            "[1:a]volume=1.0[voice];"
            "[voice][bed]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]",
            "-map", "0:v", "-map", "[a]",
        ]
    elif vo:
        cmd += ["-map", "0:v", "-map", "1:a"]
    else:
        cmd += ["-map", "0:v"]

    cmd += [
        "-vf", "scale=1920:1080:flags=lanczos",
        "-c:v", "libx264", "-preset", "slow", "-crf", "17",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    ]
    if vo or score:
        cmd += ["-c:a", "aac", "-b:a", "192k", "-shortest"]
    cmd += [str(dest)]

    subprocess.run(cmd, check=True, capture_output=True)
    return dest


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=int, default=None)
    ap.add_argument("--scale", type=int, default=None)
    ap.add_argument("--silent", action="store_true", help="pula TTS e trilha")
    ap.add_argument("--reuse-frames", action="store_true")
    args = ap.parse_args()

    spec = json.loads(SPEC_PATH.read_text())
    fps = args.fps or spec["fps"]
    scale = args.scale or spec["scale"]

    OUT.mkdir(parents=True, exist_ok=True)
    gai.configure(SPEC_PATH, OUT)

    vo_clips: dict[str, Path] = {}
    score: Path | None = None

    if not args.silent:
        key = gai.load_key()
        print("narração")
        for beat in spec["beats"]:
            vo_clips[beat["id"]] = gai.render_tts(key, spec, beat)
        print("trilha")
        score = gai.render_score(key, spec)

    timeline = build_timeline(spec, vo_clips, spec["targetSeconds"])
    duration = timeline[-1]["end"]
    for b in timeline:
        print(f"  {b['id']}  {b['start']:5.2f} → {b['end']:5.2f}s   fala {b['speech']:.2f}s")
    print(f"duração {duration:.2f}s")

    frames_dir = OUT / "frames"
    if not (args.reuse_frames and frames_dir.exists()):
        print("captura")
        capture_frames(timeline, fps, scale, frames_dir)

    vo_track = concat_voiceover(timeline, vo_clips, OUT / "vo" / "track.wav") if vo_clips else None

    dest = OUT / "adaptive-layer-product-film.mp4"
    print("encode")
    encode(frames_dir, fps, vo_track, score, dest, duration)
    print(f"\n{dest}  {dest.stat().st_size / 1_000_000:.1f} MB  {duration:.1f}s")


if __name__ == "__main__":
    main()

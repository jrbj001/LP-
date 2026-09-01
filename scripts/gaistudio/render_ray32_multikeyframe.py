#!/usr/bin/env python3
"""Animate Adaptive Layer keyframes with Luma Ray 3.2 Multi-Keyframe."""

from __future__ import annotations

import argparse
import base64
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
API = "https://agents.lumalabs.ai/v1"

SEGMENTS = [
    {
        "id": "01-disconnected",
        "frames": ["01-fragments.png", "02-knowledge.png", "03-layer.png"],
        "indexes": [0, 108, 240],
        "prompt": (
            "Premium abstract 3D product animation. The four isolated material families drift "
            "in distinct slow orbital patterns. The translucent sheet opens with precise paper-like "
            "motion. Camera makes a restrained dolly forward. An optical-glass membrane enters as a "
            "perfect horizontal plane; an empty glass sphere resolves below it. Preserve every "
            "material and the warm gallery exactly. Smooth, physically plausible, no added objects."
        ),
    },
    {
        "id": "02-context",
        "frames": ["03-layer.png", "04-context.png", "05-governed.png"],
        "indexes": [0, 132, 240],
        "prompt": (
            "Premium abstract 3D product animation. The objects pass through the optical layer and "
            "organize with deliberate mechanical elegance: discs become a timeline, glass cubes form "
            "a canonical constellation, pages align as knowledge. Cobalt paths flow into the clear "
            "sphere, then three different model vessels connect through small iris apertures. Camera "
            "arcs only a few degrees. Preserve exact geometry, palette and studio. No text or UI."
        ),
    },
    {
        "id": "03-governed",
        "frames": ["05-governed.png", "06-signature.png"],
        "indexes": [0, 240],
        "prompt": (
            "Premium abstract 3D product animation. Access apertures open one at a time; restrained "
            "cobalt light travels from the governed layer to each model vessel and leaves a subtle "
            "engraved audit trace in the glass. The camera slowly settles into the final hero "
            "composition with generous negative space. End completely still and pristine. Preserve "
            "all objects, lighting and materials. No text, no logos, no new objects."
        ),
    },
]


def load_key() -> str:
    names = ("LUMA_AGENTS_API_KEY", "LUMA_API_KEY", "LUMIA_API_KEY")
    values: dict[str, str] = {}
    for line in (ROOT / ".env.local").read_text().splitlines():
        if "=" not in line or line.lstrip().startswith("#"):
            continue
        name, value = line.split("=", 1)
        values[name.strip()] = value.strip().strip('"').strip("'")
    for name in names:
        if values.get(name):
            return values[name]
    raise RuntimeError("Adicione LUMA_AGENTS_API_KEY ao .env.local")


def mime_for(path: Path) -> str:
    data = path.read_bytes()[:12]
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith(b"\x89PNG"):
        return "image/png"
    raise RuntimeError(f"Formato de imagem desconhecido: {path}")


def image_ref(path: Path) -> dict:
    return {
        "media_type": mime_for(path),
        "data": base64.b64encode(path.read_bytes()).decode(),
    }


def curl_json(method: str, url: str, key: str, body: dict | None = None) -> dict:
    cmd = [
        "curl",
        "-sS",
        "--max-time",
        "300",
        "-X",
        method,
        url,
        "-H",
        f"Authorization: Bearer {key}",
        "-H",
        "Content-Type: application/json",
    ]
    encoded = None
    if body is not None:
        cmd.extend(["--data-binary", "@-"])
        encoded = json.dumps(body).encode()
    result = subprocess.run(cmd, input=encoded, check=True, capture_output=True)
    payload = json.loads(result.stdout)
    if isinstance(payload, dict) and payload.get("detail"):
        raise RuntimeError(str(payload["detail"]))
    return payload


def submit(key: str, segment: dict, frames_dir: Path, resolution: str) -> str:
    refs = [image_ref(frames_dir / name) for name in segment["frames"]]
    body = {
        "model": "ray-3.2",
        "type": "video",
        "prompt": segment["prompt"],
        "aspect_ratio": "16:9",
        "video": {
            "resolution": resolution,
            "duration": "10s",
            "keyframes": refs,
            "keyframe_indexes": segment["indexes"],
        },
    }
    payload = curl_json("POST", f"{API}/generations", key, body)
    generation_id = payload.get("id")
    if not generation_id:
        raise RuntimeError(f"Resposta sem generation id: {json.dumps(payload)[:1200]}")
    return generation_id


def poll(key: str, generation_id: str, timeout: int = 900) -> str:
    deadline = time.time() + timeout
    while time.time() < deadline:
        payload = curl_json("GET", f"{API}/generations/{generation_id}", key)
        state = payload.get("state")
        print(f"  {generation_id} {state}", flush=True)
        if state == "failed":
            raise RuntimeError(
                f"{payload.get('failure_code')}: {payload.get('failure_reason')}"
            )
        if state == "completed":
            for item in payload.get("output", []):
                if item.get("type") == "video" and item.get("url"):
                    return item["url"]
            raise RuntimeError(f"Geração completa sem vídeo: {json.dumps(payload)[:1200]}")
        time.sleep(12)
    raise TimeoutError(f"Timeout: {generation_id}")


def download(url: str, dest: Path) -> None:
    subprocess.run(
        ["curl", "-sS", "-L", "--max-time", "300", url, "-o", str(dest)],
        check=True,
    )
    if dest.stat().st_size < 10_000:
        raise RuntimeError(f"Download inválido: {dest}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--frames",
        default=str(ROOT / "tmp" / "adaptive-layer-premium" / "keyframes"),
    )
    parser.add_argument(
        "--out",
        default=str(ROOT / "tmp" / "adaptive-layer-premium" / "ray32"),
    )
    parser.add_argument("--resolution", choices=("720p", "1080p"), default="720p")
    parser.add_argument("--only", help="ID de um segmento")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    key = load_key()
    frames_dir = Path(args.frames)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    for segment in SEGMENTS:
        if args.only and segment["id"] != args.only:
            continue
        dest = out / f"{segment['id']}-{args.resolution}.mp4"
        if dest.exists() and dest.stat().st_size > 10_000 and not args.force:
            print(f"CACHE {dest}")
            continue
        print(f"SUBMIT {segment['id']} {args.resolution}", flush=True)
        generation_id = submit(key, segment, frames_dir, args.resolution)
        print(f"ID {generation_id}", flush=True)
        url = poll(key, generation_id)
        download(url, dest)
        print(f"SAVED {dest} {dest.stat().st_size} bytes", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL {exc}", file=sys.stderr)
        sys.exit(1)

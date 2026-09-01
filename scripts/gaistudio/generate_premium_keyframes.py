#!/usr/bin/env python3
"""Generate consistent 2K keyframes for the Adaptive Layer premium animation."""

from __future__ import annotations

import argparse
import base64
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SPEC = Path(__file__).with_name("adaptive-layer-premium.json")
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"


def load_key() -> str:
    for line in (ROOT / ".env.local").read_text().splitlines():
        if line.startswith("GOOGLE_AI_STUDIO_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("GOOGLE_AI_STUDIO_API_KEY não encontrada")


def request(model: str, key: str, body: dict) -> dict:
    encoded = json.dumps(body).encode()
    result = subprocess.run(
        [
            "curl",
            "-sS",
            "--max-time",
            "300",
            "-X",
            "POST",
            f"{BASE_URL}/models/{model}:generateContent",
            "-H",
            "Content-Type: application/json",
            "-H",
            f"x-goog-api-key: {key}",
            "--data-binary",
            "@-",
        ],
        check=True,
        input=encoded,
        capture_output=True,
    )
    payload = json.loads(result.stdout)
    if "error" in payload:
        raise RuntimeError(json.dumps(payload["error"], ensure_ascii=False))
    return payload


def extract_image(payload: dict) -> tuple[str, bytes]:
    for candidate in payload.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            inline = part.get("inlineData") or part.get("inline_data")
            if inline and inline.get("data"):
                mime = inline.get("mimeType") or inline.get("mime_type") or "image/png"
                if mime.startswith("image/"):
                    return mime, base64.b64decode(inline["data"])
    feedback = payload.get("promptFeedback") or payload
    raise RuntimeError(f"Resposta sem imagem: {json.dumps(feedback, ensure_ascii=False)[:1200]}")


def image_part(path: Path) -> dict:
    suffix = path.suffix.lower()
    mime = "image/png" if suffix == ".png" else "image/jpeg"
    return {
        "inlineData": {
            "mimeType": mime,
            "data": base64.b64encode(path.read_bytes()).decode(),
        }
    }


def generate(
    spec: dict,
    beat: dict,
    key: str,
    reference: Path | None,
    master: Path | None,
) -> tuple[str, bytes]:
    prompt = (
        f"{spec['artDirection']}\n\n"
        f"SHOT {beat['id']} ({beat['time']}): {beat['prompt']}\n\n"
        "Create one production-ready storyboard keyframe. "
        "Do not render any typography; all copy will be composited later. "
        "Maintain exact material identity and art direction from the supplied reference."
    )
    parts: list[dict] = [{"text": prompt}]
    if master and master.exists():
        parts.append(image_part(master))
        parts.append(
            {
                "text": (
                    "The first attached image is the master style reference. Preserve its exact "
                    "off-white tone, cobalt blue, glass, aluminum, lighting, lens and finish."
                )
            }
        )
    if reference and reference.exists() and reference != master:
        parts.append(image_part(reference))
        parts.append(
            {
                "text": (
                    "The second attached image is the previous shot. Preserve continuity of objects, "
                    "materials, world scale and camera language while advancing the visual story."
                )
            }
        )
    body = {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {
                "aspectRatio": spec["aspectRatio"],
                "imageSize": spec["imageSize"],
            },
        },
    }
    return extract_image(request(spec["imageModel"], key, body))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", default=str(DEFAULT_SPEC))
    parser.add_argument("--out", default=str(ROOT / "tmp" / "adaptive-layer-premium"))
    parser.add_argument("--only", help="ID exato de um beat")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    spec = json.loads(Path(args.spec).read_text())
    out = Path(args.out)
    frames = out / "keyframes"
    frames.mkdir(parents=True, exist_ok=True)
    key = load_key()

    previous: Path | None = None
    master: Path | None = None
    generated: list[Path] = []
    for beat in spec["beats"]:
        dest = frames / f"{beat['id']}.png"
        if args.only and beat["id"] != args.only:
            if dest.exists():
                previous = dest
                master = master or dest
            continue
        if dest.exists() and not args.force:
            print(f"CACHE {dest}")
            previous = dest
            master = master or dest
            generated.append(dest)
            continue
        print(f"GENERATE {beat['id']} — {beat['time']}", flush=True)
        mime, data = generate(spec, beat, key, previous, master)
        dest.write_bytes(data)
        print(f"SAVED {dest} {len(data)} bytes {mime}", flush=True)
        previous = dest
        master = master or dest
        generated.append(dest)

    manifest = {
        "spec": str(Path(args.spec)),
        "model": spec["imageModel"],
        "keyframes": [str(path) for path in generated],
    }
    (out / "keyframes-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2)
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL {exc}", file=sys.stderr)
        sys.exit(1)

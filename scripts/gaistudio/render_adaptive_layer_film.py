#!/usr/bin/env python3
"""Render the Adaptive Layer cinematic film via Google AI Studio (Veo + TTS + Lyria)."""

from __future__ import annotations

import base64
import json
import subprocess
import sys
import time
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPEC_PATH = Path(__file__).with_name("adaptive-layer-cinema.json")
OUT = ROOT / "tmp" / "gaistudio-film"
BASE = "https://generativelanguage.googleapis.com/v1beta"


def configure(spec_path: Path | None = None, out_dir: Path | None = None) -> None:
    global SPEC_PATH, OUT
    if spec_path is not None:
        SPEC_PATH = spec_path
    if out_dir is not None:
        OUT = out_dir


def load_key() -> str:
    env = ROOT / ".env.local"
    for line in env.read_text().splitlines():
        if line.startswith("GOOGLE_AI_STUDIO_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("GOOGLE_AI_STUDIO_API_KEY missing in .env.local")


def http(method: str, url: str, key: str, body: dict | None = None, timeout: int = 180) -> tuple[int, dict | bytes]:
    cmd = [
        "curl",
        "-sS",
        "-X",
        method,
        url,
        "-H",
        "Content-Type: application/json",
        "-H",
        f"x-goog-api-key: {key}",
        "--max-time",
        str(timeout),
        "-w",
        "\n%{http_code}",
    ]
    if body is not None:
        cmd.extend(["-d", json.dumps(body)])
    raw = subprocess.check_output(cmd)
    text = raw.decode("utf-8", errors="replace")
    status_str = text.rsplit("\n", 1)[-1].strip()
    payload_text = text[: -len(status_str)].rstrip("\n")
    status = int(status_str)
    try:
        return status, json.loads(payload_text) if payload_text else {}
    except json.JSONDecodeError:
        return status, payload_text.encode()


def find_inline_audio(payload: dict) -> tuple[str | None, bytes | None]:
    try:
        parts = payload["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError, TypeError):
        return None, None
    for part in parts:
        inline = part.get("inlineData") or part.get("inline_data")
        if not inline:
            continue
        mime = inline.get("mimeType") or inline.get("mime_type") or ""
        data = inline.get("data")
        if data:
            return mime, base64.b64decode(data)
    return None, None


def write_pcm_wav(pcm: bytes, dest: Path, rate: int = 24000) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(dest), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(pcm)


def wav_seconds(path: Path) -> float:
    with wave.open(str(path), "rb") as wav:
        return wav.getnframes() / float(wav.getframerate())


def render_tts(key: str, spec: dict, scene: dict) -> Path:
    dest = OUT / "vo" / f"{scene['id']}.wav"
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"  tts cache {dest.name} {wav_seconds(dest):.1f}s")
        return dest
    voice = spec["voice"]
    names = [voice["voiceName"], "Fenrir", "Kore", "Algenib"]
    last_err = "sem áudio"
    for attempt, name in enumerate(names, start=1):
        spoken = scene["voice"] if attempt == 1 else f"Narrar com calma: {scene['voice']}"
        text = f"{voice['direction']} {spoken}"
        body = {
            "contents": [{"parts": [{"text": text}]}],
            "generationConfig": {
                "responseModalities": ["AUDIO"],
                "speechConfig": {
                    "languageCode": voice["languageCode"],
                    "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": name}},
                },
            },
        }
        url = f"{BASE}/models/{voice['model']}:generateContent"
        status, payload = http("POST", url, key, body)
        if status != 200 or not isinstance(payload, dict):
            last_err = f"HTTP {status}: {str(payload)[:400]}"
            print(f"  tts retry {scene['id']} {name} {last_err}")
            continue
        mime, audio = find_inline_audio(payload)
        if not audio:
            reason = ""
            if isinstance(payload, dict):
                cand = (payload.get("candidates") or [{}])[0]
                reason = cand.get("finishReason") or cand.get("finishMessage") or ""
            last_err = f"sem áudio ({reason})"
            print(f"  tts retry {scene['id']} {name} {last_err}")
            time.sleep(1.5)
            continue
        write_pcm_wav(audio, dest)
        print(f"  tts {scene['id']} {wav_seconds(dest):.1f}s voice={name} mime={mime}")
        return dest
    raise RuntimeError(f"TTS {scene['id']} falhou: {last_err}")


def start_veo(key: str, spec: dict, scene: dict, model: str) -> str:
    prompt = f"{spec['stylePrefix']} {scene['prompt']}"
    body = {
        "instances": [{"prompt": prompt}],
        "parameters": {
            "aspectRatio": spec["aspectRatio"],
            "resolution": spec["resolution"],
            "durationSeconds": spec["durationSeconds"],
            "sampleCount": 1,
        },
    }
    url = f"{BASE}/models/{model}:predictLongRunning"
    status, payload = http("POST", url, key, body)
    if status != 200 or not isinstance(payload, dict) or "name" not in payload:
        raise RuntimeError(f"Veo start {scene['id']} {model} HTTP {status}: {str(payload)[:800]}")
    return payload["name"]


def poll_veo(key: str, op_name: str, timeout_s: int = 420) -> dict:
    url = f"{BASE}/{op_name}"
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        status, payload = http("GET", url, key)
        if status != 200 or not isinstance(payload, dict):
            raise RuntimeError(f"Veo poll HTTP {status}: {str(payload)[:500]}")
        if payload.get("error"):
            raise RuntimeError(f"Veo error: {payload['error']}")
        if payload.get("done"):
            return payload
        time.sleep(12)
    raise TimeoutError(f"Veo timeout {op_name}")


def download_file(key: str, uri: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    sep = "&" if "?" in uri else "?"
    url = f"{uri}{sep}key={key}"
    subprocess.run(
        ["curl", "-sS", "-L", "--max-time", "180", url, "-o", str(dest)],
        check=True,
    )


def extract_video_uri(payload: dict) -> str:
    resp = payload.get("response") or {}
    gvr = resp.get("generateVideoResponse") or {}
    samples = gvr.get("generatedSamples") or []
    if not samples:
        raise RuntimeError(f"Veo sem samples: {json.dumps(payload)[:800]}")
    uri = (samples[0].get("video") or {}).get("uri")
    if not uri:
        raise RuntimeError(f"Veo sem uri: {json.dumps(samples[0])[:800]}")
    return uri


def render_scene_video(key: str, spec: dict, scene: dict) -> Path:
    dest = OUT / "clips" / f"{scene['id']}.mp4"
    if dest.exists() and dest.stat().st_size > 10_000:
        print(f"  veo cache {dest.name}")
        return dest
    models = [spec["videoModel"], spec["videoFallback"]]
    last_err: Exception | None = None
    for model in models:
        print(f"  veo start {scene['id']} {model}")
        try:
            op = start_veo(key, spec, scene, model)
            print(f"  veo op {op}")
            done = poll_veo(key, op)
            uri = extract_video_uri(done)
            download_file(key, uri, dest)
            print(f"  veo saved {dest.name} {dest.stat().st_size} bytes")
            return dest
        except Exception as exc:  # noqa: BLE001 — fallback de modelo
            last_err = exc
            print(f"  veo fail {model}: {exc}")
    raise RuntimeError(f"Veo {scene['id']} falhou: {last_err}")


def render_score(key: str, spec: dict) -> Path | None:
    dest = OUT / "score.mp3"
    if dest.exists() and dest.stat().st_size > 1000:
        print("  score cache")
        return dest
    body = {"contents": [{"parts": [{"text": spec["score"]["prompt"]}]}]}
    url = f"{BASE}/models/{spec['score']['model']}:generateContent"
    status, payload = http("POST", url, key, body, timeout=240)
    if status != 200 or not isinstance(payload, dict):
        print(f"  score fail HTTP {status}: {str(payload)[:500]}")
        return None
    mime, audio = find_inline_audio(payload)
    if not audio:
        print(f"  score sem áudio: {json.dumps(payload)[:600]}")
        return None
    dest.write_bytes(audio)
    print(f"  score saved {dest.name} mime={mime} bytes={dest.stat().st_size}")
    return dest


def find_ffmpeg() -> str | None:
    for candidate in (
        "ffmpeg",
        "/opt/homebrew/bin/ffmpeg",
        "/usr/local/bin/ffmpeg",
    ):
        try:
            subprocess.run([candidate, "-version"], check=True, capture_output=True)
            return candidate
        except (FileNotFoundError, subprocess.CalledProcessError):
            continue
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return None


def render_voiceover(key: str, spec: dict) -> Path:
    dest = OUT / "vo" / "spot.wav"
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"  tts cache spot.wav {wav_seconds(dest):.1f}s")
        return dest
    scene = {"id": "spot", "voice": spec["voiceover"]}
    return render_tts(key, spec, scene)


def assemble_spot(spec: dict, clips: list[Path], vo: Path, score: Path | None) -> Path | None:
    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("ffmpeg ausente")
        return None
    concat_list = OUT / "concat.txt"
    concat_list.write_text("".join(f"file '{p.resolve()}'\n" for p in clips))
    bed = OUT / "bed.mp4"
    subprocess.run(
        [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(bed)],
        check=True,
        capture_output=True,
    )
    vo_s = wav_seconds(vo)
    max_s = float(spec.get("maxSeconds") or 30)
    duration = min(max(vo_s, 8.0), max_s)
    mixed = OUT / "adaptive-layer-labs-30.mp4"
    score_filter = ""
    inputs = ["-i", str(bed), "-i", str(vo)]
    if score and score.exists():
        inputs.extend(["-stream_loop", "-1", "-i", str(score)])
        score_filter = ";[2:a]volume=0.16,aresample=48000[m];[mix][m]amix=inputs=2:duration=first:dropout_transition=1[a]"
        map_a = "[a]"
        amb_vo = (
            "[0:a]volume=0.10,aresample=48000[amb];"
            "[1:a]aresample=48000,volume=1.15[vo];"
            "[amb][vo]amix=inputs=2:duration=first:dropout_transition=0.2[mix]"
        )
    else:
        map_a = "[mix]"
        amb_vo = (
            "[0:a]volume=0.10,aresample=48000[amb];"
            "[1:a]aresample=48000,volume=1.15[vo];"
            "[amb][vo]amix=inputs=2:duration=first:dropout_transition=0.2[mix]"
        )
    cmd = [
        ffmpeg,
        "-y",
        *inputs,
        "-filter_complex",
        (
            f"[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,"
            f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=24,format=yuv420p,trim=duration={duration:.2f},setpts=PTS-STARTPTS[v];"
            f"{amb_vo}{score_filter}"
        ),
        "-map",
        "[v]",
        "-map",
        map_a,
        "-t",
        f"{duration:.2f}",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        str(mixed),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"FILM {mixed} {mixed.stat().st_size} bytes {duration:.1f}s")
    return mixed


def assemble(spec: dict, clips: list[Path], vos: list[Path], score: Path | None) -> Path | None:
    ffmpeg = find_ffmpeg()
    if not ffmpeg:
        print("ffmpeg ausente — clips e VOs prontos, sem montagem final")
        return None
    parts_dir = OUT / "parts"
    parts_dir.mkdir(parents=True, exist_ok=True)
    concat_list = OUT / "concat.txt"
    built: list[Path] = []
    for scene, clip, vo in zip(spec["scenes"], clips, vos, strict=True):
        part = parts_dir / f"{scene['id']}.mp4"
        vo_s = wav_seconds(vo)
        cmd = [
            ffmpeg,
            "-y",
            "-i",
            str(clip),
            "-i",
            str(vo),
            "-filter_complex",
            (
                f"[0:v]tpad=stop_mode=clone:stop_duration={max(vo_s - spec['durationSeconds'], 0):.2f},"
                "scale=1920:1080:force_original_aspect_ratio=decrease,"
                "pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=24,format=yuv420p[v];"
                "[0:a]volume=0.18,aresample=48000[amb];"
                "[1:a]aresample=48000[vo];"
                "[amb][vo]amix=inputs=2:duration=longest:dropout_transition=0.3[a]"
            ),
            "-map",
            "[v]",
            "-map",
            "[a]",
            "-t",
            f"{vo_s:.2f}",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            str(part),
        ]
        print(f"  mix {scene['id']}")
        subprocess.run(cmd, check=True, capture_output=True)
        built.append(part)
    concat_list.write_text("".join(f"file '{p.resolve()}'\n" for p in built))
    cut = OUT / "adaptive-layer-cinema-vo.mp4"
    subprocess.run(
        [ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(cut)],
        check=True,
        capture_output=True,
    )
    final = OUT / "adaptive-layer-cinema.mp4"
    if score and score.exists():
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-i",
                str(cut),
                "-stream_loop",
                "-1",
                "-i",
                str(score),
                "-filter_complex",
                "[1:a]volume=0.22[m];[0:a][m]amix=inputs=2:duration=first:dropout_transition=2[a]",
                "-map",
                "0:v",
                "-map",
                "[a]",
                "-c:v",
                "copy",
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                "-shortest",
                str(final),
            ],
            check=True,
            capture_output=True,
        )
    else:
        cut.replace(final)
    print(f"FILM {final} {final.stat().st_size} bytes")
    return final


def main(argv: list[str] | None = None) -> None:
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--spec", default=str(SPEC_PATH))
    parser.add_argument("--out", default=str(OUT))
    args = parser.parse_args(argv)
    configure(Path(args.spec), Path(args.out))
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "vo").mkdir(exist_ok=True)
    (OUT / "clips").mkdir(exist_ok=True)
    spec = json.loads(SPEC_PATH.read_text())
    key = load_key()
    print("SPEC", SPEC_PATH.name, "OUT", OUT)
    print("== TTS ==")
    if spec.get("format") == "spot" and spec.get("voiceover"):
        vo = render_voiceover(key, spec)
        vos = [vo]
    else:
        vos = [render_tts(key, spec, scene) for scene in spec["scenes"]]
        vo = None
    print("== SCORE ==")
    score = render_score(key, spec)
    print("== VEO ==")
    clips = [render_scene_video(key, spec, scene) for scene in spec["scenes"]]
    print("== MONTAR ==")
    if spec.get("format") == "spot" and vo is not None:
        assemble_spot(spec, clips, vo, score)
    else:
        assemble(spec, clips, vos, score)
    print("DONE", OUT)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print("FAIL", exc, file=sys.stderr)
        sys.exit(1)

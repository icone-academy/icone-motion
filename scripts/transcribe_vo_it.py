"""Transcribe Italian VO with segment timestamps using faster-whisper."""
from faster_whisper import WhisperModel
import json

audio = r"c:\Users\Meneses\Trabalho\icone-academy\icone-motion\public\audio\vo-it-16k.wav"
out = r"c:\Users\Meneses\Trabalho\icone-academy\icone-motion\public\audio\vo-it-transcript.json"

print("Loading model (small)...")
model = WhisperModel("small", device="cpu", compute_type="int8")
print("Transcribing (it)...")
segments, info = model.transcribe(
    audio,
    language="it",
    vad_filter=True,
    word_timestamps=False,
)

rows = []
for seg in segments:
    rows.append({"start": round(seg.start, 2), "end": round(seg.end, 2), "text": seg.text.strip()})
    print(f"[{seg.start:7.2f} -> {seg.end:7.2f}] {seg.text.strip()}")

payload = {
    "language": info.language,
    "duration": info.duration,
    "segments": rows,
}
with open(out, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)
print(f"\nWrote {len(rows)} segments → {out}")
print(f"Duration: {info.duration}")

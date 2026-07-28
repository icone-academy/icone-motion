/**
 * Transcribe vo-it with Whisper via @xenova/transformers (offline-ish, downloads model once).
 * Usage: node scripts/transcribe-vo-it.mjs
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {pipeline} from '@xenova/transformers';
import wavefile from 'wavefile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const wavPath = path.join(root, 'public/audio/vo-it-16k.wav');
const outPath = path.join(root, 'public/audio/vo-it-transcript.json');

const buffer = fs.readFileSync(wavPath);
const wav = new wavefile.WaveFile(buffer);
wav.toBitDepth('32f');
wav.toSampleRate(16000);
let audioData = wav.getSamples();
if (Array.isArray(audioData)) audioData = audioData[0];

console.log('Loading whisper-small...');
const transcriber = await pipeline(
  'automatic-speech-recognition',
  'Xenova/whisper-small',
);

console.log('Transcribing IT...');
const result = await transcriber(audioData, {
  language: 'italian',
  task: 'transcribe',
  return_timestamps: true,
  chunk_length_s: 30,
  stride_length_s: 5,
});

const chunks = result.chunks ?? [];
const segments = chunks.map((c) => ({
  start: Math.round((c.timestamp?.[0] ?? 0) * 100) / 100,
  end: Math.round((c.timestamp?.[1] ?? 0) * 100) / 100,
  text: (c.text ?? '').trim(),
}));

const duration =
  segments.length > 0
    ? segments[segments.length - 1].end
    : audioData.length / 16000;

const payload = {
  language: 'it',
  duration,
  note: 'Timestamps from Xenova/whisper-small on vo-it.mp3 (ElevenLabs 2026-07-28).',
  segments,
};

fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
for (const s of segments) {
  console.log(`[${s.start.toFixed(2)} -> ${s.end.toFixed(2)}] ${s.text}`);
}
console.log(`\nWrote ${segments.length} segments → ${outPath}`);
console.log(`Duration: ${duration}`);

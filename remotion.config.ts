import {Config} from '@remotion/cli/config';
import os from 'os';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');

/**
 * Encoding no Windows com Node recente + concorrência alta pode
 * disparar kill EBADF no FFmpeg. Limitar concorrência estabiliza.
 *
 * O FFmpeg empacotado do Remotion crashava neste Windows; o script
 * scripts/ensure-ffmpeg.ps1 (predev/prerender/postinstall) substitui
 * ffmpeg.exe/ffprobe.exe por um build estático BtbN **7.1** (não master).
 * Master recente removeu `-filter_script`, que o Remotion 4.0.x ainda usa
 * no preprocess de áudio.
 *
 * Remotion mapeia audioCodec "aac" → libfdk_aac, que o GPL não tem
 * (e compress-audio não passa por overrideFfmpegCommand). Usamos mp3
 * (libmp3lame), disponível no build GPL.
 */
const cpus = os.cpus().length;
Config.setConcurrency(Math.max(1, Math.min(4, cpus - 1)));
Config.setAudioCodec('mp3');

Config.overrideFfmpegCommand(({args}) => {
  return args.map((arg) => (arg === 'libfdk_aac' ? 'aac' : arg));
});

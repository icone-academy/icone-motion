import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

if (process.platform !== 'win32') {
  console.log(
    `[ensure-ffmpeg] ${process.platform}: usando o compositor nativo do Remotion; patch do Windows ignorado.`,
  );
  process.exit(0);
}

const scriptPath = fileURLToPath(new URL('./ensure-ffmpeg.ps1', import.meta.url));
const candidates = ['powershell.exe', 'powershell', 'pwsh.exe', 'pwsh'];

for (const executable of candidates) {
  const result = spawnSync(
    executable,
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath],
    {stdio: 'inherit'},
  );

  if (result.error?.code === 'ENOENT') {
    continue;
  }

  if (result.error) {
    console.error(`[ensure-ffmpeg] Não foi possível iniciar ${executable}.`);
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}

console.error(
  '[ensure-ffmpeg] Windows detectado, mas PowerShell não foi encontrado. Instale o PowerShell 5+ ou PowerShell 7 (pwsh).',
);
process.exit(1);

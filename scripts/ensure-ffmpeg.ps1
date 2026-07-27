# Ensures Remotion uses a working FFmpeg on Windows.
# The bundled ffmpeg.exe from @remotion\compositor-win32-x64-msvc
# crashes on this machine (exit 0xC0E90002). We overlay a static
# BtbN build kept in bin/ffmpeg/.
#
# IMPORTANT: do NOT use ffmpeg-master — recent master builds removed
# -filter_script, which Remotion 4.0.x still needs for audio preprocess.
# Pin to FFmpeg 7.1 (still has filter_script).
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\scripts\ensure-ffmpeg.ps1

$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$portableDir = Join-Path $root 'bin\ffmpeg'
$compositorDir = Join-Path $root 'node_modules\@remotion\compositor-win32-x64-msvc'
$zipPath = Join-Path $root 'bin\ffmpeg-btbn.zip'
$tmpDir = Join-Path $root 'bin\ffmpeg-tmp'
$markerPath = Join-Path $portableDir 'VERSION.txt'
# Stable 7.1 — has -filter_script (master nightly does not)
$ffmpegVersionTag = 'n7.1'
$url = 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n7.1-latest-win64-gpl-7.1.zip'

Write-Host '=== ensure-ffmpeg ===' -ForegroundColor Cyan

if (-not (Test-Path $compositorDir)) {
  Write-Host 'ERROR: compositor package missing. Run npm install first.' -ForegroundColor Red
  exit 1
}

function Test-HasFilterScript([string]$ffmpegPath) {
  if (-not (Test-Path $ffmpegPath)) { return $false }
  $help = & $ffmpegPath -hide_banner -h full 2>&1 | Out-String
  return ($help -match 'filter_script')
}

$portableFfmpeg = Join-Path $portableDir 'ffmpeg.exe'
$needDownload = $true

if (Test-Path $portableFfmpeg) {
  $markerOk = (Test-Path $markerPath) -and ((Get-Content $markerPath -Raw).Trim() -eq $ffmpegVersionTag)
  $hasFilter = Test-HasFilterScript $portableFfmpeg
  if ($markerOk -and $hasFilter) {
    $needDownload = $false
    Write-Host "Using cached FFmpeg $ffmpegVersionTag (filter_script OK)" -ForegroundColor DarkGray
  }
  else {
    Write-Host 'Cached FFmpeg is master/outdated or missing filter_script — redownloading 7.1...' -ForegroundColor Yellow
  }
}

if ($needDownload) {
  Write-Host "Downloading portable FFmpeg $ffmpegVersionTag (BtbN)..." -ForegroundColor Yellow
  New-Item -ItemType Directory -Force -Path (Join-Path $root 'bin') | Out-Null
  if (Test-Path $portableDir) { Remove-Item $portableDir -Recurse -Force }
  if (Test-Path $tmpDir) { Remove-Item $tmpDir -Recurse -Force }
  Invoke-WebRequest -Uri $url -OutFile $zipPath
  Expand-Archive -Path $zipPath -DestinationPath $tmpDir -Force
  New-Item -ItemType Directory -Force -Path $portableDir | Out-Null
  $ff = Get-ChildItem $tmpDir -Recurse -Filter ffmpeg.exe | Select-Object -First 1
  $fp = Get-ChildItem $tmpDir -Recurse -Filter ffprobe.exe | Select-Object -First 1
  if (-not $ff -or -not $fp) {
    Write-Host 'ERROR: ffmpeg/ffprobe not found in archive.' -ForegroundColor Red
    exit 1
  }
  Copy-Item $ff.FullName (Join-Path $portableDir 'ffmpeg.exe') -Force
  Copy-Item $fp.FullName (Join-Path $portableDir 'ffprobe.exe') -Force
  Set-Content -Path $markerPath -Value $ffmpegVersionTag -NoNewline
  Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
  Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "Downloaded FFmpeg $ffmpegVersionTag to bin/ffmpeg/" -ForegroundColor Green

  if (-not (Test-HasFilterScript (Join-Path $portableDir 'ffmpeg.exe'))) {
    Write-Host 'ERROR: downloaded FFmpeg still lacks -filter_script.' -ForegroundColor Red
    exit 1
  }
}

Write-Host 'Overlaying ffmpeg/ffprobe into Remotion compositor package...' -ForegroundColor Yellow
Copy-Item (Join-Path $portableDir 'ffmpeg.exe') (Join-Path $compositorDir 'ffmpeg.exe') -Force
Copy-Item (Join-Path $portableDir 'ffprobe.exe') (Join-Path $compositorDir 'ffprobe.exe') -Force
Unblock-File (Join-Path $compositorDir 'ffmpeg.exe') -ErrorAction SilentlyContinue
Unblock-File (Join-Path $compositorDir 'ffprobe.exe') -ErrorAction SilentlyContinue

Write-Host 'Testing ffmpeg...' -ForegroundColor Yellow
& (Join-Path $compositorDir 'ffmpeg.exe') -version | Select-Object -First 1
if (-not (Test-HasFilterScript (Join-Path $compositorDir 'ffmpeg.exe'))) {
  Write-Host 'ERROR: compositor ffmpeg lacks -filter_script after overlay.' -ForegroundColor Red
  exit 1
}
Write-Host 'filter_script: OK' -ForegroundColor Green

Write-Host 'Done. Remotion encode should work now.' -ForegroundColor Green
Write-Host 'Tip: use Node 20 or 22 LTS (not 24) to avoid kill EBADF races.' -ForegroundColor DarkYellow

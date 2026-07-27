# Fix Remotion "spawn UNKNOWN" on Windows
# Cause: Smart App Control (Controle de Aplicativos Inteligente) blocks remotion.exe
#
# Run in PowerShell (as Administrator for the SAC step):
#   powershell -ExecutionPolicy Bypass -File .\scripts\fix-compositor.ps1

$ErrorActionPreference = 'Continue'
$compositorDir = Join-Path $PSScriptRoot '..\node_modules\@remotion\compositor-win32-x64-msvc'
$compositorDir = Resolve-Path $compositorDir -ErrorAction SilentlyContinue

Write-Host ''
Write-Host '=== ICone Motion · fix Remotion compositor ===' -ForegroundColor Cyan
Write-Host ''

if (-not $compositorDir) {
  Write-Host 'ERROR: compositor package not found. Run npm install first.' -ForegroundColor Red
  exit 1
}

$exe = Join-Path $compositorDir 'remotion.exe'
if (-not (Test-Path $exe)) {
  Write-Host "ERROR: remotion.exe missing at $exe" -ForegroundColor Red
  exit 1
}

Write-Host "1) Unblocking files in:" -ForegroundColor Yellow
Write-Host "   $compositorDir"
Get-ChildItem $compositorDir -Include *.exe,*.dll -Recurse | ForEach-Object {
  Unblock-File -Path $_.FullName -ErrorAction SilentlyContinue
}
Write-Host '   Done.' -ForegroundColor Green

Write-Host ''
Write-Host '2) Checking Smart App Control...' -ForegroundColor Yellow
$sac = $null
try {
  $sac = (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\CI\Policy' -Name VerifiedAndReputablePolicyState -ErrorAction Stop).VerifiedAndReputablePolicyState
} catch {
  Write-Host '   Could not read SAC registry key.' -ForegroundColor DarkYellow
}

# 0 = Off, 1 = On (Enforcement), 2 = Evaluation
switch ($sac) {
  0 { Write-Host '   Smart App Control is OFF. Good.' -ForegroundColor Green }
  1 {
    Write-Host '   Smart App Control is ON (Enforcement) — this blocks remotion.exe.' -ForegroundColor Red
    Write-Host ''
    Write-Host '   Opening Windows Settings so you can turn it OFF:' -ForegroundColor Yellow
    Write-Host '   Settings > Privacy & security > Windows Security > App & browser control' -ForegroundColor White
    Write-Host '   > Smart App Control settings > Off' -ForegroundColor White
    Write-Host ''
    Start-Process 'windowsdefender://appbrowser'
    Start-Process 'ms-settings:windowsdefender'

    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
      [Security.Principal.WindowsBuiltInRole]::Administrator
    )
    if ($isAdmin) {
      Write-Host '   Admin session detected — setting SAC to Off via registry...' -ForegroundColor Yellow
      Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CI\Policy' -Name 'VerifiedAndReputablePolicyState' -Value 0 -Type DWord
      Write-Host '   Registry updated. A reboot may be required.' -ForegroundColor Green
    } else {
      Write-Host '   Tip: re-run this script as Administrator to flip SAC off automatically,' -ForegroundColor DarkYellow
      Write-Host '   or turn it Off manually in Windows Security (requires reboot).' -ForegroundColor DarkYellow
    }
  }
  2 { Write-Host '   Smart App Control is in Evaluation mode (usually OK).' -ForegroundColor Green }
  default { Write-Host "   SAC state: $sac" -ForegroundColor DarkYellow }
}

Write-Host ''
Write-Host '3) Testing remotion.exe spawn...' -ForegroundColor Yellow
try {
  $p = Start-Process -FilePath $exe -ArgumentList '{}' -WorkingDirectory $compositorDir -PassThru -Wait -WindowStyle Hidden -RedirectStandardError "$env:TEMP\remotion-comp-err.txt" -RedirectStandardOutput "$env:TEMP\remotion-comp-out.txt"
  Write-Host "   Process exited with code $($p.ExitCode) (spawn worked)." -ForegroundColor Green
} catch {
  Write-Host "   STILL BLOCKED: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host ''
  Write-Host '   After turning Smart App Control Off, reboot Windows, then run:' -ForegroundColor Yellow
  Write-Host '     npm run render' -ForegroundColor White
  exit 2
}

Write-Host ''
Write-Host 'Compositor is runnable. Try: npm run render' -ForegroundColor Green
Write-Host ''

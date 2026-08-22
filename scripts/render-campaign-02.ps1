$ErrorActionPreference = "Stop"

$outputs = @(
    @{ Composition = "Campaign02Vertical20s"; File = "out/campaign-02/icone-campaign-02-vertical.mp4" },
    @{ Composition = "Campaign02Square20s"; File = "out/campaign-02/icone-campaign-02-square.mp4" },
    @{ Composition = "Campaign02Horizontal20s"; File = "out/campaign-02/icone-campaign-02-horizontal.mp4" }
)

New-Item -ItemType Directory -Force -Path "out/campaign-02" | Out-Null

foreach ($output in $outputs) {
    Write-Host "Rendering $($output.Composition)..."
    npx remotion render $output.Composition $output.File --codec=h264 --crf=18 --pixel-format=yuv420p --muted

    $videoOnlyFile = $output.File -replace '\.mp4$', '.video-only.mp4'
    & ".\bin\ffmpeg\ffmpeg.exe" -y -i $output.File -map 0:v:0 -c:v copy -an -movflags +faststart $videoOnlyFile
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to prepare the video-only delivery file $($output.File)."
    }

    Move-Item -LiteralPath $videoOnlyFile -Destination $output.File -Force
}

Write-Host "Campaign 02 rendered without audio."

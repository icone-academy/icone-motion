$ErrorActionPreference = "Stop"

$outputs = @(
    @{ Composition = "Campaign01Vertical15s"; File = "out/campaign-01/icone-campaign-01-vertical.mp4" },
    @{ Composition = "Campaign01Square15s"; File = "out/campaign-01/icone-campaign-01-square.mp4" },
    @{ Composition = "Campaign01Horizontal15s"; File = "out/campaign-01/icone-campaign-01-horizontal.mp4" }
)

New-Item -ItemType Directory -Force -Path "out/campaign-01" | Out-Null

foreach ($output in $outputs) {
    Write-Host "Rendering $($output.Composition)..."
    npx remotion render $output.Composition $output.File --codec=h264 --crf=18 --pixel-format=yuv420p

    $deliveryFile = $output.File -replace '\.mp4$', '.delivery.mp4'
    & ".\bin\ffmpeg\ffmpeg.exe" -y -i $output.File -map 0:v:0 -map 0:a:0 -c:v copy -c:a aac -b:a 192k -movflags +faststart $deliveryFile
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to prepare the synchronized delivery file $($output.File)."
    }

    Move-Item -LiteralPath $deliveryFile -Destination $output.File -Force
}

Write-Host "Campaign 01 rendered with synchronized voiceover."

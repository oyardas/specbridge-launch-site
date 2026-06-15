param(
    [int] = 8088
)

Stop = "Stop"
Clear-Host

Set-Location "C:\Dev\specbridge-launch-site"

Write-Host "=== SPECBRIDGE LAUNCH SITE PREVIEW ==="
Write-Host "Folder: C:\Dev\specbridge-launch-site"
Write-Host "URL: http://127.0.0.1:"
Write-Host ""

python -m http.server 

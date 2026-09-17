# AURA SENTINEL - PowerShell 1-Click MVP Launcher
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  AURA SENTINEL - AI CYBER RISK QUANTIFICATION PLATFORM" -ForegroundColor White
Write-Host "  SIH26105 | THEME: Blockchain & Cybersecurity | AICTE Cyber Cell" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

# Clear old processes on ports 8000, 5173, 5174
Get-NetTCPConnection -LocalPort 8000, 5173, 5174 -State Listen -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

Write-Host "`n[*] Starting Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\Backend`" && python main.py" -WindowStyle Minimized

Write-Host "[*] Starting Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\Frontend`" && npm.cmd run dev" -WindowStyle Minimized

Write-Host "[*] Initializing servers..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "[*] Opening AURA Command Center in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host "`n[✓] AURA Sentinel is LIVE (10 Engines Online)!" -ForegroundColor Green

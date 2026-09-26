@echo off
title AURA Sentinel - Executive SOC Console (SIH 2026)
color 0B
echo ===============================================================================
echo            AURA SENTINEL - EXECUTIVE SOC CONSOLE LAUNCHER
echo          Problem Statement: SIH26105 ^| Team: ByteForce_1 (ID: 180219)
echo ===============================================================================
echo.

echo [1/3] Starting FastAPI Backend Server on http://127.0.0.1:8000 ...
start "AURA Backend API" cmd /k "cd Backend && python -m uvicorn executive_server:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting React Vite Frontend Console on http://127.0.0.1:5173 ...
start "AURA Frontend Console" cmd /k "cd Frontend && npm.cmd run dev -- --host 127.0.0.1 --port 5173"

timeout /t 2 /nobreak >nul

echo [3/3] Opening Executive SOC Console in Default Browser ...
start http://localhost:5173/

echo.
echo ===============================================================================
echo     SUCCESS: AURA Sentinel Executive SOC Console is running live!
echo     - Frontend: http://localhost:5173/
echo     - Backend API: http://localhost:8000/docs
echo ===============================================================================
pause

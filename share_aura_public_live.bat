@echo off
title AURA SENTINEL - PUBLIC LIVE TUNNEL (FOR JUDGES & MOBILE)
color 0A
cls
echo ==============================================================================
echo   AURA SENTINEL - PUBLIC LIVE DEMO TUNNEL (SIH26105)
echo   Generates an instant public HTTPS link & QR Code for Judges or Phone
echo ==============================================================================
echo.
echo [*] Launching secure public tunnel on port 5173...
echo [*] Scan the QR code below on your phone OR copy the HTTPS link for Judges!
echo.
echo ------------------------------------------------------------------------------
ssh -p 443 -o StrictHostKeyChecking=no -R0:localhost:5173 qr@a.pinggy.io
pause

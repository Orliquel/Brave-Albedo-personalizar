@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0TESTAR-3.2.ps1"
if errorlevel 1 pause

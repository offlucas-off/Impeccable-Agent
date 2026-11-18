@echo off
chcp 65001 >nul
title Pixelizer 3D Engine - Studio & Dev Server
cd /d "%~dp0"

echo ========================================================
echo   PIXELIZER 3D ENGINE - NWL PRODUCTION STUDIO
echo   Pasta: %CD%
echo ========================================================
echo.

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Node.js / npm nao encontrado no PATH.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Instalando dependencias ^(npm install^)...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERRO] Falha ao instalar dependencias.
        pause
        exit /b 1
    )
)

echo [INFO] Iniciando servidor Vite e abrindo no navegador...
echo [DICA] Pressione Ctrl+C para encerrar o servidor.
echo.
call npm run start

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] O servidor encerrou com codigo de erro %ERRORLEVEL%.
    pause
)

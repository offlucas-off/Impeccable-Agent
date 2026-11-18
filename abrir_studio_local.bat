@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
if exist "iniciar_studio.bat" (
  call "iniciar_studio.bat"
  exit /b %ERRORLEVEL%
)
echo === Pixelizer 3D Engine & NWL Production Studio ===
if not exist "node_modules" (
  echo Instalando dependencias pela primeira vez...
  call npm install
  if errorlevel 1 (
    echo Erro ao executar npm install. Verifique se o Node.js 18+ esta instalado.
    pause
    exit /b 1
  )
)
echo Abrindo Studio no navegador...
call npm run start
endlocal

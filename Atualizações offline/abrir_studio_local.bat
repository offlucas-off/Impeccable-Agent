@echo off
setlocal
cd /d "%~dp0"
echo === Pixelizer 3D Engine & UAL AnimViewer Studio ===
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

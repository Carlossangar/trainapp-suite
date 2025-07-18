@echo off
echo ====================================
echo    TrainApp Windows Deploy Script
echo ====================================
echo.

REM Configuracion (EDITAR ESTOS VALORES)
set VPS_IP=tu-vps-ip
set VPS_USER=tu-usuario
set VPS_PATH=/opt/trainapp

echo Configuracion actual:
echo VPS IP: %VPS_IP%
echo Usuario: %VPS_USER%
echo Ruta: %VPS_PATH%
echo.

REM Verificar si SSH esta disponible
ssh -V >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: SSH no esta disponible en este sistema
    echo Por favor instala OpenSSH o usa WSL
    pause
    exit /b 1
)

echo Selecciona una opcion:
echo 1. Transferir archivos con SCP
echo 2. Transferir y desplegar automaticamente
echo 3. Solo ejecutar deploy en VPS
echo 4. Salir
echo.

set /p choice=Ingresa tu opcion (1-4): 

if "%choice%"=="1" goto transfer_only
if "%choice%"=="2" goto transfer_and_deploy
if "%choice%"=="3" goto deploy_only
if "%choice%"=="4" goto exit
goto invalid_choice

:transfer_only
echo.
echo Transfiriendo archivos...
scp -r . %VPS_USER%@%VPS_IP%:%VPS_PATH%
if %errorlevel% neq 0 (
    echo ERROR: Fallo la transferencia
    pause
    exit /b 1
)
echo Transferencia completada!
goto end

:transfer_and_deploy
echo.
echo Transfiriendo archivos...
scp -r . %VPS_USER%@%VPS_IP%:%VPS_PATH%
if %errorlevel% neq 0 (
    echo ERROR: Fallo la transferencia
    pause
    exit /b 1
)
echo.
echo Ejecutando deploy en VPS...
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && chmod +x deploy.sh && sudo ./deploy.sh"
if %errorlevel% neq 0 (
    echo ERROR: Fallo el deploy
    pause
    exit /b 1
)
echo Deploy completado!
goto end

:deploy_only
echo.
echo Ejecutando deploy en VPS...
ssh %VPS_USER%@%VPS_IP% "cd %VPS_PATH% && chmod +x deploy.sh && sudo ./deploy.sh"
if %errorlevel% neq 0 (
    echo ERROR: Fallo el deploy
    pause
    exit /b 1
)
echo Deploy completado!
goto end

:invalid_choice
echo Opcion invalida
goto end

:end
echo.
echo Proceso terminado.
pause
exit /b 0

:exit
echo Saliendo...
exit /b 0
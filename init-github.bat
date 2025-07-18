@echo off
echo ====================================
echo    TrainApp Suite - GitHub Setup
echo ====================================
echo.

echo Este script configurara tu repositorio GitHub
echo.

REM Verificar si Git esta instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git no esta instalado
    echo Por favor instala Git desde: https://git-scm.com/
    pause
    exit /b 1
)

echo Git encontrado ✓
echo.

REM Verificar si ya es un repositorio git
if exist .git (
    echo Este directorio ya es un repositorio Git
    echo ¿Deseas continuar? (S/N)
    set /p continue=
    if /i not "%continue%"=="S" (
        echo Proceso cancelado
        pause
        exit /b 0
    )
) else (
    echo Inicializando repositorio Git...
    git init
    echo.
)

REM Configurar usuario (si no esta configurado)
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo Configurando usuario Git...
    set /p username=Ingresa tu nombre de usuario: 
    set /p email=Ingresa tu email: 
    git config user.name "%username%"
    git config user.email "%email%"
    echo.
)

REM Agregar archivos
echo Agregando archivos al repositorio...
git add .
echo.

REM Crear commit inicial
echo Creando commit inicial...
git commit -m "Initial commit: TrainApp Suite - Complete fitness tracking application"
echo.

echo ====================================
echo    Configuracion de GitHub
echo ====================================
echo.
echo Ahora necesitas:
echo 1. Ir a https://github.com/new
echo 2. Crear un repositorio llamado: trainapp-suite
echo 3. NO inicializar con README, .gitignore, o license
echo 4. Copiar la URL del repositorio
echo.

set /p repo_url=Pega la URL del repositorio (https://github.com/tu-usuario/trainapp-suite.git): 

echo.
echo Configurando repositorio remoto...
git remote add origin %repo_url%
echo.

echo Subiendo codigo a GitHub...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo al subir el codigo
    echo Verifica que:
    echo 1. La URL del repositorio es correcta
    echo 2. Tienes permisos para escribir en el repositorio
    echo 3. Tu autenticacion GitHub esta configurada
    echo.
    echo Para configurar autenticacion:
    echo https://docs.github.com/es/authentication
    pause
    exit /b 1
)

echo.
echo ====================================
echo    ¡Exito! ✓
echo ====================================
echo.
echo Tu codigo ha sido subido a GitHub
echo Repositorio: %repo_url%
echo.
echo Proximos pasos:
echo 1. Verifica tu repositorio en GitHub
echo 2. Actualiza los archivos con tu usuario real
echo 3. Usa los scripts de deploy para tu VPS
echo.

pause
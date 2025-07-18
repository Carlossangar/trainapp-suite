# TrainApp Windows PowerShell Deploy Script
param(
    [string]$VpsIP = "135.125.238.161",
    [string]$VpsUser = "debian",
    [string]$VpsPath = "/opt/trainapp",
    [switch]$TransferOnly,
    [switch]$DeployOnly,
    [switch]$Help
)

function Write-ColorOutput([string]$text, [string]$color = "White") {
    Write-Host $text -ForegroundColor $color
}

function Show-Help {
    Write-ColorOutput "TrainApp Windows Deploy Script" "Cyan"
    Write-ColorOutput "================================" "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "Uso:" "Yellow"
    Write-ColorOutput "  .\windows-deploy.ps1 -VpsIP <ip> -VpsUser <usuario> [opciones]" "White"
    Write-ColorOutput ""
    Write-ColorOutput "Parámetros:" "Yellow"
    Write-ColorOutput "  -VpsIP      IP del VPS" "White"
    Write-ColorOutput "  -VpsUser    Usuario del VPS" "White"
    Write-ColorOutput "  -VpsPath    Ruta en el VPS (default: /opt/trainapp)" "White"
    Write-ColorOutput ""
    Write-ColorOutput "Opciones:" "Yellow"
    Write-ColorOutput "  -TransferOnly    Solo transferir archivos" "White"
    Write-ColorOutput "  -DeployOnly      Solo ejecutar deploy" "White"
    Write-ColorOutput "  -Help           Mostrar esta ayuda" "White"
    Write-ColorOutput ""
    Write-ColorOutput "Ejemplos:" "Yellow"
    Write-ColorOutput "  .\windows-deploy.ps1 -VpsIP 192.168.1.100 -VpsUser ubuntu" "White"
    Write-ColorOutput "  .\windows-deploy.ps1 -VpsIP 192.168.1.100 -VpsUser root -TransferOnly" "White"
}

if ($Help) {
    Show-Help
    exit 0
}

if ($VpsIP -eq "tu-vps-ip" -or $VpsUser -eq "tu-usuario") {
    Write-ColorOutput "Error: Debes especificar la IP y usuario del VPS" "Red"
    Write-ColorOutput "Uso: .\windows-deploy.ps1 -VpsIP <ip> -VpsUser <usuario>" "Yellow"
    exit 1
}

Write-ColorOutput "=====================================" "Cyan"
Write-ColorOutput "    TrainApp Windows Deploy Script" "Cyan"
Write-ColorOutput "=====================================" "Cyan"
Write-ColorOutput ""
Write-ColorOutput "Configuración:" "Yellow"
Write-ColorOutput "  VPS IP: $VpsIP" "White"
Write-ColorOutput "  Usuario: $VpsUser" "White"
Write-ColorOutput "  Ruta: $VpsPath" "White"
Write-ColorOutput ""

# Verificar si SSH está disponible
try {
    $null = Get-Command ssh -ErrorAction Stop
    Write-ColorOutput "✓ SSH disponible" "Green"
} catch {
    Write-ColorOutput "✗ SSH no encontrado. Por favor instala OpenSSH." "Red"
    Write-ColorOutput "Instalación: Settings > Apps > Optional Features > OpenSSH Client" "Yellow"
    exit 1
}

# Verificar si SCP está disponible
try {
    $null = Get-Command scp -ErrorAction Stop
    Write-ColorOutput "✓ SCP disponible" "Green"
} catch {
    Write-ColorOutput "✗ SCP no encontrado" "Red"
    exit 1
}

# Verificar conectividad
Write-ColorOutput "Verificando conectividad..." "Yellow"
$testConnection = Test-Connection -ComputerName $VpsIP -Count 1 -Quiet
if (-not $testConnection) {
    Write-ColorOutput "✗ No se puede conectar al VPS" "Red"
    exit 1
}
Write-ColorOutput "✓ Conectividad verificada" "Green"
Write-ColorOutput ""

if ($TransferOnly) {
    Write-ColorOutput "Transfiriendo archivos..." "Yellow"
    
    # Excluir archivos innecesarios
    $excludeFiles = @(
        "node_modules", 
        "dist", 
        "logs", 
        "*.log", 
        ".git",
        "server\database\*.db"
    )
    
    # Crear archivo temporal con exclusiones
    $tempExcludeFile = [System.IO.Path]::GetTempFileName()
    $excludeFiles | Out-File -FilePath $tempExcludeFile -Encoding ASCII
    
    try {
        # Transferir archivos
        scp -r -q . "${VpsUser}@${VpsIP}:${VpsPath}"
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ Transferencia completada" "Green"
        } else {
            Write-ColorOutput "✗ Error en la transferencia" "Red"
            exit 1
        }
    } finally {
        Remove-Item $tempExcludeFile -Force -ErrorAction SilentlyContinue
    }
} 
elseif ($DeployOnly) {
    Write-ColorOutput "Ejecutando deploy en VPS..." "Yellow"
    
    $deployCommand = "cd $VpsPath && chmod +x deploy.sh && sudo ./deploy.sh"
    ssh "${VpsUser}@${VpsIP}" $deployCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✓ Deploy completado" "Green"
    } else {
        Write-ColorOutput "✗ Error en el deploy" "Red"
        exit 1
    }
} 
else {
    # Transferir y desplegar
    Write-ColorOutput "Transfiriendo archivos..." "Yellow"
    
    scp -r -q . "${VpsUser}@${VpsIP}:${VpsPath}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✓ Transferencia completada" "Green"
        Write-ColorOutput ""
        Write-ColorOutput "Ejecutando deploy en VPS..." "Yellow"
        
        $deployCommand = "cd $VpsPath && chmod +x deploy.sh && sudo ./deploy.sh"
        ssh "${VpsUser}@${VpsIP}" $deployCommand
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ Deploy completado" "Green"
        } else {
            Write-ColorOutput "✗ Error en el deploy" "Red"
            exit 1
        }
    } else {
        Write-ColorOutput "✗ Error en la transferencia" "Red"
        exit 1
    }
}

Write-ColorOutput ""
Write-ColorOutput "🎉 Proceso completado exitosamente!" "Green"
Write-ColorOutput "Tu aplicación debería estar disponible en: http://$VpsIP" "Cyan"
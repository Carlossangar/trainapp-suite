# 🚀 Despliegue desde Windows a VPS

Esta guía te ayudará a llevar tu aplicación TrainApp desde Windows a tu VPS de forma fácil y segura.

## 📋 Prerequisitos

### En Windows:
- Git instalado
- OpenSSH Client (Windows 10/11 lo incluye por defecto)
- PowerShell 5.1 o superior
- Acceso SSH a tu VPS

### En tu VPS:
- Ubuntu 20.04+ o Debian 10+
- Acceso root o sudo
- Puerto 22 (SSH) abierto

## 🎯 Métodos de Despliegue

### **Método 1: GitHub (Recomendado)**

**1. Sube tu código a GitHub:**
```bash
# En el directorio trainapp
git init
git add .
git commit -m "Initial TrainApp commit"
git remote add origin https://github.com/tu-usuario/trainapp-suite.git
git push -u origin main
```

**2. Despliega en tu VPS:**
```bash
# Conectar por SSH
ssh usuario@tu-vps-ip

# Clonar y desplegar
git clone https://github.com/tu-usuario/trainapp-suite.git
cd trainapp
chmod +x deploy.sh
sudo ./deploy.sh
```

### **Método 2: Script PowerShell (Automático)**

**1. Configura el script:**
```powershell
# Ejecutar en PowerShell como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Navegar al directorio
cd D:\trainapp

# Ejecutar script
.\windows-deploy.ps1 -VpsIP "192.168.1.100" -VpsUser "ubuntu"
```

**Opciones del script:**
```powershell
# Solo transferir archivos
.\windows-deploy.ps1 -VpsIP "192.168.1.100" -VpsUser "ubuntu" -TransferOnly

# Solo ejecutar deploy (archivos ya transferidos)
.\windows-deploy.ps1 -VpsIP "192.168.1.100" -VpsUser "ubuntu" -DeployOnly

# Ver ayuda
.\windows-deploy.ps1 -Help
```

### **Método 3: Script Batch (Simple)**

**1. Edita el archivo `windows-deploy.bat`:**
```batch
set VPS_IP=192.168.1.100
set VPS_USER=ubuntu
set VPS_PATH=/opt/trainapp
```

**2. Ejecuta el script:**
```cmd
# Doble click o desde cmd
windows-deploy.bat
```

### **Método 4: WinSCP (Interfaz Gráfica)**

**1. Descarga WinSCP:** https://winscp.net/

**2. Conecta a tu VPS:**
- Host: IP de tu VPS
- Username: tu usuario
- Password: tu contraseña (o key privada)

**3. Transfiere archivos:**
- Sube la carpeta `trainapp` a `/opt/trainapp`
- Conecta por SSH y ejecuta: `cd /opt/trainapp && sudo ./deploy.sh`

### **Método 5: Manual SCP**

**En PowerShell:**
```powershell
# Transferir archivos
scp -r D:\trainapp usuario@tu-vps-ip:/opt/trainapp

# Conectar y desplegar
ssh usuario@tu-vps-ip
cd /opt/trainapp
chmod +x deploy.sh
sudo ./deploy.sh
```

## 🔧 Configuración SSH

### **Generar claves SSH (opcional pero recomendado):**
```powershell
# Generar clave SSH
ssh-keygen -t rsa -b 4096 -C "tu-email@ejemplo.com"

# Copiar clave al VPS
scp ~/.ssh/id_rsa.pub usuario@tu-vps-ip:~/.ssh/authorized_keys
```

### **Configurar SSH config:**
```bash
# Crear archivo ~/.ssh/config
Host mi-vps
    HostName tu-vps-ip
    User tu-usuario
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

Después usar: `ssh mi-vps`

## 📊 Verificación del Despliegue

### **1. Verificar servicios:**
```bash
# En tu VPS
systemctl status trainapp
systemctl status nginx
pm2 status
```

### **2. Verificar aplicación:**
```bash
# Test de conectividad
curl http://localhost:3000/api/health

# Ver logs
pm2 logs
tail -f /var/log/trainapp/*.log
```

### **3. Acceder a la aplicación:**
- Navegador: `http://tu-vps-ip`
- API: `http://tu-vps-ip/api/health`

## 🛠️ Troubleshooting

### **Error: SSH no disponible**
```powershell
# Instalar OpenSSH en Windows
# Settings > Apps > Optional Features > Add Feature > OpenSSH Client
```

### **Error: Permission denied**
```bash
# En VPS, verificar permisos
sudo chown -R www-data:www-data /opt/trainapp
sudo chmod -R 755 /opt/trainapp
```

### **Error: Port already in use**
```bash
# Verificar qué usa el puerto
sudo netstat -tlnp | grep :3000
# Matar proceso si es necesario
sudo kill -9 <PID>
```

### **Error: Database locked**
```bash
# Verificar permisos de la base de datos
sudo chown www-data:www-data /opt/trainapp/server/database/
sudo chmod 755 /opt/trainapp/server/database/
```

## 🔄 Actualizaciones

### **Actualizar con GitHub:**
```bash
# En VPS
cd /opt/trainapp
git pull origin main
npm run build
pm2 restart trainapp
```

### **Actualizar con script:**
```powershell
# En Windows
.\windows-deploy.ps1 -VpsIP "192.168.1.100" -VpsUser "ubuntu"
```

## 📝 Comandos Útiles

### **En VPS:**
```bash
# Ver estado
pm2 status
systemctl status trainapp nginx

# Reiniciar servicios
pm2 restart trainapp
sudo systemctl restart nginx

# Ver logs
pm2 logs
journalctl -u trainapp -f

# Backup base de datos
cp /opt/trainapp/server/database/trainapp.db ~/backup-$(date +%Y%m%d).db
```

### **En Windows:**
```powershell
# Conectar por SSH
ssh usuario@tu-vps-ip

# Transferir archivo específico
scp archivo.txt usuario@tu-vps-ip:/opt/trainapp/

# Ejecutar comando remoto
ssh usuario@tu-vps-ip "pm2 status"
```

## 🔒 Seguridad

### **Configurar firewall:**
```bash
# En VPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### **SSL con Let's Encrypt:**
```bash
# Durante el deploy, cuando se pregunte por SSL
# Ingresa tu dominio: ejemplo.com
# El script configurará automáticamente SSL
```

## 📞 Soporte

Si tienes problemas:
1. Verifica la conectividad SSH
2. Revisa los logs de la aplicación
3. Consulta la documentación del VPS
4. Revisa el archivo `DEPLOY-WINDOWS.md`

¡Tu aplicación TrainApp estará lista en minutos! 🎉
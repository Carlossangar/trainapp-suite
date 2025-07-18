#!/bin/bash

# TrainApp Deployment Script
# Este script automatiza el despliegue de la aplicación en un VPS

set -e

echo "🚀 Iniciando despliegue de TrainApp..."

# Configuración
APP_NAME="trainapp"
GIT_REPO="https://github.com/tu-usuario/trainapp-suite.git"  # Cambiar por tu repo
DEPLOY_DIR="/opt/trainapp"
BACKUP_DIR="/opt/trainapp-backup"
SERVICE_NAME="trainapp"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    print_error "Este script debe ejecutarse como root (sudo)"
    exit 1
fi

# Instalar dependencias del sistema
print_message "Instalando dependencias del sistema..."
apt update
apt install -y curl git nginx certbot python3-certbot-nginx

# Instalar Node.js
print_message "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar PM2
print_message "Instalando PM2..."
npm install -g pm2

# Crear backup si existe instalación previa
if [ -d "$DEPLOY_DIR" ]; then
    print_warning "Creando backup de la instalación anterior..."
    rm -rf "$BACKUP_DIR"
    cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
fi

# Clonar o actualizar repositorio
print_message "Descargando código fuente..."
if [ -d "$DEPLOY_DIR" ]; then
    cd "$DEPLOY_DIR"
    git pull origin main
else
    git clone "$GIT_REPO" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# Instalar dependencias
print_message "Instalando dependencias..."
npm ci
cd server && npm ci && cd ..

# Construir aplicación
print_message "Construyendo aplicación..."
npm run build

# Configurar archivos de sistema
print_message "Configurando archivos de sistema..."

# Crear directorio de logs
mkdir -p /var/log/trainapp
mkdir -p "$DEPLOY_DIR/logs"

# Configurar permisos
chown -R www-data:www-data "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"

# Crear archivo de servicio systemd
cat > /etc/systemd/system/trainapp.service << EOF
[Unit]
Description=TrainApp Node.js Application
After=network.target

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=$DEPLOY_DIR
ExecStart=/usr/bin/pm2 start ecosystem.config.js --no-daemon
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Configurar Nginx
print_message "Configurando Nginx..."
cat > /etc/nginx/sites-available/trainapp << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Activar sitio de Nginx
ln -sf /etc/nginx/sites-available/trainapp /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Verificar configuración de Nginx
nginx -t

# Iniciar servicios
print_message "Iniciando servicios..."
systemctl daemon-reload
systemctl enable trainapp
systemctl start trainapp
systemctl restart nginx

# Verificar estado de servicios
print_message "Verificando estado de servicios..."
if systemctl is-active --quiet trainapp; then
    print_message "✅ TrainApp está ejecutándose correctamente"
else
    print_error "❌ Error al iniciar TrainApp"
    systemctl status trainapp
    exit 1
fi

if systemctl is-active --quiet nginx; then
    print_message "✅ Nginx está ejecutándose correctamente"
else
    print_error "❌ Error al iniciar Nginx"
    systemctl status nginx
    exit 1
fi

# Configurar SSL (opcional)
read -p "¿Deseas configurar SSL con Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Ingresa tu dominio: " domain
    if [ ! -z "$domain" ]; then
        print_message "Configurando SSL para $domain..."
        certbot --nginx -d "$domain" --non-interactive --agree-tos --email admin@"$domain"
    fi
fi

# Configurar logrotate
print_message "Configurando rotación de logs..."
cat > /etc/logrotate.d/trainapp << EOF
/var/log/trainapp/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Mostrar información final
print_message "🎉 Despliegue completado exitosamente!"
echo
echo "📋 Información del despliegue:"
echo "  • Aplicación: http://localhost:3000"
echo "  • Directorio: $DEPLOY_DIR"
echo "  • Logs: /var/log/trainapp/"
echo "  • Servicio: systemctl [start|stop|restart|status] trainapp"
echo
echo "🔧 Comandos útiles:"
echo "  • Ver logs: pm2 logs"
echo "  • Reiniciar app: pm2 restart trainapp"
echo "  • Monitorear: pm2 monit"
echo "  • Ver estado: pm2 status"
echo
print_message "¡TrainApp está listo para usar!"
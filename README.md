# TrainApp Suite - Aplicación de Seguimiento de Fitness

Una aplicación web completa para el seguimiento de peso, medidas corporales y ejercicios, desarrollada con React y Node.js.

## Características

- 📊 **Dashboard**: Resumen visual de tu progreso
- ⚖️ **Registro de Peso**: Seguimiento detallado de peso corporal
- 📏 **Medidas Corporales**: Registro de brazos, piernas, abdomen y torso
- 🏃 **Registro de Ejercicios**: Sistema completo para entrenamientos
- 💾 **Persistencia**: Base de datos SQLite para almacenamiento confiable
- 🔒 **Seguridad**: Configuración segura para producción
- 📱 **Responsive**: Diseño adaptable a dispositivos móviles

## Arquitectura

### Frontend
- React 19 con TypeScript
- Webpack para bundling
- CSS puro con diseño responsive
- Hooks personalizados para API

### Backend
- Node.js con Express
- Base de datos SQLite
- API RESTful
- Middleware de seguridad

## Desarrollo Local

### Prerrequisitos
- Node.js 18 o superior
- npm

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/trainapp-suite.git
cd trainapp-suite

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server
npm install
cd ..

# Ejecutar en desarrollo (frontend + backend)
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API: http://localhost:3001/api

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Ejecuta frontend y backend
npm run start           # Solo frontend
npm run server:dev      # Solo backend en desarrollo

# Producción
npm run build           # Construye el frontend
npm run server:start    # Inicia backend en producción
```

## Despliegue en VPS

### Opción 1: Script Automático

```bash
# En tu VPS (Ubuntu/Debian)
curl -fsSL https://raw.githubusercontent.com/tu-usuario/trainapp-suite/main/deploy.sh | sudo bash
```

### Opción 2: Docker

```bash
# Construir y ejecutar con Docker
docker-compose up -d

# Con Nginx (opcional)
docker-compose --profile with-nginx up -d
```

### Opción 3: Manual

1. **Preparar el servidor**:
```bash
# Instalar dependencias
sudo apt update
sudo apt install -y nodejs npm nginx git

# Instalar PM2
sudo npm install -g pm2
```

2. **Clonar y configurar**:
```bash
git clone https://github.com/tu-usuario/trainapp-suite.git /opt/trainapp
cd /opt/trainapp

# Instalar dependencias
npm ci
cd server && npm ci && cd ..

# Construir aplicación
npm run build
```

3. **Configurar servicios**:
```bash
# Iniciar con PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/trainapp
sudo ln -s /etc/nginx/sites-available/trainapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Estructura del Proyecto

```
trainapp/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── hooks/             # Hooks personalizados
│   ├── services/          # Servicios API
│   ├── types/             # Tipos TypeScript
│   └── App.tsx            # Componente principal
├── server/                 # Backend Node.js
│   ├── database/          # Base de datos y esquemas
│   ├── routes/            # Rutas de API
│   └── server.js          # Servidor Express
├── public/                 # Archivos estáticos
├── dist/                   # Frontend compilado
├── ecosystem.config.js     # Configuración PM2
├── docker-compose.yml      # Configuración Docker
├── nginx.conf             # Configuración Nginx
└── deploy.sh              # Script de despliegue
```

## API Endpoints

### Peso
- `GET /api/weight` - Obtener registros de peso
- `POST /api/weight` - Crear registro de peso
- `PUT /api/weight/:id` - Actualizar registro
- `DELETE /api/weight/:id` - Eliminar registro

### Medidas Corporales
- `GET /api/measurements` - Obtener medidas
- `POST /api/measurements` - Crear medida
- `PUT /api/measurements/:id` - Actualizar medida
- `DELETE /api/measurements/:id` - Eliminar medida

### Entrenamientos
- `GET /api/workouts` - Obtener entrenamientos
- `POST /api/workouts` - Crear entrenamiento
- `PUT /api/workouts/:id` - Actualizar entrenamiento
- `DELETE /api/workouts/:id` - Eliminar entrenamiento

### Utilidades
- `GET /api/health` - Health check

## Configuración

### Variables de Entorno

```bash
# server/.env
NODE_ENV=production
PORT=3001
DATABASE_URL=./database/trainapp.db
```

### Configuración de Producción

- **PM2**: Gestión de procesos y reinicio automático
- **Nginx**: Reverse proxy y SSL
- **SQLite**: Base de datos ligera y confiable
- **Let's Encrypt**: SSL gratuito
- **Logrotate**: Rotación automática de logs

## Monitoreo

```bash
# Ver estado de la aplicación
pm2 status
pm2 monit

# Ver logs
pm2 logs
tail -f /var/log/trainapp/combined.log

# Reiniciar aplicación
pm2 restart trainapp
```

## Backup

```bash
# Backup de la base de datos
cp server/database/trainapp.db backup/trainapp-$(date +%Y%m%d).db

# Backup completo
tar -czf trainapp-backup-$(date +%Y%m%d).tar.gz /opt/trainapp
```

## Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## Soporte

Para soporte y preguntas:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

¡Disfruta usando TrainApp para alcanzar tus metas de fitness! 🏋️‍♂️💪
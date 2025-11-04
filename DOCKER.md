# 🐳 Docker Setup para Files App

## 📋 Resumen de la Configuración

El docker-compose.yml está **correctamente configurado** con las siguientes mejoras implementadas:

### ✅ **Correcciones Realizadas**
- **Health Check arreglado**: Cambiado de puerto 80 a 3000 dentro del contenedor
- **Comando de salud optimizado**: Usando `wget` en lugar de `curl` (más liviano)
- **Límites de recursos**: Configurados para evitar consumo excesivo
- **Perfiles de servicios**: Separación clara entre desarrollo y producción

### 🏗️ **Estructura de Archivos Docker**
```
files_app/
├── 📄 Dockerfile                 # Imagen optimizada para producción
├── 📄 Dockerfile.dev             # Imagen para desarrollo con hot reload
├── 📄 docker-compose.yml         # Configuración principal
├── 📄 docker-compose.override.yml # Configuraciones de desarrollo local
├── 📄 docker-compose.prod.yml    # Configuraciones de producción
├── 📄 .dockerignore              # Exclusiones para optimizar build
├── 📄 docker-build.sh            # Script automatizado (Linux/macOS)
├── 📄 docker-build.ps1           # Script automatizado (Windows)
└── 📄 .env.example               # Variables de entorno template
```

## 🚀 **Comandos de Uso**

### **Producción (Recomendado)**
```bash
# Levantar solo el servicio de producción
docker-compose up -d files-app

# Con configuración de producción específica
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Desarrollo**
```bash
# Levantar servicio de desarrollo con hot reload
docker-compose --profile dev up files-app-dev

# O usando override automático
docker-compose up files-app-dev
```

### **Todos los servicios**
```bash
# Levantar todos los servicios disponibles
docker-compose --profile dev up -d
```

## 📊 **Verificación de Servicios**

### **Comprobar Estado**
```bash
# Ver contenedores ejecutándose
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f files-app

# Health check manual
curl -s http://localhost:80/api/health
# O para desarrollo: curl -s http://localhost:3000/api/health
```

### **Acceso a la Aplicación**
- **Producción**: http://localhost:80
- **Desarrollo**: http://localhost:3000

## 🔧 **Configuraciones Específicas**

### **Servicio de Producción (`files-app`)**
- **Puerto**: 80 → 3000
- **Health Check**: Cada 30s
- **Límites**: 512MB RAM, 0.5 CPU
- **Restart**: unless-stopped

### **Servicio de Desarrollo (`files-app-dev`)**  
- **Puerto**: 3000 → 3000
- **Hot Reload**: Habilitado con volumes
- **Profile**: dev (no se inicia por defecto)
- **Variables**: NODE_ENV=development

## ⚙️ **Variables de Entorno**

El archivo `.env.example` incluye todas las variables configurables:
```bash
# Copiar y configurar
cp .env.example .env
```

Variables importantes:
- `NODE_ENV`: production/development
- `PORT`: 3000
- `HOSTNAME`: 0.0.0.0
- `NEXT_TELEMETRY_DISABLED`: 1

## 🛠️ **Comandos de Administración**

### **Rebuild**
```bash
# Reconstruir sin cache
docker-compose build --no-cache files-app

# Reconstruir y levantar
docker-compose up --build -d files-app
```

### **Limpieza**
```bash
# Parar y remover contenedores
docker-compose down

# Remover volúmenes también
docker-compose down -v

# Limpiar imágenes no usadas
docker image prune -f
```

### **Debugging**
```bash
# Acceder al contenedor
docker-compose exec files-app sh

# Ver logs específicos
docker-compose logs --tail 50 files-app

# Ver estadísticas de recursos
docker stats files-app-container
```

## 📈 **Optimizaciones Implementadas**

### **Imagen Docker**
- ✅ Multi-stage build para tamaño optimizado
- ✅ Alpine Linux como base (imagen liviana)
- ✅ Usuario no-root para seguridad
- ✅ Output standalone de Next.js

### **Docker Compose**
- ✅ Perfiles para separar desarrollo/producción
- ✅ Health checks configurados
- ✅ Límites de recursos establecidos
- ✅ Logging configurado
- ✅ Networks personalizadas

### **Desarrollo**
- ✅ Hot reload habilitado
- ✅ Volumes para código fuente
- ✅ Variables de entorno específicas
- ✅ Polling para file watchers

## 🚨 **Troubleshooting**

### **Problemas Comunes**

**1. Puerto ocupado**
```bash
# Error: Port 80 is already in use
docker-compose down
# O cambiar puerto en docker-compose.yml
```

**2. Health check fallando**
```bash
# Verificar que la aplicación responde
docker-compose exec files-app wget -q --spider http://localhost:3000/api/health
echo $? # Debería retornar 0
```

**3. Volúmenes no sincronizando (Desarrollo)**
```bash
# Reconstruir con volúmenes limpios
docker-compose down -v
docker-compose up --build files-app-dev
```

**4. Imagen muy grande**
```bash
# Ver tamaño de imágenes
docker images files-app
# Limpiar build cache
docker builder prune -f
```

### **Logs Útiles**
```bash
# Ver todos los logs
docker-compose logs

# Solo errores
docker-compose logs | grep -i error

# Con timestamps
docker-compose logs -t files-app
```

## 🔒 **Consideraciones de Seguridad**

- ✅ Usuario no-root en contenedor
- ✅ Networks aisladas
- ✅ Variables de entorno configurables
- ✅ Health checks para monitoring
- ✅ Límites de recursos establecidos

---

## 📞 **Soporte**

Si encuentras algún problema:
1. Revisa los logs: `docker-compose logs files-app`
2. Verifica el health check: `curl http://localhost:80/api/health`
3. Comprueba recursos: `docker stats files-app-container`

**¡Tu configuración de Docker está lista y optimizada! 🎉**
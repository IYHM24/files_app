# Guía de Uso de Docker para Files App

## 🐳 Prerequisitos
Asegúrate de tener Docker Desktop instalado y ejecutándose:
- Windows: Docker Desktop for Windows
- macOS: Docker Desktop for Mac
- Linux: Docker Engine

## 📋 Verificación de Docker
```bash
# Verificar instalación
docker --version
docker-compose --version

# Verificar que Docker está ejecutándose
docker info
```

## 🚀 Comandos de Construcción y Ejecución

### **1. Construcción Rápida**
```bash
# Imagen de producción optimizada
docker build -f Dockerfile -t files-app:latest .

# Imagen de desarrollo con hot reload
docker build -f Dockerfile.dev -t files-app:dev .
```

### **2. Ejecución de Contenedores**
```bash
# Producción
docker run -d --name files-app -p 3000:3000 files-app:latest

# Desarrollo con volumes para hot reload
docker run -d --name files-app-dev -p 3000:3000 -v "$(pwd):/app" -v /app/node_modules files-app:dev
```

### **3. Uso con Docker Compose**
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🛠️ Scripts Automatizados

### **Linux/macOS**
```bash
# Dar permisos
chmod +x docker-build.sh

# Desarrollo
./docker-build.sh dev

# Producción
./docker-build.sh prod

# Ver logs
./docker-build.sh logs

# Limpiar todo
./docker-build.sh clean
```

### **Windows PowerShell**
```powershell
# Desarrollo
.\docker-build.ps1 dev

# Producción
.\docker-build.ps1 prod

# Ver logs
.\docker-build.ps1 logs

# Limpiar todo
.\docker-build.ps1 clean
```

## 📊 Verificación y Monitoreo

### **Health Checks**
```bash
# Verificar salud del contenedor
curl http://localhost:3000/api/health

# Ver estado de contenedores
docker ps

# Estadísticas de uso
docker stats files-app
```

### **Logs y Debugging**
```bash
# Ver logs en tiempo real
docker logs -f files-app

# Acceder al contenedor
docker exec -it files-app sh

# Verificar archivos en el contenedor
docker exec files-app ls -la /app
```

## 🔧 Configuración de Producción

### **Variables de Entorno**
```bash
# Ejecutar con variables personalizadas
docker run -d \
  --name files-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  files-app:latest
```

### **Con Docker Compose**
```yaml
# En docker-compose.yml
environment:
  - NODE_ENV=production
  - DATABASE_URL=postgresql://...
  - NEXTAUTH_SECRET=your-secret
```

## 🚨 Solución de Problemas

### **Docker no está ejecutándose**
```bash
# Error: Cannot connect to Docker daemon
# Solución: Iniciar Docker Desktop o Docker service
```

### **Puerto ocupado**
```bash
# Error: Port 3000 is already in use
# Solución: Cambiar puerto o detener proceso
docker run -p 3001:3000 files-app:latest
```

### **Problemas de permisos**
```bash
# En Linux/macOS, dar permisos al script
chmod +x docker-build.sh

# En Windows, ejecutar PowerShell como administrador
Set-ExecutionPolicy RemoteSigned
```

### **Imagen muy grande**
```bash
# Ver tamaño de imágenes
docker images files-app

# Limpiar imágenes no utilizadas
docker image prune -f
```

## 📈 Optimizaciones

### **Reducir Tamaño de Imagen**
- ✅ Multi-stage build implementado
- ✅ Alpine Linux como base
- ✅ .dockerignore configurado
- ✅ Solo dependencias de producción

### **Mejorar Performance**
- ✅ Standalone output de Next.js
- ✅ Compilación optimizada
- ✅ Health checks configurados
- ✅ User no-root para seguridad

## 🔄 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Build and Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker Image
        run: docker build -f Dockerfile -t files-app:${{ github.sha }} .
```

### **Docker Registry**
```bash
# Tag para registry
docker tag files-app:latest your-registry.com/files-app:latest

# Push a registry
docker push your-registry.com/files-app:latest
```

---

**¡Tu aplicación Files App está lista para Docker! 🐳**
# Script de PowerShell para construcción y despliegue de Docker para Files App
# Uso: .\docker-build.ps1 [desarrollo|produccion]

param(
    [Parameter(Position=0)]
    [ValidateSet("dev", "prod", "build", "stop", "clean", "logs", "help")]
    [string]$Command = "help"
)

# Configuración
$AppName = "files-app"
$ImageName = "files-app"
$ContainerName = "files-app-container"

# Función para mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\docker-build.ps1 [COMANDO]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor White
    Write-Host "  dev         Construir y ejecutar en modo desarrollo" -ForegroundColor Green
    Write-Host "  prod        Construir y ejecutar en modo producción" -ForegroundColor Green
    Write-Host "  build       Solo construir la imagen" -ForegroundColor Green
    Write-Host "  stop        Detener y remover contenedores" -ForegroundColor Green
    Write-Host "  clean       Limpiar imágenes y contenedores" -ForegroundColor Green
    Write-Host "  logs        Mostrar logs del contenedor" -ForegroundColor Green
    Write-Host "  help        Mostrar esta ayuda" -ForegroundColor Green
    Write-Host ""
}

# Función para construcción en desarrollo
function Build-Dev {
    Write-Host "🔨 Construyendo imagen de desarrollo..." -ForegroundColor Yellow
    docker build -f Dockerfile.dev -t "${ImageName}:dev" .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Imagen de desarrollo construida exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error construyendo imagen de desarrollo" -ForegroundColor Red
        exit 1
    }
}

# Función para construcción en producción
function Build-Prod {
    Write-Host "🔨 Construyendo imagen de producción..." -ForegroundColor Yellow
    docker build -f Dockerfile -t "${ImageName}:latest" .
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Imagen de producción construida exitosamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error construyendo imagen de producción" -ForegroundColor Red
        exit 1
    }
}

# Función para ejecutar en desarrollo
function Run-Dev {
    Write-Host "🚀 Ejecutando en modo desarrollo..." -ForegroundColor Yellow
    
    # Detener y remover contenedor existente
    docker stop "$ContainerName-dev" 2>$null | Out-Null
    docker rm "$ContainerName-dev" 2>$null | Out-Null
    
    # Ejecutar nuevo contenedor
    $CurrentPath = (Get-Location).Path.Replace('\', '/')
    docker run -d `
        --name "$ContainerName-dev" `
        -p 3000:3000 `
        -v "${CurrentPath}:/app" `
        -v /app/node_modules `
        "${ImageName}:dev"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Aplicación ejecutándose en http://localhost:3000" -ForegroundColor Green
        Write-Host "📋 Para ver logs: docker logs -f $ContainerName-dev" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error ejecutando contenedor de desarrollo" -ForegroundColor Red
    }
}

# Función para ejecutar en producción
function Run-Prod {
    Write-Host "🚀 Ejecutando en modo producción..." -ForegroundColor Yellow
    
    # Detener y remover contenedor existente
    docker stop $ContainerName 2>$null | Out-Null
    docker rm $ContainerName 2>$null | Out-Null
    
    # Ejecutar nuevo contenedor
    docker run -d `
        --name $ContainerName `
        -p 3000:3000 `
        --restart unless-stopped `
        "${ImageName}:latest"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Aplicación ejecutándose en http://localhost:3000" -ForegroundColor Green
        Write-Host "📋 Para ver logs: docker logs -f $ContainerName" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error ejecutando contenedor de producción" -ForegroundColor Red
    }
}

# Función para detener contenedores
function Stop-Containers {
    Write-Host "🛑 Deteniendo contenedores..." -ForegroundColor Yellow
    docker stop $ContainerName 2>$null | Out-Null
    docker stop "$ContainerName-dev" 2>$null | Out-Null
    docker rm $ContainerName 2>$null | Out-Null
    docker rm "$ContainerName-dev" 2>$null | Out-Null
    Write-Host "✅ Contenedores detenidos" -ForegroundColor Green
}

# Función para limpiar imágenes y contenedores
function Clean-All {
    Write-Host "🧹 Limpiando imágenes y contenedores..." -ForegroundColor Yellow
    Stop-Containers
    docker rmi "${ImageName}:latest" 2>$null | Out-Null
    docker rmi "${ImageName}:dev" 2>$null | Out-Null
    docker system prune -f
    Write-Host "✅ Limpieza completada" -ForegroundColor Green
}

# Función para mostrar logs
function Show-Logs {
    $containers = docker ps --format "table {{.Names}}"
    if ($containers -like "*$ContainerName*" -and $containers -notlike "*$ContainerName-dev*") {
        Write-Host "📋 Mostrando logs de producción..." -ForegroundColor Yellow
        docker logs -f $ContainerName
    } elseif ($containers -like "*$ContainerName-dev*") {
        Write-Host "📋 Mostrando logs de desarrollo..." -ForegroundColor Yellow
        docker logs -f "$ContainerName-dev"
    } else {
        Write-Host "❌ No hay contenedores ejecutándose" -ForegroundColor Red
    }
}

# Verificar que Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Procesar comandos
switch ($Command) {
    "dev" {
        Build-Dev
        Run-Dev
    }
    "prod" {
        Build-Prod
        Run-Prod
    }
    "build" {
        Build-Prod
    }
    "stop" {
        Stop-Containers
    }
    "clean" {
        Clean-All
    }
    "logs" {
        Show-Logs
    }
    default {
        Show-Help
    }
}
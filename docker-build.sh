#!/bin/bash

# Script de construcción y despliegue de Docker para Files App
# Uso: ./docker-build.sh [desarrollo|produccion]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
APP_NAME="files-app"
IMAGE_NAME="files-app"
CONTAINER_NAME="files-app-container"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  dev         Construir y ejecutar en modo desarrollo"
    echo "  prod        Construir y ejecutar en modo producción"
    echo "  build       Solo construir la imagen"
    echo "  stop        Detener y remover contenedores"
    echo "  clean       Limpiar imágenes y contenedores"
    echo "  logs        Mostrar logs del contenedor"
    echo "  help        Mostrar esta ayuda"
    echo ""
}

# Función para construcción en desarrollo
build_dev() {
    echo -e "${YELLOW}🔨 Construyendo imagen de desarrollo...${NC}"
    docker build -f Dockerfile.dev -t ${IMAGE_NAME}:dev .
    echo -e "${GREEN}✅ Imagen de desarrollo construida exitosamente${NC}"
}

# Función para construcción en producción
build_prod() {
    echo -e "${YELLOW}🔨 Construyendo imagen de producción...${NC}"
    docker build -f Dockerfile -t ${IMAGE_NAME}:latest .
    echo -e "${GREEN}✅ Imagen de producción construida exitosamente${NC}"
}

# Función para ejecutar en desarrollo
run_dev() {
    echo -e "${YELLOW}🚀 Ejecutando en modo desarrollo...${NC}"
    docker stop ${CONTAINER_NAME}-dev 2>/dev/null || true
    docker rm ${CONTAINER_NAME}-dev 2>/dev/null || true
    
    docker run -d \
        --name ${CONTAINER_NAME}-dev \
        -p 3000:3000 \
        -v "$(pwd):/app" \
        -v /app/node_modules \
        ${IMAGE_NAME}:dev
    
    echo -e "${GREEN}✅ Aplicación ejecutándose en http://localhost:3000${NC}"
    echo -e "${YELLOW}📋 Para ver logs: docker logs -f ${CONTAINER_NAME}-dev${NC}"
}

# Función para ejecutar en producción
run_prod() {
    echo -e "${YELLOW}🚀 Ejecutando en modo producción...${NC}"
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    
    docker run -d \
        --name ${CONTAINER_NAME} \
        -p 3000:3000 \
        --restart unless-stopped \
        ${IMAGE_NAME}:latest
    
    echo -e "${GREEN}✅ Aplicación ejecutándose en http://localhost:3000${NC}"
    echo -e "${YELLOW}📋 Para ver logs: docker logs -f ${CONTAINER_NAME}${NC}"
}

# Función para detener contenedores
stop_containers() {
    echo -e "${YELLOW}🛑 Deteniendo contenedores...${NC}"
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker stop ${CONTAINER_NAME}-dev 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME}-dev 2>/dev/null || true
    echo -e "${GREEN}✅ Contenedores detenidos${NC}"
}

# Función para limpiar imágenes y contenedores
clean_all() {
    echo -e "${YELLOW}🧹 Limpiando imágenes y contenedores...${NC}"
    stop_containers
    docker rmi ${IMAGE_NAME}:latest 2>/dev/null || true
    docker rmi ${IMAGE_NAME}:dev 2>/dev/null || true
    docker system prune -f
    echo -e "${GREEN}✅ Limpieza completada${NC}"
}

# Función para mostrar logs
show_logs() {
    if docker ps | grep -q ${CONTAINER_NAME}; then
        echo -e "${YELLOW}📋 Mostrando logs de producción...${NC}"
        docker logs -f ${CONTAINER_NAME}
    elif docker ps | grep -q ${CONTAINER_NAME}-dev; then
        echo -e "${YELLOW}📋 Mostrando logs de desarrollo...${NC}"
        docker logs -f ${CONTAINER_NAME}-dev
    else
        echo -e "${RED}❌ No hay contenedores ejecutándose${NC}"
    fi
}

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado o no está en el PATH${NC}"
    exit 1
fi

# Procesar argumentos
case "${1:-help}" in
    "dev")
        build_dev
        run_dev
        ;;
    "prod")
        build_prod
        run_prod
        ;;
    "build")
        build_prod
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_help
        ;;
esac
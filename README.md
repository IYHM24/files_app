# Files App - Next.js MVC Architecture

Una aplicación profesional de gestión de archivos construida con Next.js siguiendo el patrón arquitectónico MVC (Model-View-Controller).

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Arquitectura MVC](#arquitectura-mvc)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Descripción Detallada](#descripción-detallada)
- [Instalación y Configuración](#instalación-y-configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
- [Contribuir](#contribuir)

## 📄 Descripción del Proyecto

Esta aplicación implementa una arquitectura MVC profesional para Next.js, proporcionando una base sólida y escalable para proyectos empresariales. Incluye gestión de usuarios, subida de archivos, componentes reutilizables y una estructura organizacional que facilita el mantenimiento y la colaboración en equipo.

## 🏗️ Arquitectura MVC

### **Model (Modelo)**
- **Ubicación**: `src/models/`, `src/types/`
- **Responsabilidad**: Definir estructuras de datos, entidades y lógica de negocio
- **Archivos**: Clases de modelos, interfaces TypeScript, validaciones

### **View (Vista)**
- **Ubicación**: `src/components/`, `app/`
- **Responsabilidad**: Componentes React, páginas y elementos de UI
- **Archivos**: Componentes reutilizables, layouts, páginas

### **Controller (Controlador)**
- **Ubicación**: `src/controllers/`, `app/api/`
- **Responsabilidad**: Manejar solicitudes HTTP, lógica de endpoints API
- **Archivos**: Controladores API, rutas de Next.js

## 📁 Estructura de Carpetas

```
files_app/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API Routes (Controladores)
│   │   └── 📁 users/                # Endpoints de usuarios
│   │       ├── 📄 route.ts          # GET /api/users, POST /api/users
│   │       └── 📁 [id]/             # Rutas dinámicas
│   │           └── 📄 route.ts      # GET, PUT, DELETE /api/users/:id
│   ├── 📄 globals.css               # Estilos globales Tailwind CSS
│   ├── 📄 layout.tsx                # Layout raíz de la aplicación
│   └── 📄 page.tsx                  # Página principal (Dashboard)
├── 📁 src/                          # Código fuente principal
│   ├── 📁 components/               # Componentes React reutilizables
│   │   ├── 📁 ui/                   # Componentes base de interfaz
│   │   │   ├── 📄 Button.tsx        # Componente botón reutilizable
│   │   │   ├── 📄 Input.tsx         # Componente input con validación
│   │   │   ├── 📄 LoadingSpinner.tsx# Indicador de carga
│   │   │   └── 📄 index.ts          # Exportaciones de componentes UI
│   │   ├── 📁 layout/               # Componentes de layout
│   │   │   ├── 📄 Header.tsx        # Encabezado de la aplicación
│   │   │   ├── 📄 Sidebar.tsx       # Navegación lateral
│   │   │   ├── 📄 MainLayout.tsx    # Layout principal contenedor
│   │   │   └── 📄 index.ts          # Exportaciones de layout
│   │   ├── 📁 forms/                # Componentes de formularios
│   │   └── 📄 index.ts              # Exportaciones generales
│   ├── 📁 models/                   # Modelos de datos (MVC - Model)
│   │   ├── 📄 User.ts               # Modelo de usuario con métodos
│   │   ├── 📄 File.ts               # Modelo de archivo con utilidades
│   │   └── 📄 index.ts              # Exportaciones de modelos
│   ├── 📁 controllers/              # Controladores API (MVC - Controller)
│   │   ├── 📄 BaseController.ts     # Controlador base con utilities
│   │   ├── 📄 UserController.ts     # Controlador CRUD de usuarios
│   │   └── 📄 index.ts              # Exportaciones de controladores
│   ├── 📁 services/                 # Servicios de negocio y API
│   │   ├── 📄 BaseService.ts        # Servicio base para HTTP requests
│   │   ├── 📄 UserService.ts        # Servicio de operaciones de usuario
│   │   ├── 📄 FileService.ts        # Servicio de gestión de archivos
│   │   └── 📄 index.ts              # Exportaciones de servicios
│   ├── 📁 hooks/                    # React Hooks personalizados
│   │   ├── 📄 useUsers.ts           # Hook para manejo de usuarios
│   │   ├── 📄 useApi.ts             # Hook genérico para llamadas API
│   │   └── 📄 index.ts              # Exportaciones de hooks
│   ├── 📁 utils/                    # Funciones utilitarias
│   │   └── 📄 index.ts              # Utilidades (formateo, validación, etc.)
│   ├── 📁 types/                    # Definiciones de tipos TypeScript
│   │   └── 📄 index.ts              # Interfaces y tipos globales
│   ├── 📁 config/                   # Configuraciones de la aplicación
│   │   └── 📄 index.ts              # Configuración centralizada
│   ├── 📁 lib/                      # Librerías y utilidades externas
│   ├── 📁 store/                    # Estado global (Redux/Zustand)
│   └── 📁 middleware/               # Middleware personalizado
│       └── 📄 index.ts              # CORS, logging, rate limiting
├── 📁 public/                       # Archivos estáticos
├── 📁 docs/                         # Documentación del proyecto
│   └── 📄 README.md                 # Documentación técnica detallada
├── 📁 tests/                        # Pruebas automatizadas
│   ├── 📁 unit/                     # Pruebas unitarias
│   └── 📁 integration/              # Pruebas de integración
├── 📄 .env.example                  # Template de variables de entorno
├── 📄 eslint.config.mjs             # Configuración ESLint
├── 📄 next.config.ts                # Configuración Next.js
├── 📄 next-env.d.ts                 # Tipos Next.js
├── 📄 package.json                  # Dependencias y scripts
├── 📄 postcss.config.mjs            # Configuración PostCSS
├── 📄 tsconfig.json                 # Configuración TypeScript
└── 📄 README.md                     # Este archivo
```

## 📖 Descripción Detallada

### 🎯 **Directorio `app/` (Next.js App Router)**

#### `app/api/` - **API Routes (Controladores)**
- **Propósito**: Endpoints de la API REST siguiendo el patrón de controladores
- **`users/route.ts`**: Maneja GET (listar usuarios) y POST (crear usuario)
- **`users/[id]/route.ts`**: Maneja GET, PUT, DELETE para usuarios específicos
- **Patrón**: Cada archivo `route.ts` exporta funciones HTTP (GET, POST, PUT, DELETE)

#### Archivos de App
- **`layout.tsx`**: Layout raíz que envuelve toda la aplicación
- **`page.tsx`**: Página principal con dashboard y navegación
- **`globals.css`**: Estilos Tailwind CSS y personalización global

### 🧱 **Directorio `src/components/` (Vistas)**

#### `components/ui/` - **Componentes Base**
- **`Button.tsx`**: Botón reutilizable con variantes (primary, secondary, outline, ghost, danger)
- **`Input.tsx`**: Campo de entrada con validación, etiquetas y mensajes de error
- **`LoadingSpinner.tsx`**: Indicador de carga animado con diferentes tamaños

#### `components/layout/` - **Componentes de Layout**
- **`Header.tsx`**: Encabezado con título y acciones personalizables
- **`Sidebar.tsx`**: Navegación lateral con elementos activos
- **`MainLayout.tsx`**: Layout principal que combina header, sidebar y contenido

### 📊 **Directorio `src/models/` (Modelos)**

#### Clases de Modelos
- **`User.ts`**: Modelo de usuario con propiedades, validaciones y métodos utilitarios
  - Métodos: `toJSON()`, `fromJSON()`, validaciones
- **`File.ts`**: Modelo de archivo con metadatos y utilidades
  - Métodos: `getFileExtension()`, `getFormattedSize()`, serialización

### 🎮 **Directorio `src/controllers/` (Controladores)**

#### Controladores API
- **`BaseController.ts`**: Clase base con utilidades comunes
  - Manejo de errores, parsing de body, respuestas estandarizadas
- **`UserController.ts`**: Controlador CRUD para usuarios
  - Métodos: `getUsers()`, `getUserById()`, `createUser()`, `updateUser()`, `deleteUser()`

### 🔧 **Directorio `src/services/` (Servicios)**

#### Servicios de Negocio
- **`BaseService.ts`**: Servicio base para peticiones HTTP
  - Manejo de fetch, construcción de URLs, manejo de errores
- **`UserService.ts`**: Operaciones de usuario del lado cliente
- **`FileService.ts`**: Servicios de subida y gestión de archivos

### 🪝 **Directorio `src/hooks/` (Hooks Personalizados)**

#### React Hooks
- **`useUsers.ts`**: Hook para manejo completo de usuarios
  - Estado: `users`, `loading`, `error`
  - Operaciones: `fetchUsers()`, `createUser()`, `updateUser()`, `deleteUser()`
- **`useApi.ts`**: Hook genérico para llamadas API con estado

### 🛠️ **Directorio `src/utils/` (Utilidades)**

#### Funciones Utilitarias
- **Formateo**: `formatDate()`, `formatDateTime()`, `formatFileSize()`
- **Validación**: `isValidEmail()`, `generateId()`
- **UI**: `cn()` (className utility), `capitalize()`, `truncateText()`
- **Performance**: `debounce()`, `throttle()`, `sleep()`

### 📝 **Directorio `src/types/` (Tipos TypeScript)**

#### Definiciones de Tipos
- **`BaseEntity`**: Interface base para entidades
- **`ApiResponse<T>`**: Tipo genérico para respuestas API
- **`PaginatedResponse<T>`**: Respuestas paginadas
- **`User`, `File`**: Interfaces de entidades principales

### ⚙️ **Directorio `src/config/` (Configuración)**

#### Configuración Centralizada
- **App config**: Nombre, versión, descripción
- **API config**: URLs base, timeouts
- **Upload config**: Tamaño máximo, tipos permitidos
- **Database config**: URLs de conexión
- **Auth config**: Secretos, configuración de tokens

### 🛡️ **Directorio `src/middleware/`**

#### Middleware Personalizado
- **`corsMiddleware()`**: Manejo de CORS para API
- **`rateLimitMiddleware()`**: Limitación de velocidad básica
- **`loggingMiddleware()`**: Logging de peticiones y respuestas

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- npm o yarn
- Git
- Docker y Docker Compose (para contenedores)

### Pasos de Instalación

#### **Método 1: Desarrollo Local**

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd files_app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

#### **Método 2: Docker (Recomendado para Producción)**

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd files_app
```

2. **Usando Scripts Automatizados (Recomendado)**

**En Linux/macOS:**
```bash
# Dar permisos de ejecución
chmod +x docker-build.sh

# Desarrollo con hot reload
./docker-build.sh dev

# Producción optimizada
./docker-build.sh prod

# Ver logs en tiempo real
./docker-build.sh logs

# Limpiar contenedores e imágenes
./docker-build.sh clean
```

**En Windows (PowerShell):**
```powershell
# Desarrollo con hot reload
.\docker-build.ps1 dev

# Producción optimizada
.\docker-build.ps1 prod

# Ver logs en tiempo real
.\docker-build.ps1 logs

# Limpiar contenedores e imágenes
.\docker-build.ps1 clean
```

3. **Usando Docker Compose (Alternativo)**
```bash
# Producción
docker-compose up --build

# Desarrollo (descomentar servicio en docker-compose.yml)
docker-compose -f docker-compose.yml up files-app-dev
```

4. **Comandos Docker Manuales**
```bash
# Construir imagen de producción
docker build -f Dockerfile -t files-app:latest .

# Ejecutar contenedor
docker run -d --name files-app-container -p 3000:3000 files-app:latest

# Ver logs
docker logs -f files-app-container
```

### 🐳 **Configuración de Docker**

#### **Archivos de Docker Incluidos**
- `Dockerfile` - Imagen optimizada para producción con multi-stage build
- `Dockerfile.dev` - Imagen para desarrollo con hot reload
- `docker-compose.yml` - Orquestación de servicios
- `.dockerignore` - Exclusiones para optimizar el build
- `docker-build.sh` - Script automatizado para Linux/macOS
- `docker-build.ps1` - Script automatizado para Windows

#### **Características de la Imagen Docker**
- ✅ **Multi-stage build** para tamaño optimizado
- ✅ **Node.js 20 Alpine** como base (imagen liviana)
- ✅ **Usuario no-root** para seguridad
- ✅ **Health checks** incorporados
- ✅ **Output standalone** de Next.js
- ✅ **Variables de entorno** configurables

#### **Comandos Útiles de Docker**
```bash
# Ver contenedores ejecutándose
docker ps

# Acceder al contenedor
docker exec -it files-app-container sh

# Ver uso de recursos
docker stats files-app-container

# Ver logs con timestamps
docker logs -f --timestamps files-app-container

# Reiniciar contenedor
docker restart files-app-container
```

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting automáticamente

# Futuros scripts (cuando se configuren)
npm run test         # Ejecutar pruebas
npm run test:watch   # Ejecutar pruebas en modo watch
npm run type-check   # Verificación de tipos TypeScript
```

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca de componentes
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework CSS utilitario

### **Desarrollo**
- **ESLint 9** - Linting de código
- **PostCSS** - Procesamiento CSS
- **Path Mapping** - Imports absolutos con `@/`

### **Arquitectura**
- **MVC Pattern** - Separación de responsabilidades
- **Custom Hooks** - Lógica reutilizable
- **Service Layer** - Abstracción de API
- **Component Library** - Componentes reutilizables

## 📚 Patrones y Mejores Prácticas

### **Arquitectura**
- ✅ **Separación de responsabilidades** (MVC)
- ✅ **Single Responsibility Principle**
- ✅ **DRY (Don't Repeat Yourself)**
- ✅ **Composición sobre herencia**

### **TypeScript**
- ✅ **Tipado fuerte** en toda la aplicación
- ✅ **Interfaces bien definidas**
- ✅ **Tipos genéricos** para reutilización
- ✅ **Path mapping** para imports limpios

### **React**
- ✅ **Hooks personalizados** para lógica reutilizable
- ✅ **Componentes funcionales**
- ✅ **Props bien tipadas**
- ✅ **Estado inmutable**

### **API Design**
- ✅ **RESTful endpoints**
- ✅ **Respuestas consistentes**
- ✅ **Manejo de errores estandarizado**
- ✅ **Validación de entrada**

### **Organización de Código**
- ✅ **Estructura modular**
- ✅ **Exports centralizados**
- ✅ **Convenciones de nomenclatura**
- ✅ **Documentación inline**

## 🔄 Próximos Pasos Recomendados

### **Base de Datos**
- [ ] Configurar Prisma ORM
- [ ] Configurar PostgreSQL/MongoDB
- [ ] Implementar migraciones
- [ ] Seeders de datos iniciales

### **Autenticación y Seguridad**
- [ ] NextAuth.js integration
- [ ] JWT tokens
- [ ] Role-based access control
- [ ] API rate limiting

### **Testing**
- [ ] Jest configuration
- [ ] React Testing Library
- [ ] E2E tests con Playwright
- [ ] Coverage reports

### **Estado Global**
- [ ] Zustand o Redux Toolkit
- [ ] Context API para temas
- [ ] Persistencia de estado

### **Validación**
- [ ] Zod schemas
- [ ] Form validation
- [ ] API input validation

### **Deployment**
- [x] **Docker configuration** ✅
- [x] **Multi-stage Dockerfile** ✅
- [x] **Docker Compose setup** ✅
- [x] **Automated build scripts** ✅
- [ ] CI/CD pipeline
- [ ] Vercel/AWS deployment
- [ ] Environment management

### **Monitoreo**
- [ ] Error tracking (Sentry)
- [ ] Analytics
- [ ] Performance monitoring
- [ ] Logging system

## 🤝 Contribuir

### **Flujo de Contribución**
1. Fork el repositorio
2. Crear una rama para la feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear un Pull Request

### **Estándares de Código**
- Seguir las convenciones de TypeScript
- Usar Prettier para formateo
- Escribir tests para nuevas features
- Documentar funciones complejas
- Seguir el patrón MVC establecido

### **Reportar Issues**
- Usar el template de issues
- Incluir pasos para reproducir
- Especificar entorno y versiones
- Proporcionar capturas de pantalla si es relevante

---

## 📞 Contacto y Soporte

Para preguntas, sugerencias o soporte:

- **Documentación técnica**: `/docs/README.md`
- **Issues**: GitHub Issues
- **Discusiones**: GitHub Discussions

---

**Desarrollado con ❤️ utilizando Next.js y TypeScript**

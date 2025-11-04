# Files App - Estructura de Proyecto

Este proyecto sigue una arquitectura MVC (Model-View-Controller) profesional para aplicaciones Next.js.

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── ui/             # Componentes base de interfaz (Button, Input, etc.)
│   ├── forms/          # Componentes de formularios
│   └── layout/         # Componentes de layout (Header, Sidebar, etc.)
├── models/             # Modelos de datos y clases de entidad
├── controllers/        # Controladores API (lógica de endpoints)
├── services/           # Servicios para llamadas API y lógica de negocio
├── hooks/              # Custom React hooks
├── utils/              # Funciones utilitarias
├── types/              # Definiciones de tipos TypeScript
├── config/             # Configuraciones de la aplicación
├── lib/                # Librerías y utilidades de terceros
├── store/              # Estado global (Redux, Zustand, etc.)
└── middleware/         # Middleware personalizado

app/                    # Next.js App Router
├── api/                # API Routes
├── globals.css         # Estilos globales
├── layout.tsx          # Layout raíz
└── page.tsx            # Página principal

docs/                   # Documentación
tests/                  # Tests
├── unit/               # Tests unitarios
└── integration/        # Tests de integración
```

## 🏗️ Arquitectura MVC

### **Models (Modelos)**
- **Ubicación**: `src/models/`
- **Propósito**: Definir la estructura de datos y lógica de entidades
- **Ejemplos**: `User.ts`, `File.ts`

### **Views (Vistas)**
- **Ubicación**: `src/components/` y `app/`
- **Propósito**: Componentes React para la interfaz de usuario
- **Ejemplos**: Páginas, componentes UI, layouts

### **Controllers (Controladores)**
- **Ubicación**: `src/controllers/` y `app/api/`
- **Propósito**: Manejar la lógica de los endpoints API
- **Ejemplos**: `UserController.ts`, rutas API

## 🔧 Servicios y Utilidades

### **Services**
Manejan la comunicación con APIs y lógica de negocio:
- `BaseService.ts` - Clase base para servicios
- `UserService.ts` - Operaciones de usuario
- `FileService.ts` - Operaciones de archivos

### **Hooks Personalizados**
Encapsulan lógica de estado y efectos:
- `useUsers.ts` - Manejo de estado de usuarios
- `useApi.ts` - Hook genérico para APIs

### **Utilidades**
Funciones de apoyo comunes:
- Formateo de fechas y archivos
- Validaciones
- Helpers de UI

## 🎨 Componentes UI

### **Componentes Base**
- `Button` - Botón reutilizable con variantes
- `Input` - Campo de entrada con validación
- `LoadingSpinner` - Indicador de carga

### **Layout Components**
- `Header` - Encabezado de la aplicación
- `Sidebar` - Navegación lateral
- `MainLayout` - Layout principal

## 📋 Mejores Prácticas

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
2. **Tipado Fuerte**: Uso extensivo de TypeScript para type safety
3. **Reutilización**: Componentes y hooks reutilizables
4. **Configuración Centralizada**: Configuraciones en `src/config/`
5. **Path Mapping**: Imports absolutos con aliases `@/`

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Tests (cuando se configuren)
npm run test
```

## 🔄 Flujo de Datos

1. **Usuario** interactúa con **Componentes** (Views)
2. **Componentes** usan **Hooks** para manejar estado
3. **Hooks** llaman a **Servicios** para operaciones
4. **Servicios** hacen peticiones a **API Routes** (Controllers)
5. **Controllers** procesan datos usando **Models**
6. Respuesta fluye de vuelta al usuario

## 📝 Próximos Pasos

- [ ] Configurar base de datos (Prisma/MongoDB)
- [ ] Implementar autenticación
- [ ] Configurar tests (Jest/Testing Library)
- [ ] Configurar CI/CD
- [ ] Implementar estado global (Zustand/Redux)
- [ ] Configurar validaciones (Zod)
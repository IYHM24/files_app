# CardCustom Component Documentation

## Descripción
`CardCustom` es un componente de tarjeta altamente personalizable y reutilizable que soporta múltiples variantes, efectos visuales y estados interactivos.

## Características Principales

### ✨ **Efectos Visuales**
- **Hover Effects**: Transformaciones suaves al pasar el mouse
- **Glow Effects**: Efectos de brillo en los iconos
- **Animations**: Animaciones de carga y transiciones
- **Gradient Overlays**: Líneas de gradiente en hover

### 🎨 **Variantes de Diseño**
- `default`: Diseño limpio con sombras sutiles
- `gradient`: Fondo degradado con efectos especiales
- `outlined`: Bordes prominentes con hover effects
- `glass`: Efecto glassmorphism con backdrop blur

### 📏 **Tamaños Disponibles**
- `sm`: Compacto (padding: 16px)
- `md`: Estándar (padding: 20px) 
- `lg`: Grande (padding: 24px)

## Props Interface

```typescript
interface CardCustomProps {
  title: string;                    // Título principal
  value: string | number;           // Valor principal a mostrar
  subtitle?: string;                // Texto descriptivo opcional
  icon?: React.ReactNode;           // Icono personalizado
  iconBg?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink' | 'gray';
  trend?: {                         // Indicador de tendencia
    value: number;                  // Porcentaje de cambio
    isPositive: boolean;            // Dirección del cambio
    label?: string;                 // Etiqueta descriptiva
  };
  loading?: boolean;                // Estado de carga
  onClick?: () => void;             // Función de click
  className?: string;               // Clases CSS adicionales
  size?: 'sm' | 'md' | 'lg';       // Tamaño de la card
  variant?: 'default' | 'gradient' | 'outlined' | 'glass';
}
```

## Ejemplos de Uso

### 1. **Card Básica**
```tsx
<CardCustom
  title="Total Files"
  value={1248}
  subtitle="Uploaded this month"
  iconBg="blue"
/>
```

### 2. **Card con Tendencia**
```tsx
<CardCustom
  title="Revenue"
  value="$24.5K"
  subtitle="Monthly earnings"
  iconBg="green"
  trend={{
    value: 12,
    isPositive: true,
    label: "vs last month"
  }}
/>
```

### 3. **Card Interactiva con Icono**
```tsx
import { Icons } from '@/components/ui';

<CardCustom
  title="Active Users"
  value={342}
  subtitle="Currently online"
  icon={<Icons.Users />}
  iconBg="purple"
  variant="gradient"
  onClick={() => navigateToUsers()}
/>
```

### 4. **Card con Estado de Carga**
```tsx
<CardCustom
  title="Loading Data"
  value="..."
  loading={true}
  iconBg="gray"
/>
```

### 5. **Card Glassmorphism Grande**
```tsx
<CardCustom
  title="Storage Usage"
  value="47.2 GB"
  subtitle="68% of total capacity"
  icon={<Icons.Storage />}
  iconBg="indigo"
  variant="glass"
  size="lg"
  trend={{
    value: 8,
    isPositive: false,
    label: "space remaining"
  }}
/>
```

## Componentes Complementarios

### **StatsGrid**
Componente para organizar múltiples cards en una grilla responsiva:

```tsx
import { StatsGrid, Icons } from '@/components/ui';

const statsData = [
  {
    title: "Sales",
    value: "$12.5K",
    icon: <Icons.Currency />,
    iconBg: "green" as const,
    trend: { value: 15, isPositive: true }
  },
  {
    title: "Users",
    value: 1248,
    icon: <Icons.Users />,
    iconBg: "blue" as const,
    trend: { value: 8, isPositive: true }
  },
  // ... más datos
];

<StatsGrid
  stats={statsData}
  columns={4}
  gap="md"
  variant="default"
/>
```

### **Icons Library**
Librería de iconos incluida para uso común:

```tsx
import { Icons } from '@/components/ui';

// Iconos SVG
<Icons.File />
<Icons.User />
<Icons.Chart />
<Icons.Upload />

// Iconos Emoji
<Icons.Emoji.Lightning />
<Icons.Emoji.Fire />
<Icons.Emoji.Trophy />
```

## Colores de Iconos Disponibles

| Color | Clase CSS | Uso Recomendado |
|-------|-----------|-----------------|
| `blue` | `bg-blue-500` | Información, archivos |
| `green` | `bg-green-500` | Éxito, crecimiento, dinero |
| `purple` | `bg-purple-500` | Analytics, premium |
| `red` | `bg-red-500` | Errores, alertas críticas |
| `yellow` | `bg-yellow-500` | Advertencias, rendimiento |
| `indigo` | `bg-indigo-500` | Tecnología, innovación |
| `pink` | `bg-pink-500` | Creatividad, engagement |
| `gray` | `bg-gray-500` | Neutral, deshabilitado |

## Efectos y Animaciones

### **Hover Effects**
- Escala suave (`hover:scale-[1.02]`)
- Sombras dinámicas (`hover:shadow-xl`)
- Transiciones de color en texto e iconos
- Línea de gradiente inferior animada

### **Loading States**
- Animación pulse en toda la card
- Spinner en el icono
- Skeleton placeholder para el valor

### **Interactive States**
- Feedback visual en click (`active:scale-[0.98]`)
- Indicador de acción (flecha) en cards clickeables
- Estados de focus para accesibilidad

## Mejores Prácticas

### **Accesibilidad**
```tsx
// Cards clickeables incluyen indicadores visuales
<CardCustom
  title="Navigate to Dashboard" 
  value="View Details"
  onClick={handleClick}
  // Automáticamente agrega cursor pointer y efectos hover
/>
```

### **Responsive Design**
```tsx
// Usar StatsGrid para layouts responsivos
<StatsGrid
  stats={data}
  columns={4} // Automáticamente se adapta: 1 col móvil, 2 tablet, 4 desktop
/>
```

### **Performance**
```tsx
// Usar loading states para mejor UX
<CardCustom
  title="API Data"
  value={data?.count || "..."}
  loading={isLoading}
/>
```

### **Consistencia Visual**
```tsx
// Agrupar cards relacionadas con mismo variant
<StatsGrid
  stats={mainStats}
  variant="gradient"
  columns={4}
/>

<StatsGrid
  stats={secondaryStats}
  variant="outlined"
  columns={3}
  size="sm"
/>
```

## Personalización Avanzada

### **CSS Custom**
```tsx
<CardCustom
  title="Custom Card"
  value="Special"
  className="bg-gradient-to-r from-pink-500 to-violet-500 text-white"
  iconBg="pink"
/>
```

### **Iconos Personalizados**
```tsx
const CustomIcon = () => (
  <svg className="w-6 h-6" fill="currentColor">
    {/* Tu SVG personalizado */}
  </svg>
);

<CardCustom
  title="Custom Feature"
  value="Active"
  icon={<CustomIcon />}
/>
```

### **Handlers de Evento**
```tsx
<CardCustom
  title="Interactive Card"
  value="Click Me"
  onClick={() => {
    // Lógica personalizada
    analytics.track('card_clicked');
    router.push('/details');
  }}
/>
```

## Casos de Uso Comunes

1. **Dashboards**: Métricas principales y KPIs
2. **Analytics**: Estadísticas y tendencias
3. **E-commerce**: Ventas, productos, usuarios
4. **Admin Panels**: Estado del sistema, logs
5. **File Management**: Estadísticas de archivos y storage
6. **User Management**: Conteos de usuarios y actividad

El componente `CardCustom` está diseñado para ser la base de cualquier dashboard profesional, proporcionando flexibilidad, rendimiento y una excelente experiencia de usuario.
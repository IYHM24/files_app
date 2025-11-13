// Configuración global de debug
export const DEBUG = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true';

// Función helper para mostrar logs de debug
export const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

// Función helper para mostrar warnings de debug
export const debugWarn = (message: string, data?: any) => {
  if (DEBUG) {
    console.warn(`[DEBUG] ${message}`, data ? data : '');
  }
};

// Función helper para mostrar errores de debug
export const debugError = (message: string, data?: any) => {
  if (DEBUG) {
    console.error(`[DEBUG] ${message}`, data ? data : '');
  }
};
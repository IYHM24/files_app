import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar salida standalone para Docker
  output: 'standalone',
  
  // Optimizaciones para producción
  poweredByHeader: false,
  compress: true,
  
  // Configuración de imágenes si es necesario
  images: {
    domains: [], // Agregar dominios de imágenes externas si es necesario
    unoptimized: false,
  },
  
  // Configuración vacía de Turbopack para evitar conflictos
  turbopack: {},
  
  // Configuraciones experimentales
  experimental: {
    // Habilitar compilación paralela
    webpackBuildWorker: true,
  },
};

export default nextConfig;

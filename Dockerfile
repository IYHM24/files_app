# Dockerfile para Next.js con TypeScript y Tailwind CSS
FROM node:20-alpine AS base

# Instalar dependencias de producción
FROM base AS deps
# Verificar https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por qué libc6-compat podría ser necesario.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar solo dependencias de producción usando npm
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production && npm cache clean --force; \
  else echo "package-lock.json not found." && exit 1; \
  fi

# Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app

# Copiar package files y instalar TODAS las dependencias (incluyendo devDependencies)
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "package-lock.json not found." && exit 1; \
  fi

COPY . .

# Next.js colecciona datos de telemetría completamente anónimos sobre el uso general.
# Aprende más aquí: https://nextjs.org/telemetry
# Deshabilitar la telemetría durante el build.
ENV NEXT_TELEMETRY_DISABLED=1

# Variables para ignorar errores de tipo y lint durante el build de Docker
ENV CI=true
ENV SKIP_TYPE_CHECK=true

# Usar Turbopack explícitamente para el build
RUN npm run build -- --turbopack

# Imagen de producción, copia todos los archivos y ejecuta next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Descomenta la siguiente línea en caso de que quieras deshabilitar la telemetría durante el tiempo de ejecución.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar dependencias de producción del stage deps
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY --from=builder /app/public ./public

# Establecer los permisos correctos para el cache de prerender
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automáticamente aprovechar las salidas de traza para reducir el tamaño de la imagen
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar package.json para el servidor standalone
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Asegurar que la carpeta de storage existe y pertenece al usuario de la app
RUN mkdir -p public/storage && chown -R nextjs:nodejs public/storage

# Declarar la carpeta como volumen (documentación/optimización para runtime)
VOLUME ["/app/public/storage"]

USER nextjs

EXPOSE 3000

ENV PORT=3000
# establecer el nombre del host a localhost
ENV HOSTNAME=0.0.0.0

# servidor.js se crea por next build desde la salida standalone
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
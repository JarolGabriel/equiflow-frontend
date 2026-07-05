# 02 — TRD (Technical Requirements Document)

> Documento de requisitos técnicos del frontend de EquiFlow.
> Plantilla base. El contenido se completa en conversaciones separadas.

## 1. Stack tecnológico

- **Framework:** Next.js (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** shadcn/ui
- **Data fetching / cache:** TanStack Query
- **Estado global (auth):** Zustand
- **Cliente HTTP:** axios
- **Pagos:** Stripe.js

<!-- TODO: definir con Jarol (versiones exactas, gestor de paquetes, etc.) -->

## 2. Decisiones de arquitectura

<!-- TODO: definir con Jarol -->

### 2.1 Estructura de carpetas

<!-- TODO: definir con Jarol -->

### 2.2 Route groups del App Router

<!-- TODO: definir con Jarol -->

### 2.3 Separación capa de datos vs UI

<!-- TODO: definir con Jarol -->

## 3. Manejo de autenticación (JWT)

<!-- TODO: definir con Jarol -->

### 3.1 Almacenamiento de tokens

<!-- TODO: definir con Jarol -->

### 3.2 Interceptores de axios (request / response)

<!-- TODO: definir con Jarol -->

### 3.3 Refresh token y reintento de request

<!-- TODO: definir con Jarol -->

### 3.4 Rutas protegidas

<!-- TODO: definir con Jarol -->

## 4. Manejo de WebSocket (alertas)

<!-- TODO: definir con Jarol -->

### 4.1 Conexión y autenticación por query param

<!-- TODO: definir con Jarol -->

### 4.2 Reconexión

<!-- TODO: definir con Jarol -->

## 5. Estrategia de manejo de errores

<!-- TODO: definir con Jarol -->

## 6. Estados de carga (loading / empty / error)

<!-- TODO: definir con Jarol -->

## 7. Variables de entorno

<!-- TODO: definir con Jarol -->

## 8. Despliegue (Vercel)

<!-- TODO: definir con Jarol -->

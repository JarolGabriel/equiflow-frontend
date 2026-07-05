# 06 — Implementation Plan

> Plan de implementación por fases del frontend de EquiFlow.
> Plantilla base. El contenido se completa en conversaciones separadas.

## Fase 1 — Auth + dashboard básico + portfolios

### Objetivo de la fase

<!-- TODO: definir con Jarol -->

### Checklist

- [ ] <!-- TODO: definir con Jarol -->

## Fase 2 — Login social OAuth (redirect_uri hacia dominio de Vercel)

### Objetivo de la fase

<!-- TODO: definir con Jarol -->

### Checklist

- [ ] <!-- TODO: definir con Jarol -->

### Backlog (features que requieren cambios de backend)

- [ ] **Múltiples watchlists personalizadas** (requiere modelo nuevo en backend). Hoy solo existe `FavoriteAsset` con `(user, asset)` único → una sola lista de favoritos por usuario.
- [ ] **Endpoint de agregación OHLC** para candlestick real en `PriceChart`. Hoy `GET /investments/assets/{id}/history/` solo devuelve `{ price, timestamp }` (area/line chart con recharts).

## Fase 3 — Alertas en tiempo real (WebSocket)

### Objetivo de la fase

<!-- TODO: definir con Jarol -->

### Checklist

- [ ] <!-- TODO: definir con Jarol -->

## Fase 4 — Pagos Stripe (suscripción Pro)

### Objetivo de la fase

<!-- TODO: definir con Jarol -->

### Checklist

- [ ] <!-- TODO: definir con Jarol -->

## Fases futuras / backlog

<!-- TODO: definir con Jarol -->

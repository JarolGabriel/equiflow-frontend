# 03 — UI / UX

> Sistema de diseño del frontend de EquiFlow.
> Tema **oscuro únicamente** (no hay light mode por ahora).
> Los tokens de esta guía están implementados en `src/app/globals.css`
> (variables HSL de shadcn) y expuestos en `tailwind.config.ts`.

## 1. Principios y referencia

- **Inspiración visual:** Investing.com / **Investing Pro** (app mobile). Ver capturas de referencia.
- La inspiración es **visual, no de navegación**: EquiFlow es una **web** (mobile-first pero pensada también para desktop), no una app nativa.
- Estilo **flat** (nada de sombras pesadas ni neumorfismo), **denso** en información, con **tipografía tabular** para números y **verde/rojo** para ganancias/pérdidas.

## 2. Tema y modo

- **Solo tema oscuro.** No hay light mode todavía.
- Los tokens se definen en `:root` dentro de `@layer base` en `src/app/globals.css`, y el `<html>` lleva la clase `dark` (`darkMode: ["class"]` en Tailwind) más `color-scheme: dark`.

<!-- TODO: definir con Jarol — si en el futuro se agrega light mode, mover el set actual a `.dark` y definir el set claro en `:root`. -->

## 3. Paleta de colores (tokens)

Formato: variables HSL de shadcn (`--token: H S% L%`), consumidas como `hsl(var(--token))`.

### 3.1 Tokens canónicos (definidos por Jarol)

| Token                     | HSL            | HEX       | Uso |
| ------------------------- | -------------- | --------- | --- |
| `--background`            | `220 29% 6%`   | `#0B0E14` | Fondo principal (casi negro azulado) |
| `--card`                  | `219 21% 13%`  | `#1A1F28` | Superficies, cards |
| `--border`                | `221 16% 20%`  | `#2A2F3A` | Bordes sutiles entre elementos |
| `--foreground`            | `0 0% 100%`    | `#FFFFFF` | Texto principal |
| `--muted-foreground`      | `214 12% 65%`  | `#9AA3AF` | Texto secundario, labels, timestamps |
| `--primary`               | `33 93% 54%`   | `#F7931A` | Acento naranja de marca / CTA |
| `--positive`              | `155 67% 45%`  | `#26C281` | Ganancias, botón Buy, variación `+` |
| `--destructive` / `--negative` | `2 77% 61%` | `#E8544E` | Pérdidas, botón Sell, variación `-` |

### 3.2 Tokens derivados (no son colores nuevos)

Para que los componentes de shadcn funcionen se necesitan más tokens del set estándar
que Jarol no definió explícitamente. Se **derivan** de los canónicos (no se inventan colores):

| Token                | Derivado de | Valor actual |
| -------------------- | ----------- | ------------ |
| `--card-foreground`     | foreground | `0 0% 100%` |
| `--popover`             | card       | `219 21% 13%` |
| `--popover-foreground`  | foreground | `0 0% 100%` |
| `--primary-foreground`  | background | `220 29% 6%` (⚠️ ver nota de contraste) |
| `--secondary`           | border     | `221 16% 20%` |
| `--secondary-foreground`| foreground | `0 0% 100%` |
| `--muted`               | card       | `219 21% 13%` |
| `--accent`              | border     | `221 16% 20%` |
| `--accent-foreground`   | foreground | `0 0% 100%` |
| `--destructive-foreground` | foreground | `0 0% 100%` |
| `--positive-foreground` | background | `220 29% 6%` (⚠️ ver nota de contraste) |
| `--negative-foreground` | foreground | `0 0% 100%` |
| `--input`               | border     | `221 16% 20%` |
| `--ring`                | primary    | `33 93% 54%` |

> **Nota de contraste (WCAG AA).** Los `*-foreground` sobre fondos saturados se ajustaron
> para cumplir el mínimo de **4.5:1** de texto normal:
> - Texto **blanco sobre `--primary` (naranja)** y sobre `--positive` (verde) medía ~**2.3:1**
>   (falla AA). Por eso `--primary-foreground` y `--positive-foreground` usan el **oscuro del
>   background** (`220 29% 6%`), que sí pasa.
> - `--negative-foreground` se mantiene en **blanco** sobre `--negative` (rojo), aceptable (~3.6:1).

<!-- TODO: definir con Jarol — confirmar/ajustar el resto de valores derivados (muted real, ring, etc.). -->

### 3.3 Semántica financiera en Tailwind

`--positive` y `--negative` son **custom** (no forman parte del set estándar de shadcn) y se
exponen en `tailwind.config.ts` (`extend.colors`) para usarse como utilidades:

- `text-positive`, `bg-positive` (+ `text-positive-foreground`, `bg-positive-foreground`)
- `text-negative`, `bg-negative` (+ `text-negative-foreground`, `bg-negative-foreground`)

`--negative` comparte valor con `--destructive`, por lo que Sell/pérdidas pueden usar
cualquiera de las dos utilidades de forma consistente.

## 4. Radio, bordes y elevación

- **Radio base:** `--radius: 0.75rem` → `rounded-lg` (`var(--radius)`), `rounded-md`, `rounded-sm` derivados.
- Cards con esquinas redondeadas: **`rounded-xl` o `rounded-2xl`**, fondo `bg-card`, borde `border-border`.
- **Sin sombras pesadas** (estilo flat). La jerarquía se logra con fondo (`background` vs `card`) y bordes, no con elevación.

## 5. Tipografía

- **Fuente:** la del sistema / default de Next vía `next/font` (Geist). No se usa fuente custom todavía.
- **Números tabulares:** precios y porcentajes **siempre** con `font-variant-numeric: tabular-nums`
  para que no "bailen" al actualizarse en tiempo real.
  - Utilidad implementada: **`.font-tabular`** (en `@layer utilities` de `globals.css`).
- **Jerarquía numérica:**
  - Precio principal: grande y **bold**.
  - Variación (`+`/`-`): al lado del precio, en `text-positive` / `text-negative`.
  - Texto secundario (fecha, exchange, ticker): `text-muted-foreground` y tamaño más pequeño.

<!-- TODO: definir con Jarol — escala tipográfica exacta (tamaños/pesos por nivel). -->

## 6. Layout general

- **Mobile-first**, pero debe verse bien en **desktop** (es web, no app nativa).
- **Header superior (dashboard):** avatar + nombre del usuario a la izquierda; acciones (idioma / configuración) a la derecha.
- **Navegación principal (responsive):**
  - **Mobile (`< md`):** **BottomTabBar** fijo abajo — `Portfolios`, `Watchlist`, `Alertas`, `Más`.
  - **Desktop (`>= md`):** esa misma navegación se convierte en un **Sidebar** lateral fijo.
- **Cards:** `rounded-xl`/`rounded-2xl`, `bg-card`, estilo flat.

<!-- TODO: definir con Jarol — anchos exactos del sidebar, alto del header/tab bar, breakpoints finos. -->

## 7. Componentes

> Para cada componente: **propósito**, **estados** y **datos del backend** que consume.
> Los datos referencian `docs/05-backend-reference.md` (ese archivo aún tiene TODOs; aquí
> solo se deja la referencia al endpoint correspondiente).

### 7.1 PriceCard

- **Propósito:** card de "Quick Access" en grid **2x2** (ícono + label + chevron), para accesos rápidos del dashboard (ej. "Mis Portfolios", "Alertas").
- **Estados:**
  - *default:* ícono + label + chevron.
  - *loading:* skeleton del contenedor.
  - *empty / error:* normalmente N/A (es navegación estática); si muestra un contador (ej. nº de alertas) y falla la carga, ocultar el contador.
- **Datos del backend:** normalmente ninguno (navegación). Si muestra contadores, ver el endpoint correspondiente en `05-backend-reference.md` (ej. Alerts). <!-- TODO: definir con Jarol -->

### 7.2 AssetRow

- **Propósito:** fila de lista (watchlist, resultados de búsqueda): ícono de bandera/moneda, nombre + ticker + exchange, precio + variación a la derecha, estrella de favorito.
- **Estados:**
  - *default:* datos completos; variación en `positive`/`negative`.
  - *loading:* skeleton de fila.
  - *empty:* lista sin resultados → estado vacío del contenedor.
  - *error:* mensaje de error recuperable con reintento.
- **Datos del backend** (ver `05-backend-reference.md`):
  - Catálogo/activo: `GET /investments/assets/` y favoritos `GET /market/assets/my-favorites/`.
  - Precio y variación en vivo: `GET /market/status/` (cache Redis).
  - Toggle de favorito: `POST /market/assets/toggle-favorite/` con `{ asset_id }` → `201 {status:"added"}` / `200 {status:"removed"}`.

### 7.3 AssetDetailHeader

- **Propósito:** encabezado del detalle de un activo: nombre, precio grande, variación, timestamp "Real Time" y flecha de dirección (▲/▼) coloreada según `positive`/`negative`.
- **Estados:**
  - *default:* precio + variación + flecha + timestamp.
  - *loading:* skeleton del bloque de precio.
  - *error:* fallback si no hay datos de mercado.
- **Datos del backend** (ver `05-backend-reference.md`):
  - Metadatos del activo: `GET /investments/assets/`.
  - Precio/variación/última actualización: `GET /market/status/`.

### 7.4 PriceChart

- **Propósito:** gráfica de evolución del precio de un activo. Se implementa como **area/line chart**, **no candlestick**, porque el backend no expone datos OHLC (open/high/low/close). Mantiene el selector de timeframe en **pills** (`1D` / `1W` / `1M` / `1Y` / `5Y` / `Max`) según los rangos que soporte el histórico.
- **Librería de gráficas:** **recharts** (ya está en el stack).
- **Estados:**
  - *default:* línea/área + eje + pill activo.
  - *loading:* skeleton del área de gráfica.
  - *empty:* sin datos para el rango.
  - *error:* fallback con reintento.
- **Datos del backend** (ver `05-backend-reference.md`):
  - Histórico de precio: `GET /investments/assets/{id}/history/` → `{ symbol, history: [{ price, timestamp }, ...] }` (últimos ~50 puntos).
- **Backlog (Fase 2):** agregar endpoint de agregación OHLC en el backend si más adelante se quiere un candlestick real (ver `06-implementation-plan.md`).

### 7.5 BuySellButtons

- **Propósito:** dos botones lado a lado, **Buy** en `positive` y **Sell** en `negative`, full width, para la pantalla de detalle de transacción.
- **Estados:**
  - *default:* Buy / Sell habilitados.
  - *loading:* botón en estado enviando (disabled + spinner) al confirmar la transacción.
  - *error:* mostrar error de validación/servidor sin perder el input.
- **Datos del backend** (ver `05-backend-reference.md`):
  - Crear transacción: `POST /investments/transactions/` con `{ portfolio, asset, transaction_type: "BUY"|"SELL", quantity, price_at_transaction }`.

### 7.6 FavoriteToggle

- **Propósito:** botón de **estrella** que hace toggle de favorito para un activo. El backend solo tiene un modelo `FavoriteAsset` con `(user, asset)` único → **una sola lista de favoritos por usuario**, sin múltiples watchlists nombradas. Por eso NO hay modal ni checkboxes de varias listas.
- **Estados:**
  - *default:* estrella vacía (no favorito) / estrella llena (favorito).
  - *loading:* estado optimista mientras se confirma el toggle (revertir si falla).
  - *error:* revertir el estado visual y mostrar feedback.
- **Datos del backend** (ver `05-backend-reference.md`):
  - Lista de favoritos actual: `GET /market/assets/my-favorites/`.
  - Marcar/quitar favorito: `POST /market/assets/toggle-favorite/` con `{ asset_id }` (confirmado en `apps/market_data/views.py`).
- **Nota:** el soporte de **múltiples watchlists personalizadas** queda en backlog de Fase 2 (requiere modelo nuevo en backend) — ver `06-implementation-plan.md`.

### 7.7 BottomTabBar / Sidebar

- **Propósito:** navegación principal, responsive.
  - **BottomTabBar (mobile `< md`):** `Portfolios`, `Watchlist`, `Alertas`, `Más`.
  - **Sidebar (desktop `>= md`):** misma navegación como barra lateral fija.
- **Estados:**
  - *default:* ítem activo resaltado (color `primary` o `foreground`).
  - Badge de no leídos en `Alertas` (ver `AlertBadge`).
- **Datos del backend:** contador de alertas no leídas → ver Alerts en `05-backend-reference.md`. <!-- TODO: definir con Jarol -->

### 7.8 AlertBadge

- **Propósito:** badge circular rojo con contador (ej. el "12" de Alerts) para notificaciones sin leer.
- **Estados:**
  - *default (n > 0):* badge visible con el número.
  - *0 / sin datos:* oculto.
  - *99+:* <!-- TODO: definir con Jarol — tope de conteo a mostrar. -->
- **Datos del backend / tiempo real** (ver `05-backend-reference.md`):
  - Conteo inicial: `GET /alerts/my-alerts/`.
  - Actualización en vivo: WebSocket `wss://.../ws/alerts/?token=<access_token>`.

## 8. Estados de pantalla (patrón global)

- **Loading:** skeletons con `bg-card`/`bg-muted`; evitar layout shift.
- **Empty:** ícono + título breve + CTA (ej. "Crea tu primer portfolio").
- **Error:** mensaje claro + acción de reintento; no romper el layout.

<!-- TODO: definir con Jarol — copys exactos, iconografía de estados vacíos, comportamiento offline. -->

## 9. Accesibilidad y responsive

<!-- TODO: definir con Jarol — contraste mínimo, focus states, tamaños táctiles, navegación por teclado. -->

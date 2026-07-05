/**
 * Types mirroring the EquiFlow Django REST backend contract.
 *
 * Conventions derived from the backend serializers/models:
 * - Primary keys are UUID strings.
 * - DRF `DecimalField`s are serialized as strings (COERCE_DECIMAL_TO_STRING default),
 *   so amounts/prices arrive as `string`. Computed `SerializerMethodField`s that return
 *   `float` arrive as `number`.
 * - Datetimes are ISO-8601 strings.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** `Asset.asset_type` is a free CharField; these are the values grouped by the backend dashboard. */
export type AssetType = "crypto" | "stock" | "forex" | (string & {});

export type TransactionType = "BUY" | "SELL";

export type AlertCondition = "ABOVE" | "BELOW";

export type AlertStatus = "PENDING" | "FIRED" | "PAUSED";

/**
 * Portfolio nature (frontend-driven).
 * - REAL: tracks actual buy/sell transactions with P&L.
 * - TRACKING: watch-only positions ("solo seguimiento").
 *
 * NOTE: backed by a `portfolio_type` field on the backend `Portfolio` model.
 * Until that field ships, responses may omit it — treat `undefined` as "REAL".
 */
export type PortfolioType = "REAL" | "TRACKING";

// ---------------------------------------------------------------------------
// Auth / users
// ---------------------------------------------------------------------------

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_pro: boolean;
  is_verified: boolean;
  profile_picture: string | null;
  created_at: string;
}

export interface RegisterInput {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** PATCH /users/profile/ — only writable fields. */
export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  profile_picture?: string | null;
}

// ---------------------------------------------------------------------------
// Assets & market data
// ---------------------------------------------------------------------------

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  asset_type: AssetType;
  exchange: string | null;
  /** Live price from Redis cache; `null` when not cached yet. */
  price: number | null;
  /** 24h percentage change; `0` when not cached. */
  change: number;
}

export interface AssetHistoryPoint {
  price: number;
  timestamp: string;
}

/** GET /investments/assets/{id}/history/ */
export interface AssetHistory {
  symbol: string;
  history: AssetHistoryPoint[];
}

/** GET /investments/market-summary/ */
export interface MarketSummary {
  cryptos: Asset[];
  stocks: Asset[];
  forex: Asset[];
}

/** A single entry of the live market status map (keyed by symbol). */
export interface MarketStatusEntry {
  price: number | null;
  change: number | null;
}

/** GET /market/status/ */
export interface MarketStatus {
  status: string;
  last_update: string | null;
  data: Record<string, MarketStatusEntry>;
}

/** POST /market/assets/toggle-favorite/ */
export interface ToggleFavoriteResponse {
  status: "added" | "removed";
}

// ---------------------------------------------------------------------------
// Portfolios & transactions
// ---------------------------------------------------------------------------

export interface PortfolioAsset {
  id: number;
  /** Asset UUID. */
  asset: string;
  asset_details: Asset;
  /** Decimal string. */
  quantity: string;
  /** Decimal string. */
  average_purchase_price: string;
  current_balance: number;
  profit_loss: number;
  last_updated: string;
}

export interface Portfolio {
  id: string;
  user_email: string;
  name: string;
  description: string | null;
  currency: string;
  is_public: boolean;
  /** "REAL" | "TRACKING". May be absent on older backends — default to "REAL". */
  portfolio_type?: PortfolioType;
  total_balance: number;
  total_profit_loss: number;
  assets: PortfolioAsset[];
  created_at: string;
}

/** Item accepted by the write-only `items` field when creating a portfolio. */
export interface CreatePortfolioItem {
  asset_id: string;
  quantity: number | string;
  price: number | string;
}

/** POST /investments/portfolios/ */
export interface CreatePortfolioInput {
  name: string;
  description?: string | null;
  currency?: string;
  is_public?: boolean;
  portfolio_type?: PortfolioType;
  items?: CreatePortfolioItem[];
}

export type UpdatePortfolioInput = Partial<
  Pick<
    Portfolio,
    "name" | "description" | "currency" | "is_public" | "portfolio_type"
  >
>;

export interface Transaction {
  id: string;
  /** Portfolio UUID. */
  portfolio: string;
  /** Asset UUID. */
  asset: string;
  asset_symbol: string;
  transaction_type: TransactionType;
  /** Decimal string. */
  quantity: string;
  /** Decimal string. */
  price_at_transaction: string;
  /** Decimal string. */
  fees: string;
  created_at: string;
}

/** POST /investments/transactions/ */
export interface CreateTransactionInput {
  portfolio: string;
  asset: string;
  transaction_type: TransactionType;
  quantity: number | string;
  price_at_transaction: number | string;
  fees?: number | string;
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export interface PriceAlert {
  id: string;
  user_email: string;
  /** Asset UUID. */
  asset: string;
  asset_symbol: string;
  /** Decimal string. */
  target_price: string;
  condition: AlertCondition;
  status: AlertStatus;
  created_at: string;
}

/** POST /alerts/my-alerts/ */
export interface CreateAlertInput {
  asset: string;
  target_price: number | string;
  condition: AlertCondition;
}

export type UpdateAlertInput = Partial<
  Pick<CreateAlertInput, "target_price" | "condition">
>;

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

/** POST /payments/create-intent/ (backend returns camelCase keys). */
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/** DRF filter/query params accepted by GET /investments/assets/. */
export interface AssetListParams {
  search?: string;
  asset_type?: AssetType;
  exchange?: string;
  ordering?: string;
}

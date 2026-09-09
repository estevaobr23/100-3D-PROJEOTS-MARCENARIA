// Núcleo do motor da área de membros. Tipos de ferramentas específicas do
// nicho, se um dia existirem, entram neste mesmo arquivo.

export interface Customer {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  cakto_product_id: string | null;
  created_at: string;
}

export type PurchaseStatus = "paid" | "pending" | "refunded" | "chargeback";

export interface Purchase {
  id: string;
  customer_id: string;
  transaction_id: string;
  status: PurchaseStatus;
  created_at: string;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  created_at: string;
}

export type EntitlementStatus = "active" | "revoked";

/** Controla o acesso liberado de um cliente a um produto. */
export interface Entitlement {
  id: string;
  customer_id: string;
  product_id: string;
  status: EntitlementStatus;
  created_at: string;
}

/** Sessão de login por e-mail (sem senha) da área de membros. */
export interface Session {
  id: string;
  customer_id: string;
  token_hash: string;
  user_agent: string | null;
  ip: string | null;
  created_at: string;
  expires_at: string;
}

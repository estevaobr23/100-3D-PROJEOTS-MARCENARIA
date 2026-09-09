import "server-only";
import { getCustomerProducts } from "@/lib/data/products";

/**
 * Conjunto de `cakto_product_id` a que o cliente tem acesso liberado
 * (entitlement ativo). A vitrine usa isso para decidir se um `Produto` do
 * CATALOGO aparece como "seu", como oferta, ou não aparece.
 *
 * Fonte de verdade é o banco (entitlements), nunca o CATALOGO.
 */
export async function idsProdutosLiberados(
  customerId: string
): Promise<Set<string>> {
  const produtos = await getCustomerProducts(customerId);
  return new Set(
    produtos
      .map((p) => p.cakto_product_id)
      .filter((id): id is string => Boolean(id))
  );
}

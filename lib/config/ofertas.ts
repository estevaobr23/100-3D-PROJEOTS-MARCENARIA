// lib/config/ofertas.ts
//
// Por enquanto guarda só o SUPORTE. O catálogo de ofertas entra junto com o
// motor de vendas — cadastrar oferta agora seria anunciar produto que ainda
// não tem checkout.

/**
 * Contato de suporte. VAZIO de propósito: não invente e-mail nem WhatsApp —
 * as telas escondem o bloco enquanto estiver em branco.
 *
 * Preencher com o MESMO endereço cadastrado no produto da Cakto, para o
 * cliente falar com quem cobra. Endereço inventado é pior que ausência: ela
 * escreve e ninguém lê.
 */
export const SUPORTE = {
  email: "",
  whatsapp: "",
};

/** Nunca interpole preço cru: `R$ ${29.9}` imprime "R$ 29.9". */
export const precoBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

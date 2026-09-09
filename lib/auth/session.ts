import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, randomBytes } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/supabase/types";

/**
 * Login por e-mail, sem senha e sem confirmação: quem tem entitlement ativo
 * entra direto. Não usa Supabase Auth (que exigiria OTP/magic link/senha) —
 * é uma tabela de sessões própria, simples de auditar e revogar.
 */

export const SESSION_COOKIE_NAME = "session_token";
const SESSION_DURATION_DAYS = 30;

/**
 * Atributos do cookie de sessão. Definidos UMA VEZ e usados tanto para gravar
 * quanto para apagar. NÃO duplique estes valores em outro arquivo.
 *
 * O navegador só reconhece duas instruções como "o mesmo cookie" se os
 * atributos baterem. Um `Set-Cookie` de apagamento sem `SameSite=None` é lido
 * como `Lax` e, em contexto cross-site (o iframe do preview do editor), o
 * navegador DESCARTA a instrução — o cookie sobrevive.
 *
 * Isso já causou tela 100% branca no /login: o cookie órfão não morria, o proxy
 * continuava vendo sessão e mandava para a área, que mandava de volta para o
 * login, em laço, até o navegador desistir. Ver `armadilhas.md`.
 */
export function sessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    // "none" em dev para o cookie sobreviver dentro de previews embutidos
    // (iframe do editor) — o Chromium trata http://localhost como origem
    // confiável, então "secure" funciona mesmo sem HTTPS. Em produção fica
    // "lax", que é a postura correta para o app em produção.
    secure: true,
    sameSite: (isProduction ? "lax" : "none") as "lax" | "none",
    path: "/",
  };
}

/**
 * Atributos para APAGAR o cookie: os mesmos de gravação, com valor vazio e data
 * no passado. `maxAge: 0` acompanha `expires` porque alguns navegadores
 * respeitam um e ignoram o outro.
 */
export function sessionCookieRemocao() {
  return { ...sessionCookieOptions(), expires: new Date(0), maxAge: 0 };
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não configurado.");
  }
  return secret;
}

/** O banco guarda só o hash: vazar a tabela não permite forjar sessão. */
function hashToken(token: string) {
  return createHmac("sha256", getSessionSecret()).update(token).digest("hex");
}

/**
 * Cria uma sessão para o cliente e grava o cookie httpOnly no navegador.
 * Deve ser chamada de dentro de uma Server Action ou Route Handler.
 */
export async function createSession(
  customerId: string,
  meta: { userAgent?: string | null; ip?: string | null }
) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  const supabase = createServiceClient();
  const { error } = await supabase.from("sessions").insert({
    customer_id: customerId,
    token_hash: tokenHash,
    user_agent: meta.userAgent ?? null,
    ip: meta.ip ?? null,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Falha ao criar sessão: ${error.message}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...sessionCookieOptions(),
    expires: expiresAt,
  });
}

/** Remove a sessão atual (banco + cookie). */
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const supabase = createServiceClient();
    await supabase.from("sessions").delete().eq("token_hash", hashToken(token));
  }

  // NÃO use `cookieStore.delete()`: ele manda um Set-Cookie pelado
  // ("session_token=; Path=/; Expires=1970"), sem os atributos originais. Sem
  // `SameSite=None` o navegador ignora a instrução dentro de um iframe e o
  // cookie sobrevive. Sobrescrever com valor vazio e os MESMOS atributos é o
  // que apaga de fato.
  cookieStore.set(SESSION_COOKIE_NAME, "", sessionCookieRemocao());
}

/** Retorna o cliente autenticado da requisição atual, ou null. Deduplicado por requisição. */
export const getCurrentCustomer = cache(async (): Promise<Customer | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const supabase = createServiceClient();
  const { data: session } = await supabase
    .from("sessions")
    .select("customer_id, expires_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", session.customer_id)
    .maybeSingle();

  return customer ?? null;
});

/**
 * Igual a getCurrentCustomer, mas redireciona para /login se não houver
 * sessão. Uso padrão em Server Actions e páginas protegidas — a autorização
 * nunca confia em ids vindos do frontend, sempre parte da sessão.
 */
export async function requireCustomer(): Promise<Customer> {
  const customer = await getCurrentCustomer();
  if (!customer) {
    // NÃO redirecione direto para /login aqui.
    //
    // O proxy faz checagem otimista (só olha se o cookie existe). Se o cookie
    // existe mas a sessão não vale mais — expirou, foi revogada, o banco foi
    // limpo, o SESSION_SECRET mudou — as duas camadas discordam:
    //
    //   /perfil → requireCustomer falha → /login
    //   /login  → proxy vê o cookie     → /  → ...infinito
    //
    // Página não pode apagar cookie (só Server Action ou Route Handler pode),
    // então mandamos para uma rota que apaga de verdade.
    const cookieStore = await cookies();
    const temCookieOrfao = Boolean(cookieStore.get(SESSION_COOKIE_NAME)?.value);
    redirect(temCookieOrfao ? "/api/sessao-encerrada" : "/login");
  }
  return customer;
}

/**
 * Busca (ou não) um cliente elegível para login: precisa existir com esse
 * e-mail e ter ao menos um entitlement ativo (acesso liberado a algum
 * produto). Retorna null se não encontrado.
 */
export async function findLoginEligibleCustomer(
  email: string
): Promise<Customer | null> {
  const supabase = createServiceClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (!customer) return null;

  const { count } = await supabase
    .from("entitlements")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", customer.id)
    .eq("status", "active");

  if (!count) return null;

  return customer;
}

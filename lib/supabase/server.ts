import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client com a service role key — só pode ser usado em código de servidor
 * (Server Actions, Route Handlers, Server Components). Ignora RLS, então a
 * autorização é feita na aplicação (ver lib/auth/session.ts).
 *
 * O `import "server-only"` faz o build quebrar se alguém importar isto num
 * client component — a chave nunca chega ao browser.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Mensagem específica: em produção, "faltando X" economiza horas de debug
  // comparado a um erro genérico de configuração.
  if (!url || !serviceRoleKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !serviceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    ].filter(Boolean);
    throw new Error(`Supabase não configurado: faltando ${missing.join(", ")}.`);
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

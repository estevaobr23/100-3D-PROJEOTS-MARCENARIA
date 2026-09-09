import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "session_token";
const PUBLIC_ROUTES = ["/login"];

/**
 * Checagem otimista (só olha o cookie, sem tocar no banco — o proxy roda em
 * toda rota, inclusive prefetch). A validação real da sessão acontece via
 * getCurrentCustomer() / requireCustomer() nas páginas que precisam do cliente.
 *
 * A área inteira é protegida: sem cookie de sessão, qualquer rota que não seja
 * /login (nem estático) redireciona para /login.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(
    request.cookies.get(SESSION_COOKIE_NAME)?.value
  );
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!hasSessionCookie && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Quem já tem cookie não precisa ver a tela de login — MENOS quando está
  // chegando de /api/sessao-encerrada, que veio justamente dizer que a sessão
  // morreu. Sem esta exceção, um cookie que se recusa a sumir fecha o laço:
  //
  //   /login → (proxy vê cookie) → / → (sessão inválida)
  //          → /api/sessao-encerrada → /login?erro=... → / → ...
  //
  // ...até o navegador desistir e pintar a tela de branco. Já aconteceu.
  // A causa está tratada em lib/auth/session.ts (apagar o cookie com os MESMOS
  // atributos com que foi gravado); isto aqui é o cinto de segurança.
  const chegouDeSessaoEncerrada = request.nextUrl.searchParams.has("erro");

  if (hasSessionCookie && isPublicRoute && !chegouDeSessaoEncerrada) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Ignora rotas de API, os internos do Next, o favicon, e qualquer arquivo
  // estático de /public — inclusive os .glb dos modelos 3D e as imagens de
  // capa. Sem a exclusão de estáticos, a otimização de imagem do Next (que
  // busca o arquivo sem cookie de sessão) recebe um redirect pro /login em
  // vez do arquivo e falha com "not a valid image".
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|glb|gltf|hdr|mp4|woff2?)$).*)",
  ],
};

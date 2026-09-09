"use client";

// app/navegacao.tsx
//
// As abas da área. A skill descreve quatro (Início · Produtos · Ferramentas ·
// Perfil) e a razão de cada uma existir.
//
// Aqui são TRÊS, e a ausência é deliberada: não temos "Ferramentas" porque o
// nicho ainda não tem utilidade nenhuma para oferecer. Aba vazia é a versão
// pequena de anunciar funcionalidade que não existe.
//
// "Início" é a ESTANTE de produtos (aba `/`, cobre também `/produto/...`): o
// cliente vê ali o que comprou e abre a página de cada produto com o conteúdo
// principal + bônus.
//   - alternativa de rótulo já considerada: "Meus produtos". Ficou "Início"
//     por ser o mais convencional em área de membros e por já ser a rota `/`.
// "Projetos" é o conteúdo do produto Acervo — a lista completa dos móveis.

import Link from "next/link";
import { usePathname } from "next/navigation";

// A aba "Início" (`/`) também acende dentro da página de produto.
const SUBROTAS_INICIO = ["/produto"];

const ABAS = [
  {
    href: "/",
    rotulo: "Início",
    icone: (
      <path d="M2.5 7.4 8 3l5.5 4.4V13a.9.9 0 0 1-.9.9h-3v-4h-3.2v4h-3a.9.9 0 0 1-.9-.9Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
    ),
  },
  {
    href: "/projetos",
    rotulo: "Projetos",
    icone: (
      <>
        <rect x="2.4" y="2.4" width="5" height="5" rx="1" stroke="currentColor"
          strokeWidth="1.4" fill="none" />
        <rect x="8.6" y="2.4" width="5" height="5" rx="1" stroke="currentColor"
          strokeWidth="1.4" fill="none" />
        <rect x="2.4" y="8.6" width="5" height="5" rx="1" stroke="currentColor"
          strokeWidth="1.4" fill="none" />
        <rect x="8.6" y="8.6" width="5" height="5" rx="1" stroke="currentColor"
          strokeWidth="1.4" fill="none" />
      </>
    ),
  },
  {
    href: "/perfil",
    rotulo: "Perfil",
    icone: (
      <>
        <circle cx="8" cy="5.6" r="2.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M2.9 13.6c0-2.8 2.3-4.4 5.1-4.4s5.1 1.6 5.1 4.4" stroke="currentColor"
          strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </>
    ),
  },
];

export function Navegacao() {
  const caminho = usePathname();

  return (
    <nav className="navBarra" aria-label="Seções da área">
      <ul className="navLista">
        {ABAS.map((aba) => {
          // "/" só é ativo em si mesmo e nas subrotas declaradas
          // (ex: /produto/...); as outras cobrem seu próprio prefixo.
          const ativa =
            aba.href === "/"
              ? caminho === "/" ||
                SUBROTAS_INICIO.some((r) => caminho.startsWith(r))
              : caminho.startsWith(aba.href);
          return (
            <li key={aba.href}>
              <Link
                className="navItem"
                href={aba.href}
                data-ativa={ativa || undefined}
                aria-current={ativa ? "page" : undefined}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  {aba.icone}
                </svg>
                <span>{aba.rotulo}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

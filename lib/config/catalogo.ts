// lib/config/catalogo.ts
//
// Fonte ÚNICA da vitrine da área de membros. A UI (aba "Início" e a página
// /produto/<slug>) só renderiza o que estiver aqui — nada de produto, bônus,
// preço ou contagem inventada na tela.
//
// COMO USAR:
//   - cada `Produto` vira um card na aba "Início" e uma página /produto/<slug>;
//   - `caktoProductId` casa com `products.cakto_product_id` no Supabase. É ele
//     que decide se o cliente vê o produto como "seu" (tem entitlement ativo)
//     ou como oferta. `null` = produto sem checkout ainda;
//   - `itens` são os cards DENTRO da página do produto: exatamente 1 do tipo
//     "principal" e quantos "bonus" existirem. Sem bônus? Deixe só o principal;
//   - `aVenda` só quando o produto deve aparecer para quem NÃO tem acesso.
//     Sem `aVenda` e sem acesso => o card nem aparece (nada de card fantasma).
//
// Ao adicionar um produto novo aqui, confirme que existe a linha correspondente
// em `products` no banco (mesmo `cakto_product_id`) — senão ninguém terá acesso.

export type ItemProduto = {
  /** Identificador do item dentro do produto (chave de lista, âncora). */
  slug: string;
  tipo: "principal" | "bonus";
  titulo: string;
  descricao: string;
  /** Caminho de imagem em /public (ex: "/modelos/039-.../preview.png"). */
  capa: string;
  /** Destino do card. Rota interna já existente (ex: "/projetos"). */
  href: string;
};

export type Produto = {
  /** Rota da página do produto: /produto/<slug>. */
  slug: string;
  /** Casa com products.cakto_product_id no banco. null = sem checkout ainda. */
  caktoProductId: string | null;
  titulo: string;
  subtitulo: string;
  /** Imagem de capa do produto na vitrine, caminho em /public. */
  capa: string;
  /** 1 item "principal" + N "bonus". */
  itens: ItemProduto[];
  /** Presente só se o produto deve ser mostrado como oferta a quem não tem acesso. */
  aVenda?: { precoBRL: number; url: string };
};

export const CATALOGO: Produto[] = [
  {
    slug: "acervo-3d-gatos",
    // Tem que ser IDÊNTICO ao products.cakto_product_id no Supabase
    // (projeto acervo-3d-membros) — é essa string que casa o entitlement do
    // cliente com este produto em app/produto/[slug]/page.tsx. Atualizado em
    // 17/09/2026 para o id real do produto ativo na Cakto ("100 Projetos de
    // Móveis 3D para Gatos"); o webhook cakto-webhook grava esse mesmo id em
    // products.cakto_product_id a cada compra aprovada — ver gpt.md, seção
    // "Área de membros — fluxo de acesso", antes de trocar este valor de novo.
    caktoProductId: "53893d88-1a58-4b12-b632-b17f07b28dcb",
    titulo: "Biblioteca de Fichas Visuais — Móveis para Gatos",
    subtitulo:
      "Fichas visuais A4 com medidas sugeridas, peças e montagem. Projetos selecionados também incluem visualização 3D interativa.",
    capa: "/modelos/039-arvore-compacta-2-niveis/preview.png",
    itens: [
      {
        slug: "acervo",
        tipo: "principal",
        titulo: "Todos os projetos",
        descricao:
          "Móveis e playgrounds em 3D, agrupados por família. Cada projeto abre com visualizador interativo, peças, medidas adaptáveis, montagem e calculadora de custos.",
        capa: "/modelos/041-torre-alta-vertical/preview.png",
        href: "/projetos",
      },
      // Sem bônus por enquanto. Para adicionar um, copie um item com
      // tipo: "bonus" e aponte o href para a rota do conteúdo dele.
    ],
    // Sem `aVenda`: este é o produto que o cliente de teste já tem liberado;
    // não há checkout público ainda.
  },
];

/** Acha um produto pelo slug da rota. */
export function acharProduto(slug: string): Produto | undefined {
  return CATALOGO.find((p) => p.slug === slug);
}

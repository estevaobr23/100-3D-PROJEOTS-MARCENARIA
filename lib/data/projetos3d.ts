import "server-only";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { listaProjetosTecnicos } from "@/lib/projetos-tecnicos";

/**
 * Feed "Modelos 3D" da página do produto: TODOS os 99 móveis do catálogo,
 * não só os que já têm GLB. Os que ainda não têm modelo 3D pronto aparecem
 * com a imagem de referência (a mesma usada para gerar a ficha) e um selo
 * "Em breve em 3D" — não ficam de fora do feed, só não abrem visualizador.
 */
export interface Projeto3D {
  codigo: string;
  slug: string;
  nome: string;
  preview: string;
  tem3d: boolean; // true = tem model.glb real + rota /projetos/<slug>
}

const DIR_PROJETOS_ROTA = path.join(process.cwd(), "app/projetos");

/** Rotas físicas existentes hoje em app/projetos/<slug>/page.tsx. */
function rotasComPagina(): Set<string> {
  let entradas: string[];
  try {
    entradas = readdirSync(DIR_PROJETOS_ROTA, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    return new Set();
  }
  return new Set(entradas);
}

export function listarProjetos3D(): Projeto3D[] {
  const rotas = rotasComPagina();

  return listaProjetosTecnicos
    .map((p) => {
      const modeloExiste = existsSync(
        path.join(process.cwd(), "public", p.modeloVisual.replace(/^\//, ""))
      );
      const rotaExiste = rotas.has(p.slug);
      return {
        codigo: p.codigo,
        slug: p.slug,
        nome: p.nome,
        preview: p.preview,
        tem3d: modeloExiste && rotaExiste,
      } satisfies Projeto3D;
    })
    .sort((a, b) => a.preview.localeCompare(b.preview));
}

import "server-only";
import { readdirSync } from "node:fs";
import { existsSync } from "node:fs";
import path from "node:path";
import { listaProjetosTecnicos, type ProjetoTecnico } from "@/lib/projetos-tecnicos";

/**
 * Feed das fichas técnicas em PDF (produto principal). Cada ficha é uma
 * imagem A4 gerada pelo GPT a partir da imagem de referência Gemini + das
 * medidas de lib/projetos-tecnicos.ts — nunca a fonte de medida em si.
 *
 * Os arquivos pesados (PNG A4 300dpi, ~12 MB) ficam em public/fichas/originais
 * só para download. Feed e página individual usam a mesma versão "grande"
 * (WebP ~1500px) — a ficha é um documento denso de texto fino (medidas,
 * legendas de peça), e um thumb menor (~700px) borra esse texto a ponto de
 * ficar ilegível. Sem thumb separado: menos arquivo, nitidez igual em
 * qualquer lugar que a imagem apareça.
 */
export interface Ficha {
  numero: string; // "001".."100"
  slug: string; // do nome do arquivo, ex: "arvore-compacta-2-niveis"
  nome: string; // nome bonito, de projetos-tecnicos quando existir
  grande: string; // /fichas/grande/<numero>-<slug>.webp — feed e ficha aberta
  original: string; // /fichas/originais/<numero>-<slug>.png — download
  categoria: string;
  dificuldade: ProjetoTecnico["dificuldade"] | undefined;
  tem3d: boolean;
  projetoSlug: string | undefined;
}

function categoriaDaFicha(numero: number): string {
  if (numero <= 9) return "Torres e árvores";
  if (numero <= 20) return "Arranhadores";
  if (numero <= 36) return "Nichos e casinhas";
  if (numero <= 44) return "Plataformas e mirantes";
  if (numero <= 50) return "Camas e redes";
  if (numero <= 58) return "Escadas e rampas";
  if (numero <= 67) return "Pontes e circuitos";
  if (numero <= 74) return "Comedouros e utilitários";
  if (numero <= 79) return "Acessórios";
  if (numero <= 91) return "Playgrounds e descanso";
  return "Área externa e especiais";
}

const DIR_GRANDE = path.join(process.cwd(), "public/fichas/grande");

function nomeBonito(numero: string, slugArquivo: string): string {
  // O `codigo` do catálogo é histórico (ex: "039", "NA1", "PLAY1") e NÃO foi
  // renumerado — só a pasta física em public/modelos/ virou "NNN-slug". Por
  // isso o casamento certo é pelo prefixo numérico de `pasta`, não por
  // `codigo`. Isso pega o nome oficial (com acentos) em vez de derivar do
  // slug cru do arquivo da ficha.
  // `pasta` não é exposta em ProjetoTecnico (é interna a ProjetoBase), mas
  // `preview` é montada como `/modelos/${pasta}/preview.png` — dá pra
  // extrair o mesmo prefixo numérico de lá sem mudar o tipo público.
  const porPasta = listaProjetosTecnicos.find((p) =>
    p.preview.startsWith(`/modelos/${numero}-`)
  );
  if (porPasta) return porPasta.nome;
  // Sem entrada correspondente: deriva um nome legível do slug do arquivo.
  return slugArquivo
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

/** Lê o disco uma vez (server-only, build/request-time) e monta o feed ordenado. */
export function listarFichas(): Ficha[] {
  let arquivos: string[];
  try {
    arquivos = readdirSync(DIR_GRANDE);
  } catch {
    return [];
  }

  const fichas = arquivos
    .filter((f) => f.endsWith(".webp"))
    .map((arquivo) => {
      const base = arquivo.replace(/\.webp$/, "");
      const match = base.match(/^(\d{3})-(.+)$/);
      if (!match) return null;
      const [, numero, slug] = match;
      const projeto = listaProjetosTecnicos.find((p) =>
        p.preview.startsWith(`/modelos/${numero}-`)
      );
      const tem3d = Boolean(
        projeto && existsSync(path.join(process.cwd(), "public", projeto.modeloVisual.replace(/^\//, "")))
      );
      return {
        numero,
        slug,
        nome: nomeBonito(numero, slug),
        grande: `/fichas/grande/${base}.webp`,
        original: `/fichas/originais/${base}.png`,
        categoria: categoriaDaFicha(Number(numero)),
        dificuldade: projeto?.dificuldade,
        tem3d,
        projetoSlug: projeto?.slug,
      } satisfies Ficha;
    })
    .filter((f): f is Ficha => f !== null);

  return fichas.sort((a, b) => a.numero.localeCompare(b.numero));
}

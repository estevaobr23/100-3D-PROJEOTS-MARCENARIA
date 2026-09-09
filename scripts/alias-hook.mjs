// scripts/alias-hook.mjs
//
// Resolve o alias "@/" (do tsconfig) para os scripts que rodam FORA do Next.
//
// Sem isso, todo script de validação precisaria DUPLICAR os dados que valida
// — e uma cópia que diverge do original valida a coisa errada com cara de
// sucesso. Com o hook, os scripts importam lib/3d/receitas.ts de verdade.

import { pathToFileURL, fileURLToPath } from "node:url";
import { resolve as resolvePath } from "node:path";
import { existsSync } from "node:fs";

const RAIZ = resolvePath(import.meta.dirname, "..");

/**
 * TypeScript importa sem extensão ("@/lib/dados/projetos"), mas o Node exige
 * o arquivo exato. Tenta .ts / .tsx / index.ts, na ordem, como o resolvedor
 * do bundler faria.
 */
function comExtensao(caminho) {
  if (existsSync(caminho) && !caminho.endsWith("/")) return caminho;
  for (const sufixo of [".ts", ".tsx", "/index.ts"]) {
    if (existsSync(caminho + sufixo)) return caminho + sufixo;
  }
  return caminho;
}

export function resolve(especificador, contexto, proximo) {
  if (especificador.startsWith("@/")) {
    const caminho = comExtensao(resolvePath(RAIZ, especificador.slice(2)));
    return proximo(pathToFileURL(caminho).href, contexto);
  }

  // Import relativo sem extensão ("./caixa") — mesma regra do TypeScript.
  if (especificador.startsWith(".") && contexto.parentURL) {
    const base = resolvePath(fileURLToPath(contexto.parentURL), "..");
    const caminho = comExtensao(resolvePath(base, especificador));
    if (existsSync(caminho)) return proximo(pathToFileURL(caminho).href, contexto);
  }

  return proximo(especificador, contexto);
}

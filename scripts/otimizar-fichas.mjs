// Otimiza as fichas técnicas (PNG A4 300dpi, ~12MB) geradas pelo GPT em
// PAGINA DE VENDAS 3D PARA GATOS/output/imagens/fichas-premium-99/ para uso
// web dentro da área de membros.
//
// Só UMA versão web (WebP ~1500px, qualidade 90) é gerada — usada tanto no
// feed (grade de cards) quanto na página individual da ficha aberta. Um
// thumb menor (~700px) foi testado e descartado: a ficha é um documento
// denso de texto fino (medidas, legendas de peça) e a redução extra borrava
// o texto a ponto de ficar ilegível. O `next/image` já serve variações
// menores automaticamente no feed via `sizes`, então uma fonte só de 1500px
// é segura em ambos os lugares.
//
// O original (PNG A4) é copiado à parte, só para download/impressão.
//
// Rodar de novo sempre que o GPT terminar um novo lote de fichas:
//   node scripts/otimizar-fichas.mjs
import sharp from "sharp";
import { readdirSync, mkdirSync, copyFileSync, statSync, rmSync, existsSync } from "node:fs";
import path from "node:path";

const ORIGEM = path.resolve(
  "../PAGINA DE VENDAS 3D PARA GATOS/output/imagens/fichas-premium-99"
);
const DEST_ORIG = path.resolve("public/fichas/originais");
const DEST_GRANDE = path.resolve("public/fichas/grande");
const DEST_THUMB_ANTIGO = path.resolve("public/fichas/thumb"); // descontinuado

for (const d of [DEST_ORIG, DEST_GRANDE]) mkdirSync(d, { recursive: true });
if (existsSync(DEST_THUMB_ANTIGO)) {
  rmSync(DEST_THUMB_ANTIGO, { recursive: true, force: true });
  console.log("Removida pasta thumb/ descontinuada.");
}

const arquivos = readdirSync(ORIGEM).filter((f) => /^ficha-\d{3}-.*\.png$/i.test(f));
console.log(`Encontrados ${arquivos.length} arquivos de ficha em origem.`);

let ok = 0;
let totalOrigBytes = 0;
let totalNovoBytes = 0;

for (const arquivo of arquivos.sort()) {
  const match = arquivo.match(/^ficha-(\d{3})-(.+?)-a4-.*\.png$/i);
  if (!match) {
    console.log("  pulei (nome não bate no padrão):", arquivo);
    continue;
  }
  const [, numero, slug] = match;
  const origPath = path.join(ORIGEM, arquivo);
  const baseNome = `${numero}-${slug}`;

  const destOrig = path.join(DEST_ORIG, `${baseNome}.png`);
  const destGrande = path.join(DEST_GRANDE, `${baseNome}.webp`);

  totalOrigBytes += statSync(origPath).size;

  copyFileSync(origPath, destOrig);
  await sharp(origPath).resize({ width: 1500 }).webp({ quality: 90 }).toFile(destGrande);

  totalNovoBytes += statSync(destGrande).size;
  ok++;
  if (ok % 10 === 0) console.log(`  ...${ok}/${arquivos.length}`);
}

console.log(`\nOK: ${ok} fichas processadas.`);
console.log(`Original copiado: ${(totalOrigBytes / 1048576).toFixed(0)} MB (fica em public/fichas/originais)`);
console.log(`Versão web (grande): ${(totalNovoBytes / 1048576).toFixed(0)} MB (public/fichas/grande)`);

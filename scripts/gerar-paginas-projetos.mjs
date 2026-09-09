import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const raiz = resolve(process.cwd());
const pastaProjetos = join(raiz, "app", "projetos");

if (!pastaProjetos.startsWith(raiz) || !(await stat(pastaProjetos)).isDirectory()) {
  throw new Error("Pasta app/projetos não encontrada dentro do projeto atual.");
}

const entradas = await readdir(pastaProjetos, { withFileTypes: true });
let total = 0;

for (const entrada of entradas) {
  if (!entrada.isDirectory() || entrada.name.startsWith("[")) continue;
  const pagina = join(pastaProjetos, entrada.name, "page.tsx");
  try {
    if (!(await stat(pagina)).isFile()) continue;
  } catch {
    continue;
  }

  const conteudo = `import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "${entrada.name}";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}
`;
  await writeFile(pagina, conteudo, "utf8");
  total += 1;
}

console.log(`${total} páginas individuais conectadas ao motor técnico.`);

const catalogo = join(pastaProjetos, "page.tsx");
const fonteDados = await readFile(join(raiz, "lib", "projetos-tecnicos.ts"), "utf8");
const medidasPorCodigo = new Map(
  [...fonteDados.matchAll(/codigo: "([^"]+)"[^\n]+medidas: \[(\d+), (\d+), (\d+)\]/g)]
    .map((resultado) => [
      resultado[1],
      `${Number(resultado[2]) / 10} × ${Number(resultado[3]) / 10} × ${Number(resultado[4]) / 10} cm`,
    ]),
);
const conteudoCatalogo = await readFile(catalogo, "utf8");
let catalogoSemBadges = conteudoCatalogo
  .replace(/ data-estado="validacao"/g, "")
  .replace(/\s*<span className="iniSelo" data-estado="validacao-digital">Em validação 3D<\/span>/g, "");

for (const [codigo, medidas] of medidasPorCodigo) {
  const codigoSeguro = codigo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const padrao = new RegExp(`(<span className="iniNum">${codigoSeguro}<\\/span>[\\s\\S]*?<span className="iniMedida medida">)[^<]*(<\\/span>)`);
  catalogoSemBadges = catalogoSemBadges.replace(padrao, `$1${medidas}$2`);
}
await writeFile(catalogo, catalogoSemBadges, "utf8");
console.log("Badges removidos e medidas sugeridas aplicadas ao catálogo.");

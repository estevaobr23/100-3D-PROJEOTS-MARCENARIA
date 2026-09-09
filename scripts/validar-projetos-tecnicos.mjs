import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const raiz = resolve(process.cwd());
const fonte = await readFile(join(raiz, "lib", "projetos-tecnicos.ts"), "utf8");
const catalogo = await readFile(join(raiz, "app", "projetos", "page.tsx"), "utf8");
const experiencia = await readFile(join(raiz, "app", "projetos", "experiencia-tecnica.tsx"), "utf8");
const segmentador = await readFile(join(raiz, "app", "projetos", "modelo-segmentado.tsx"), "utf8");
const registros = [...fonte.matchAll(/codigo: "([^"]+)"[^\n]+slug: "([^"]+)"[^\n]+pasta: "([^"]+)"[^\n]+medidas: \[(\d+), (\d+), (\d+)\]/g)];

const falhas = [];
if (registros.length !== 40) falhas.push(`Esperados 40 projetos no catálogo técnico; encontrados ${registros.length}.`);
if (new Set(registros.map((item) => item[1])).size !== registros.length) falhas.push("Há códigos técnicos duplicados.");
if (new Set(registros.map((item) => item[2])).size !== registros.length) falhas.push("Há slugs técnicos duplicados.");
if (/Em validação 3D|Validação digital|Ficha em revisão/.test(catalogo)) falhas.push("O catálogo ainda contém badge de validação.");
if (/requestFullscreen|exitFullscreen/.test(experiencia)) falhas.push("A Fullscreen API bloqueada voltou ao componente.");
if (!experiencia.includes("ModeloSegmentadoTecnico")) falhas.push("O visualizador técnico não usa a segmentação local do GLB original.");
if (/<boxGeometry|<cylinderGeometry/.test(experiencia)) falhas.push("O gêmeo genérico por caixas voltou ao visualizador.");
if (!segmentador.includes("useGLTF(projeto.modeloVisual)")) falhas.push("A segmentação não parte do mesmo GLB usado no modo Visual.");
if (!segmentador.includes("pecas.json") || !segmentador.includes("pecas.bin")) falhas.push("O visualizador não carrega os mapas locais pré-gerados.");
if (!segmentador.includes("new MeshBVH") || !experiencia.includes("firstHitOnly")) falhas.push("A seleção acelerada por BVH não está ativa.");
if (/distanciaCaixa|escolherSinais|atribuicoes\[triangulo\]/.test(segmentador)) falhas.push("O classificador geométrico pesado voltou ao navegador.");
if (/\bBounds\b|\bCenter\b/.test(segmentador)) falhas.push("O enquadramento voltou a depender das peças em movimento.");

const recursosObrigatorios = ["Visual", "Peças", "Explodida", "Montagem", "Exportar lista em CSV", "Imprimir ficha", "Observações pessoais"];
for (const recurso of recursosObrigatorios) {
  if (!experiencia.includes(recurso)) falhas.push(`Recurso ausente no motor: ${recurso}.`);
}

const diretorios = await readdir(join(raiz, "app", "projetos"), { withFileTypes: true });
const paginas = diretorios.filter((item) => item.isDirectory()).map((item) => item.name);

for (const resultado of registros) {
  const [, codigo, slug, pasta, largura, altura, profundidade] = resultado;
  try {
    await access(join(raiz, "public", "modelos", pasta, "model.glb"));
    await access(join(raiz, "public", "modelos", pasta, "preview.png"));
    await access(join(raiz, "public", "modelos", pasta, "pecas.json"));
    await access(join(raiz, "public", "modelos", pasta, "pecas.bin"));
  } catch {
    falhas.push(`${codigo}: GLB, preview ou mapa técnico ausente em ${pasta}.`);
  }
  if (!paginas.includes(slug)) falhas.push(`${codigo}: rota /projetos/${slug} ausente.`);
  else {
    const pagina = await readFile(join(raiz, "app", "projetos", slug, "page.tsx"), "utf8");
    if (!pagina.includes("PaginaProjeto") || !pagina.includes(`const slug = "${slug}"`)) falhas.push(`${codigo}: página não usa o motor técnico comum.`);
  }
  const medida = `${Number(largura) / 10} × ${Number(altura) / 10} × ${Number(profundidade) / 10} cm`;
  if (!catalogo.includes(medida)) falhas.push(`${codigo}: medida geral não aparece no catálogo.`);
}

if (falhas.length) {
  console.error(falhas.join("\n"));
  process.exitCode = 1;
} else {
  console.log("40/40 projetos com rota, GLB, preview, medidas, mapas locais e motor técnico comum.");
  console.log("Todos os modos técnicos usam a geometria exata do GLB original e mapas pré-gerados, sem créditos.");
  console.log("Badges removidos; tela cheia interna e recursos técnicos presentes.");
}

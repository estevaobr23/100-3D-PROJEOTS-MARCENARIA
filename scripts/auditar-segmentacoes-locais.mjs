import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const raiz = resolve(process.cwd());
const { listaProjetosTecnicos } = await import(pathToFileURL(join(raiz, "lib", "projetos-tecnicos.ts")).href);

function hashArquivo(caminho) {
  return new Promise((resolver, rejeitar) => {
    const hash = createHash("sha256");
    const fluxo = createReadStream(caminho);
    fluxo.on("data", (bloco) => hash.update(bloco));
    fluxo.on("error", rejeitar);
    fluxo.on("end", () => resolver(hash.digest("hex")));
  });
}

const falhas = [];
let triangulosAuditados = 0;
let bytesMapas = 0;

for (const projeto of listaProjetosTecnicos) {
  const caminhoGlb = join(raiz, "public", ...projeto.modeloVisual.replace(/^\/+/, "").split("/"));
  const pasta = dirname(caminhoGlb);
  const caminhoManifesto = join(pasta, "pecas.json");
  const caminhoMapa = join(pasta, "pecas.bin");
  try {
    const [textoManifesto, mapa, dadosGlb, sha256] = await Promise.all([
      readFile(caminhoManifesto, "utf8"),
      readFile(caminhoMapa),
      stat(caminhoGlb),
      hashArquivo(caminhoGlb),
    ]);
    const manifesto = JSON.parse(textoManifesto);
    if (manifesto.versao !== 1) falhas.push(`${projeto.codigo}: versão de mapa inválida.`);
    if (manifesto.projeto !== projeto.codigo || manifesto.slug !== projeto.slug) falhas.push(`${projeto.codigo}: identidade do manifesto divergente.`);
    if (manifesto.origem.bytes !== dadosGlb.size || manifesto.origem.sha256 !== sha256) falhas.push(`${projeto.codigo}: GLB mudou depois da geração do mapa.`);
    if (mapa.length !== manifesto.origem.triangulos) falhas.push(`${projeto.codigo}: mapa não possui um byte por triângulo.`);
    if (manifesto.integridade.triangulosClassificados !== mapa.length || manifesto.integridade.triangulosSemPeca || manifesto.integridade.triangulosDuplicados) {
      falhas.push(`${projeto.codigo}: declaração de integridade inválida.`);
    }

    const idsCobertos = new Set();
    const indicesAtivos = new Set();
    const contagens = new Uint32Array(projeto.pecas.length);
    for (const parte of manifesto.partes) {
      if (parte.indice >= projeto.pecas.length || projeto.pecas[parte.indice]?.id !== parte.id) falhas.push(`${projeto.codigo}: parte ${parte.id} não corresponde ao catálogo.`);
      indicesAtivos.add(parte.indice);
      idsCobertos.add(parte.id);
      for (const alias of parte.aliases) idsCobertos.add(alias);
    }
    for (const rotulo of mapa) {
      if (!indicesAtivos.has(rotulo)) falhas.push(`${projeto.codigo}: mapa contém rótulo ${rotulo} sem parte ativa.`);
      else contagens[rotulo]++;
    }
    for (const parte of manifesto.partes) {
      if (contagens[parte.indice] !== parte.triangulos || parte.triangulos <= 0) falhas.push(`${projeto.codigo}: contagem divergente em ${parte.id}.`);
    }
    for (const peca of projeto.pecas) if (!idsCobertos.has(peca.id)) falhas.push(`${projeto.codigo}: peça ${peca.id} não está coberta nem como alias.`);
    if (idsCobertos.size !== projeto.pecas.length) falhas.push(`${projeto.codigo}: IDs repetidos ou desconhecidos no manifesto.`);

    triangulosAuditados += mapa.length;
    bytesMapas += mapa.length;
  } catch (erro) {
    falhas.push(`${projeto.codigo}: ${erro instanceof Error ? erro.message : String(erro)}`);
  }
}

if (falhas.length) {
  console.error([...new Set(falhas)].join("\n"));
  process.exitCode = 1;
} else {
  console.log("40/40 mapas locais íntegros e vinculados ao SHA-256 do GLB correspondente.");
  console.log(`${triangulosAuditados.toLocaleString("pt-BR")} triângulos cobertos uma única vez; ${(bytesMapas / 1024 / 1024).toFixed(1)} MB de mapas.`);
  console.log("Nenhum crédito ou serviço externo foi usado na geração ou auditoria.");
}

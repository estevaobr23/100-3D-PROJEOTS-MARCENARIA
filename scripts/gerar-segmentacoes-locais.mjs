import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import * as THREE from "three";

const raiz = resolve(process.cwd());
const versao = 1;

async function carregarProjetos() {
  const caminho = join(raiz, "lib", "projetos-tecnicos.ts");
  const modulo = await import(pathToFileURL(caminho).href);
  return modulo.listaProjetosTecnicos;
}

function lerGlb(buffer) {
  if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error("Arquivo não é GLB.");
  let cursor = 12;
  let json;
  let binario;
  while (cursor < buffer.length) {
    const tamanho = buffer.readUInt32LE(cursor);
    const tipo = buffer.toString("ascii", cursor + 4, cursor + 8);
    const inicio = cursor + 8;
    if (tipo === "JSON") json = JSON.parse(buffer.toString("utf8", inicio, inicio + tamanho).trim());
    if (tipo === "BIN\0") binario = buffer.subarray(inicio, inicio + tamanho);
    cursor = inicio + tamanho;
  }
  if (!json || !binario) throw new Error("GLB sem JSON ou BIN.");
  return { json, binario };
}

function leitorAccessor(json, binario, indiceAccessor) {
  const accessor = json.accessors[indiceAccessor];
  const view = json.bufferViews[accessor.bufferView];
  const componentes = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
  const bytes = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 }[accessor.componentType];
  const stride = view.byteStride ?? componentes * bytes;
  const inicio = (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const dados = new DataView(binario.buffer, binario.byteOffset, binario.byteLength);
  const lerComponente = (indice, componente = 0) => {
    const offset = inicio + indice * stride + componente * bytes;
    if (accessor.componentType === 5121) return dados.getUint8(offset);
    if (accessor.componentType === 5123) return dados.getUint16(offset, true);
    if (accessor.componentType === 5125) return dados.getUint32(offset, true);
    if (accessor.componentType === 5126) return dados.getFloat32(offset, true);
    throw new Error(`componentType ${accessor.componentType} não suportado.`);
  };
  return { count: accessor.count, componentes, ler: lerComponente };
}

function matrizNo(json, indiceMalha) {
  const no = json.nodes.find((item) => item.mesh === indiceMalha);
  if (!no) return new THREE.Matrix4();
  if (no.matrix) return new THREE.Matrix4().fromArray(no.matrix);
  const posicao = new THREE.Vector3(...(no.translation ?? [0, 0, 0]));
  const rotacao = new THREE.Quaternion(...(no.rotation ?? [0, 0, 0, 1]));
  const escala = new THREE.Vector3(...(no.scale ?? [1, 1, 1]));
  return new THREE.Matrix4().compose(posicao, rotacao, escala);
}

const permutacoes = [
  [0, 1, 2], [2, 1, 0],
];

function melhorPermutacao(tamanhoModelo, dimensoes) {
  const modelo = [tamanhoModelo.x, tamanhoModelo.y, tamanhoModelo.z];
  let melhor = permutacoes[0];
  let menorErro = Number.POSITIVE_INFINITY;
  for (const permutacao of permutacoes) {
    const logs = dimensoes.map((dimensao, eixo) => Math.log(modelo[permutacao[eixo]] / Math.max(dimensao, 1)));
    const media = logs.reduce((total, valor) => total + valor, 0) / 3;
    const erro = logs.reduce((total, valor) => total + (valor - media) ** 2, 0);
    if (erro < menorErro) {
      menorErro = erro;
      melhor = permutacao;
    }
  }
  return melhor;
}

function prepararCaixas(projeto) {
  const dimensoes = [projeto.dimensoesGerais.largura, projeto.dimensoesGerais.altura, projeto.dimensoesGerais.profundidade];
  const escala = 2.45 / Math.max(...dimensoes);
  return projeto.pecas.map((peca) => ({
    id: peca.id,
    nome: peca.nome,
    etapa: peca.etapaMontagem,
    centro: peca.posicao.map((valor) => valor / escala),
    metade: peca.geometriaVisual.tamanho.map((valor) => Math.max(valor / escala / 2, 4)),
    inversa: new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...peca.rotacao)).invert(),
  }));
}

function distanciaCaixa(x, y, z, caixa) {
  const e = caixa.inversa.elements;
  const dx = x - caixa.centro[0];
  const dy = y - caixa.centro[1];
  const dz = z - caixa.centro[2];
  const lx = e[0] * dx + e[4] * dy + e[8] * dz;
  const ly = e[1] * dx + e[5] * dy + e[9] * dz;
  const lz = e[2] * dx + e[6] * dy + e[10] * dz;
  const nx = Math.abs(lx) / caixa.metade[0];
  const ny = Math.abs(ly) / caixa.metade[1];
  const nz = Math.abs(lz) / caixa.metade[2];
  const ox = Math.max(nx - 1, 0);
  const oy = Math.max(ny - 1, 0);
  const oz = Math.max(nz - 1, 0);
  const fora = ox * ox + oy * oy + oz * oz;
  const profundidade = fora === 0 ? Math.min(1 - nx, 1 - ny, 1 - nz) : 0;
  return fora * 100 + profundidade * 0.08 + (nx * nx + ny * ny + nz * nz) * 0.001;
}

function criarConversor(centro, tamanho, dimensoes, permutacao, sinais) {
  const c = [centro.x, centro.y, centro.z];
  const t = [tamanho.x, tamanho.y, tamanho.z];
  return (ponto) => {
    const valor = [ponto[0], ponto[1], ponto[2]];
    return dimensoes.map((dimensao, eixo) => {
      const eixoModelo = permutacao[eixo];
      return ((valor[eixoModelo] - c[eixoModelo]) / Math.max(t[eixoModelo], 0.000001)) * dimensao * sinais[eixo];
    });
  };
}

function escolherSinais(componentes, caixas, centro, tamanho, dimensoes, permutacao) {
  let melhores = [-1, -1, -1];
  let menorErro = Number.POSITIVE_INFINITY;
  // Os GLBs do catálogo foram gerados em pé: Y é sempre a altura. Preservar
  // esse eixo impede que piso/teto sejam confundidos com frente/laterais.
  for (const sx of [-1, 1]) for (const sy of [1]) for (const sz of [-1, 1]) {
    const sinais = [sx, sy, sz];
    const converter = criarConversor(centro, tamanho, dimensoes, permutacao, sinais);
    let erro = 0;
    const passo = Math.max(1, Math.floor(componentes.length / 900));
    for (let indice = 0; indice < componentes.length; indice += passo) {
      const componente = componentes[indice];
      const [x, y, z] = converter(componente.centro);
      let distancia = Number.POSITIVE_INFINITY;
      for (const caixa of caixas) distancia = Math.min(distancia, distanciaCaixa(x, y, z, caixa));
      erro += distancia * Math.min(componente.triangulos, 5000);
    }
    if (erro < menorErro) {
      menorErro = erro;
      melhores = sinais;
    }
  }
  return melhores;
}

function transformarPonto(matriz, x, y, z) {
  const e = matriz.elements;
  return [
    e[0] * x + e[4] * y + e[8] * z + e[12],
    e[1] * x + e[5] * y + e[9] * z + e[13],
    e[2] * x + e[6] * y + e[10] * z + e[14],
  ];
}

function analisarMalha(json, binario, indiceMalha = 0) {
  const primitiva = json.meshes[indiceMalha]?.primitives?.[0];
  if (!primitiva || primitiva.mode !== undefined && primitiva.mode !== 4) throw new Error("Apenas primitivas triangulares são suportadas.");
  const posicao = leitorAccessor(json, binario, primitiva.attributes.POSITION);
  const indice = leitorAccessor(json, binario, primitiva.indices);
  const matriz = matrizNo(json, indiceMalha);
  const posicoesMundo = new Float32Array(posicao.count * 3);
  const limite = new THREE.Box3();
  for (let i = 0; i < posicao.count; i++) {
    const ponto = transformarPonto(matriz, posicao.ler(i, 0), posicao.ler(i, 1), posicao.ler(i, 2));
    posicoesMundo.set(ponto, i * 3);
    limite.expandByPoint(new THREE.Vector3(...ponto));
  }

  const pais = new Int32Array(posicao.count);
  const tamanhos = new Uint32Array(posicao.count);
  for (let i = 0; i < pais.length; i++) { pais[i] = i; tamanhos[i] = 1; }
  const raizDe = (valor) => {
    let raiz = valor;
    while (pais[raiz] !== raiz) raiz = pais[raiz];
    while (pais[valor] !== valor) {
      const anterior = pais[valor];
      pais[valor] = raiz;
      valor = anterior;
    }
    return raiz;
  };
  const unir = (a, b) => {
    a = raizDe(a); b = raizDe(b);
    if (a === b) return;
    if (tamanhos[a] < tamanhos[b]) [a, b] = [b, a];
    pais[b] = a;
    tamanhos[a] += tamanhos[b];
  };
  const triangulos = Math.floor(indice.count / 3);
  for (let t = 0; t < triangulos; t++) {
    const inicio = t * 3;
    const a = indice.ler(inicio);
    const b = indice.ler(inicio + 1);
    const c = indice.ler(inicio + 2);
    unir(a, b); unir(a, c);
  }

  const mapaRaizes = new Map();
  const trianguloComponente = new Uint32Array(triangulos);
  const componentes = [];
  for (let t = 0; t < triangulos; t++) {
    const inicio = t * 3;
    const vertices = [indice.ler(inicio), indice.ler(inicio + 1), indice.ler(inicio + 2)];
    const raiz = raizDe(vertices[0]);
    let id = mapaRaizes.get(raiz);
    if (id === undefined) {
      id = componentes.length;
      mapaRaizes.set(raiz, id);
      componentes.push({ triangulos: 0, soma: [0, 0, 0], min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity], centro: [0, 0, 0] });
    }
    trianguloComponente[t] = id;
    const componente = componentes[id];
    componente.triangulos++;
    for (const vertice of vertices) {
      for (let eixo = 0; eixo < 3; eixo++) {
        const valor = posicoesMundo[vertice * 3 + eixo];
        componente.soma[eixo] += valor;
        componente.min[eixo] = Math.min(componente.min[eixo], valor);
        componente.max[eixo] = Math.max(componente.max[eixo], valor);
      }
    }
  }
  for (const componente of componentes) {
    componente.centro = componente.soma.map((valor) => valor / (componente.triangulos * 3));
  }
  return { triangulos, vertices: posicao.count, componentes, trianguloComponente, limite };
}

function gerarMapa(projeto, analise) {
  const dimensoes = [projeto.dimensoesGerais.largura, projeto.dimensoesGerais.altura, projeto.dimensoesGerais.profundidade];
  const caixas = prepararCaixas(projeto);
  const centro = analise.limite.getCenter(new THREE.Vector3());
  const tamanho = analise.limite.getSize(new THREE.Vector3());
  const permutacao = melhorPermutacao(tamanho, dimensoes);
  const sinais = escolherSinais(analise.componentes, caixas, centro, tamanho, dimensoes, permutacao);
  const converter = criarConversor(centro, tamanho, dimensoes, permutacao, sinais);
  const rotulosComponentes = new Uint8Array(analise.componentes.length);

  analise.componentes.forEach((componente, indice) => {
    const [x, y, z] = converter(componente.centro);
    let melhor = 0;
    let menor = Number.POSITIVE_INFINITY;
    caixas.forEach((caixa, indiceCaixa) => {
      const distancia = distanciaCaixa(x, y, z, caixa);
      if (distancia < menor) { menor = distancia; melhor = indiceCaixa; }
    });
    rotulosComponentes[indice] = melhor;
  });

  const rotulos = new Uint8Array(analise.triangulos);
  const contagens = new Uint32Array(caixas.length);
  for (let t = 0; t < analise.triangulos; t++) {
    const rotulo = rotulosComponentes[analise.trianguloComponente[t]];
    rotulos[t] = rotulo;
    contagens[rotulo]++;
  }

  const centrosPartes = caixas.map(() => ({ soma: [0, 0, 0], peso: 0 }));
  analise.componentes.forEach((componente, indice) => {
    const rotulo = rotulosComponentes[indice];
    const peso = componente.triangulos;
    centrosPartes[rotulo].peso += peso;
    for (let eixo = 0; eixo < 3; eixo++) centrosPartes[rotulo].soma[eixo] += componente.centro[eixo] * peso;
  });

  const partesAtivas = [];
  const aliasesPendentes = [];
  contagens.forEach((quantidade, indice) => {
    if (quantidade) {
      const centroParte = centrosPartes[indice].soma.map((valor) => valor / centrosPartes[indice].peso);
      const direcao = new THREE.Vector3(...centroParte).sub(centro);
      if (direcao.lengthSq() < 1e-8) direcao.set(0, 1, 0);
      direcao.normalize().multiplyScalar(Math.max(tamanho.x, tamanho.y, tamanho.z) * 0.72);
      partesAtivas.push({
        indice,
        id: caixas[indice].id,
        nome: caixas[indice].nome,
        aliases: [],
        triangulos: quantidade,
        etapaMontagem: caixas[indice].etapa,
        centro: centroParte.map((valor) => Number(valor.toFixed(6))),
        vetorExplosao: direcao.toArray().map((valor) => Number(valor.toFixed(6))),
      });
    } else {
      aliasesPendentes.push(caixas[indice]);
    }
  });

  for (const alias of aliasesPendentes) {
    let destino = partesAtivas[0];
    let menor = Number.POSITIVE_INFINITY;
    for (const parte of partesAtivas) {
      const alvo = caixas[parte.indice];
      const distancia = alias.centro.reduce((total, valor, eixo) => total + (valor - alvo.centro[eixo]) ** 2, 0);
      if (distancia < menor) { menor = distancia; destino = parte; }
    }
    destino.aliases.push(alias.id);
  }

  return {
    rotulos,
    partes: partesAtivas,
    eixos: { permutacao, sinais },
    centro: centro.toArray().map((valor) => Number(valor.toFixed(6))),
    tamanho: tamanho.toArray().map((valor) => Number(valor.toFixed(6))),
  };
}

async function processarProjeto(projeto) {
  const relativo = projeto.modeloVisual.replace(/^\/+/, "").split("/");
  const caminhoGlb = join(raiz, "public", ...relativo);
  const buffer = await readFile(caminhoGlb);
  const { json, binario } = lerGlb(buffer);
  if (json.meshes.length !== 1 || json.meshes[0].primitives.length !== 1) {
    throw new Error(`${projeto.codigo}: esperado um único mesh/primitiva.`);
  }
  const analise = analisarMalha(json, binario);
  const mapa = gerarMapa(projeto, analise);
  const pasta = dirname(caminhoGlb);
  const manifesto = {
    versao,
    projeto: projeto.codigo,
    slug: projeto.slug,
    origem: {
      arquivo: "model.glb",
      sha256: createHash("sha256").update(buffer).digest("hex"),
      bytes: buffer.length,
      vertices: analise.vertices,
      triangulos: analise.triangulos,
      componentesConectados: analise.componentes.length,
    },
    mapa: "pecas.bin",
    metodo: "componentes-conectados-com-sementes-tecnicas",
    status: "gerada-localmente",
    eixos: mapa.eixos,
    centroModelo: mapa.centro,
    tamanhoModelo: mapa.tamanho,
    partes: mapa.partes,
    integridade: {
      triangulosClassificados: mapa.rotulos.length,
      triangulosSemPeca: 0,
      triangulosDuplicados: 0,
    },
  };
  await writeFile(join(pasta, "pecas.bin"), mapa.rotulos);
  await writeFile(join(pasta, "pecas.json"), `${JSON.stringify(manifesto, null, 2)}\n`, "utf8");
  return manifesto;
}

const projetosCatalogo = await carregarProjetos();
const indiceSlug = process.argv.indexOf("--slug");
const slugSolicitado = indiceSlug >= 0 ? process.argv[indiceSlug + 1] : null;
const projetos = slugSolicitado
  ? projetosCatalogo.filter((projeto) => projeto.slug === slugSolicitado || projeto.codigo === slugSolicitado)
  : projetosCatalogo;
if (!projetos.length) throw new Error(`Projeto não encontrado: ${slugSolicitado}`);
const resultados = [];
for (const projeto of projetos) {
  const inicio = performance.now();
  const manifesto = await processarProjeto(projeto);
  resultados.push(manifesto);
  console.log(`${projeto.codigo.padEnd(5)} ${String(manifesto.origem.triangulos).padStart(8)} tri · ${String(manifesto.origem.componentesConectados).padStart(4)} ilhas · ${manifesto.partes.length}/${projeto.pecas.length} partes · ${Math.round(performance.now() - inicio)} ms`);
}

const totalTriangulos = resultados.reduce((total, item) => total + item.origem.triangulos, 0);
const totalBytesMapas = resultados.reduce((total, item) => total + item.origem.triangulos, 0);
console.log(`\n${resultados.length} projetos processados sem API externa.`);
console.log(`${totalTriangulos.toLocaleString("pt-BR")} triângulos classificados exatamente uma vez.`);
console.log(`${(totalBytesMapas / 1024 / 1024).toFixed(1)} MB de mapas locais antes da compressão HTTP.`);

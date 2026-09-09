"use client";

import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, use } from "react";
import type { ElementRef } from "react";
import * as THREE from "three";
import { acceleratedRaycast, MeshBVH } from "three-mesh-bvh";
import type { PecaTecnica, ProjetoTecnico, Vetor3 } from "@/lib/projetos-tecnicos";
import { aplicarTomMadeira } from "./visualizador-modelo";

type ModoTecnico = "pecas" | "explodida" | "montagem";
interface ParteManifesto {
  indice: number;
  id: string;
  nome: string;
  aliases: string[];
  triangulos: number;
  etapaMontagem: number;
  centro: Vetor3;
  vetorExplosao: Vetor3;
}

interface ManifestoSegmentacao {
  versao: number;
  projeto: string;
  origem: { triangulos: number; vertices: number; sha256: string };
  mapa: string;
  centroModelo: Vetor3;
  tamanhoModelo: Vetor3;
  partes: ParteManifesto[];
  integridade: {
    triangulosClassificados: number;
    triangulosSemPeca: number;
    triangulosDuplicados: number;
  };
}

interface DadosMapa {
  manifesto: ManifestoSegmentacao;
  rotulos: Uint8Array;
}

interface ParteSegmentada {
  peca: PecaTecnica;
  pecasIdentificadas: PecaTecnica[];
  ids: string[];
  objeto: THREE.Group;
  centro: THREE.Vector3;
  vetorExplosao: THREE.Vector3;
  triangulos: number;
}

interface ResultadoSegmentacao {
  partes: ParteSegmentada[];
  centro: THREE.Vector3;
  tamanho: THREE.Vector3;
  escala: number;
  liberar: () => void;
}

const CACHE_MAPAS = new Map<string, Promise<DadosMapa>>();

function urlsMapa(modeloVisual: string) {
  const base = modeloVisual.slice(0, modeloVisual.lastIndexOf("/") + 1);
  return { manifesto: `${base}pecas.json`, binario: `${base}pecas.bin` };
}

function carregarMapa(modeloVisual: string) {
  const existente = CACHE_MAPAS.get(modeloVisual);
  if (existente) return existente;

  const urls = urlsMapa(modeloVisual);
  const promessa = Promise.all([fetch(urls.manifesto), fetch(urls.binario)]).then(async ([respostaManifesto, respostaMapa]) => {
    if (!respostaManifesto.ok || !respostaMapa.ok) {
      throw new Error(`Mapa técnico indisponível para ${modeloVisual}.`);
    }
    const manifesto = await respostaManifesto.json() as ManifestoSegmentacao;
    const rotulos = new Uint8Array(await respostaMapa.arrayBuffer());
    if (manifesto.versao !== 1 || rotulos.length !== manifesto.origem.triangulos) {
      throw new Error(`Mapa técnico incompatível para ${modeloVisual}.`);
    }
    if (
      manifesto.integridade.triangulosClassificados !== rotulos.length
      || manifesto.integridade.triangulosSemPeca !== 0
      || manifesto.integridade.triangulosDuplicados !== 0
    ) {
      throw new Error(`Falha de integridade no mapa técnico de ${modeloVisual}.`);
    }
    return { manifesto, rotulos };
  });

  CACHE_MAPAS.set(modeloVisual, promessa);
  return promessa;
}

function clonarMaterial(material: THREE.Material | THREE.Material[]) {
  return Array.isArray(material) ? material.map((item) => item.clone()) : material.clone();
}

function liberarMaterial(material: THREE.Material | THREE.Material[]) {
  (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose());
}

function criarSegmentacao(
  cenaOriginal: THREE.Object3D,
  projeto: ProjetoTecnico,
  dados: DadosMapa,
): ResultadoSegmentacao {
  cenaOriginal.updateMatrixWorld(true);
  const malhas: THREE.Mesh[] = [];
  cenaOriginal.traverse((objeto) => {
    const malha = objeto as THREE.Mesh;
    if (malha.isMesh && malha.geometry instanceof THREE.BufferGeometry) malhas.push(malha);
  });
  if (malhas.length !== 1) throw new Error(`O mapa local de ${projeto.codigo} espera uma malha única.`);

  const malhaOriginal = malhas[0];
  const geometriaOriginal = malhaOriginal.geometry;
  const indiceOriginal = geometriaOriginal.getIndex();
  const posicoes = geometriaOriginal.getAttribute("position");
  if (!posicoes) throw new Error(`Modelo ${projeto.codigo} sem posições de vértices.`);

  const totalTriangulos = indiceOriginal
    ? Math.floor(indiceOriginal.count / 3)
    : Math.floor(posicoes.count / 3);
  if (totalTriangulos !== dados.rotulos.length) {
    throw new Error(`O GLB de ${projeto.codigo} mudou; regenere o mapa técnico local.`);
  }

  const quantidades = new Uint32Array(projeto.pecas.length);
  for (const rotulo of dados.rotulos) {
    if (rotulo >= quantidades.length) throw new Error(`Rótulo inválido no mapa de ${projeto.codigo}.`);
    quantidades[rotulo] += 3;
  }
  const indicesPartes = Array.from(quantidades, (quantidade) => new Uint32Array(quantidade));
  const cursores = new Uint32Array(projeto.pecas.length);
  for (let triangulo = 0; triangulo < totalTriangulos; triangulo++) {
    const rotulo = dados.rotulos[triangulo];
    const cursor = cursores[rotulo];
    const inicio = triangulo * 3;
    indicesPartes[rotulo][cursor] = indiceOriginal ? indiceOriginal.getX(inicio) : inicio;
    indicesPartes[rotulo][cursor + 1] = indiceOriginal ? indiceOriginal.getX(inicio + 1) : inicio + 1;
    indicesPartes[rotulo][cursor + 2] = indiceOriginal ? indiceOriginal.getX(inicio + 2) : inicio + 2;
    cursores[rotulo] += 3;
  }

  const geometriasCriadas: THREE.BufferGeometry[] = [];
  const materiaisCriados: Array<THREE.Material | THREE.Material[]> = [];
  const partes = dados.manifesto.partes.map<ParteSegmentada>((parteMapa) => {
    const peca = projeto.pecas[parteMapa.indice];
    if (!peca || peca.id !== parteMapa.id) {
      throw new Error(`Catálogo e mapa técnico divergentes no projeto ${projeto.codigo}.`);
    }
    const geometria = new THREE.BufferGeometry();
    for (const [nome, atributo] of Object.entries(geometriaOriginal.attributes)) {
      geometria.setAttribute(nome, atributo);
    }
    geometria.setIndex(new THREE.BufferAttribute(indicesPartes[parteMapa.indice], 1));
    geometria.computeBoundingBox();
    geometria.computeBoundingSphere();
    (geometria as unknown as { boundsTree: MeshBVH }).boundsTree = new MeshBVH(
      geometria,
      { indirect: true, maxLeafSize: 40 },
    );
    geometriasCriadas.push(geometria);

    const material = clonarMaterial(malhaOriginal.material);
    materiaisCriados.push(material);
    const malha = new THREE.Mesh(geometria, material);
    malha.raycast = acceleratedRaycast;
    malha.matrixAutoUpdate = false;
    malha.matrix.copy(malhaOriginal.matrixWorld);
    malha.castShadow = true;
    malha.receiveShadow = true;
    const objeto = new THREE.Group();
    objeto.add(malha);
    aplicarTomMadeira(objeto);

    return {
      peca,
      pecasIdentificadas: [peca.id, ...parteMapa.aliases]
        .map((id) => projeto.pecas.find((item) => item.id === id))
        .filter((item): item is PecaTecnica => Boolean(item)),
      ids: [peca.id, ...parteMapa.aliases],
      objeto,
      centro: new THREE.Vector3(...parteMapa.centro),
      vetorExplosao: new THREE.Vector3(...parteMapa.vetorExplosao),
      triangulos: parteMapa.triangulos,
    };
  });

  const centro = new THREE.Vector3(...dados.manifesto.centroModelo);
  const tamanho = new THREE.Vector3(...dados.manifesto.tamanhoModelo);
  const escala = 2.55 / Math.max(tamanho.x, tamanho.y, tamanho.z, 0.000001);
  return {
    partes,
    centro,
    tamanho,
    escala,
    liberar: () => {
      geometriasCriadas.forEach((geometria) => {
        geometria.dispose();
      });
      materiaisCriados.forEach(liberarMaterial);
    },
  };
}

function atualizarMateriais(objeto: THREE.Object3D, selecionada: boolean, atenuada: boolean) {
  objeto.traverse((item) => {
    const malha = item as THREE.Mesh;
    if (!malha.isMesh) return;
    const materiais = Array.isArray(malha.material) ? malha.material : [malha.material];
    materiais.forEach((material) => {
      const padrao = material as THREE.MeshStandardMaterial;
      padrao.transparent = atenuada;
      padrao.opacity = atenuada ? 0.16 : 1;
      padrao.depthWrite = !atenuada;
      if (padrao.emissive) {
        padrao.emissive.set(selecionada ? "#f59e0b" : "#000000");
        padrao.emissiveIntensity = selecionada ? 0.55 : 0;
      }
      padrao.needsUpdate = true;
    });
  });
}

function ParteReal({
  parte,
  explosao,
  idSelecionada,
  atenuada,
  mostrarIdentificadores,
  onSelecionar,
}: {
  parte: ParteSegmentada;
  explosao: number;
  idSelecionada: string | null;
  atenuada: boolean;
  mostrarIdentificadores: boolean;
  onSelecionar: (id: string) => void;
}) {
  const selecionada = idSelecionada !== null && parte.ids.includes(idSelecionada);
  useEffect(() => atualizarMateriais(parte.objeto, selecionada, atenuada), [atenuada, parte.objeto, selecionada]);
  const deslocamento = parte.vetorExplosao.clone().multiplyScalar(explosao);
  // O marcador está dentro do mesmo grupo que recebe a explosão. Somamos
  // apenas um pequeno afastamento para ele não ficar enterrado na malha.
  const posicaoEtiqueta = parte.centro.clone().add(parte.vetorExplosao.clone().normalize().multiplyScalar(0.075));

  return (
    <group
      position={deslocamento}
      onClick={(evento) => {
        evento.stopPropagation();
        onSelecionar(parte.peca.id);
      }}
    >
      <primitive object={parte.objeto} dispose={null} />
      {(mostrarIdentificadores || selecionada) && (
        <Html center sprite distanceFactor={2.9} position={posicaoEtiqueta}>
          <span className="tecMarcadorGrupo" aria-label="Identificadores das peças">
            {parte.pecasIdentificadas.map((peca) => (
              <button
                key={peca.id}
                type="button"
                className={idSelecionada === peca.id ? "tecMarcadorPeca tecMarcadorPecaAtivo" : "tecMarcadorPeca"}
                aria-label={`Selecionar peça ${peca.identificador}: ${peca.nome}`}
                aria-pressed={idSelecionada === peca.id}
                title={`${peca.identificador} — ${peca.nome}`}
                onPointerDown={(evento) => evento.stopPropagation()}
                onClick={(evento) => {
                  evento.stopPropagation();
                  onSelecionar(peca.id);
                }}
              >
                {peca.identificador}
              </button>
            ))}
          </span>
        </Html>
      )}
    </group>
  );
}

function ControlesCamera({ reiniciar }: { reiniciar: number }) {
  const controles = useRef<ElementRef<typeof OrbitControls>>(null);
  useEffect(() => { controles.current?.reset(); }, [reiniciar]);
  return <OrbitControls ref={controles} makeDefault enablePan={false} minDistance={1.6} maxDistance={10} target={[0, 0, 0]} />;
}

export function ModeloSegmentadoTecnico({
  projeto,
  modo,
  explosao,
  etapa,
  selecionada,
  ocultas,
  isolada,
  transparentes,
  mostrarIdentificadores,
  reiniciarCamera,
  onSelecionar,
}: {
  projeto: ProjetoTecnico;
  modo: ModoTecnico;
  explosao: number;
  etapa: number;
  selecionada: string | null;
  ocultas: Set<string>;
  isolada: string | null;
  transparentes: boolean;
  mostrarIdentificadores: boolean;
  reiniciarCamera: number;
  onSelecionar: (id: string | null) => void;
}) {
  const { scene } = useGLTF(projeto.modeloVisual);
  const dados = use(carregarMapa(projeto.modeloVisual));
  const segmentacao = useMemo(() => criarSegmentacao(scene, projeto, dados), [dados, projeto, scene]);
  useEffect(() => () => segmentacao.liberar(), [segmentacao]);
  const fatorExplosao = modo === "explodida" ? explosao : 0;

  return (
    <>
      <color attach="background" args={["#eef2f4"]} />
      <ambientLight intensity={2} color="#fff8ef" />
      <directionalLight castShadow position={[4, 6, 5]} intensity={2.3} color="#fff6ea" />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#eef2ff" />
      <group scale={segmentacao.escala}>
        <group position={segmentacao.centro.clone().multiplyScalar(-1)}>
          {segmentacao.partes.map((parte) => {
            const selecionaParte = selecionada !== null && parte.ids.includes(selecionada);
            const parteOculta = parte.ids.some((id) => ocultas.has(id));
            const parteIsolada = isolada !== null && parte.ids.includes(isolada);
            const foraDoIsolamento = isolada !== null && !parteIsolada;
            const visivelNaMontagem = modo !== "montagem" || parte.peca.etapaMontagem <= etapa;
            if (!visivelNaMontagem || parteOculta || (foraDoIsolamento && !transparentes)) return null;
            return (
              <ParteReal
                key={parte.peca.id}
                parte={parte}
                explosao={fatorExplosao}
                idSelecionada={selecionada}
                atenuada={foraDoIsolamento || (transparentes && !selecionaParte)}
                mostrarIdentificadores={mostrarIdentificadores}
                onSelecionar={onSelecionar}
              />
            );
          })}
        </group>
      </group>
      <ControlesCamera reiniciar={reiniciarCamera} />
    </>
  );
}

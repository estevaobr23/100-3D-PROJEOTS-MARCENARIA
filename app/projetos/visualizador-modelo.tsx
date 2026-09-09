"use client";

// Visualizador 3D genérico, reutilizável por projeto via prop `src`.
// Extraído do antigo visualizador-039 quando o 2º projeto (041) entrou —
// a doc do projeto (gpt.md) pedia essa extração "ao entrar o segundo
// projeto, não antes". Mesma cena do piloto: enquadramento automático,
// luz ambiente + duas direcionais, limite de densidade de pixels.
// As classes CSS continuam .vis039* — são o contrato de estilo em inicio.css.

import { Bounds, Center, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

// Cor de compensado de bétula (birch) claro. O Tripo, na conversão
// image-to-3D, vem entregando a madeira quase branca (defeito recorrente
// anotado no contexto.md). Aqui a cor base de cada mesh claro do GLB é
// interpolada (lerp) em direção a esse tom — força moderada, para dar cor de
// madeira sem virar caramelo/verniz. `SISAL` é um bege um pouco mais quente
// para as partes que representam corda.
const BIRCH = new THREE.Color("#d8b487");
const SISAL = new THREE.Color("#cdb184");
const FORCA = 0.35; // 0 = sem efeito, 1 = cor chapada

export function aplicarTomMadeira(raiz: THREE.Object3D) {
  raiz.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      const mat = m as THREE.MeshStandardMaterial;
      if (!mat || !mat.color) continue;
      // Só mexe em peças muito claras (o branco lavado). Ferragem preta,
      // tecido escuro e sombra ficam intactos.
      const luma = (mat.color.r + mat.color.g + mat.color.b) / 3;
      if (luma > 0.6) {
        const alvo = mat.name.toLowerCase().includes("rope") ? SISAL : BIRCH;
        mat.color.lerp(alvo, FORCA);
        mat.metalness = 0;
        mat.needsUpdate = true;
      }
    }
  });
}

function Modelo({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const cena = useMemo(() => {
    const clone = scene.clone(true);
    aplicarTomMadeira(clone);
    return clone;
  }, [scene]);

  return (
    <Center>
      <primitive object={cena} />
    </Center>
  );
}

// <Bounds fit clip> assume o enquadramento: ele mesmo posiciona câmera e
// alvo a partir da caixa do modelo. Por isso NÃO passamos `target` ao
// OrbitControls (no piloto isso funcionava por coincidência com um móvel
// baixo; num móvel alto puxava a vista pra baixo). O único ajuste por
// projeto é `margem` — quanto respiro deixar em volta — e o teto de zoom.
type Enquadramento = {
  margem?: number;
  distMin?: number;
  distMax?: number;
};

export function VisualizadorModelo({
  src,
  rotulo,
  margem = 1.25,
  distMin = 2.2,
  distMax = 8,
  reiniciar = 0,
}: {
  src: string;
  rotulo: string;
  reiniciar?: number;
} & Enquadramento) {
  const idLegenda = `vis-legenda-${src.replace(/[^a-z0-9]/gi, "-")}`;

  return (
    <figure className="vis039" aria-labelledby={idLegenda}>
      <Canvas
        camera={{ fov: 35, position: [3.3, 2.8, 4.5] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Luz de leve tom quente para "esquentar" a madeira sem estourar. */}
        <ambientLight intensity={2} color="#fff8ef" />
        <directionalLight position={[4, 6, 5]} intensity={2.3} color="#fff6ea" />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#eef2ff" />
        <Suspense fallback={null}>
          <Bounds key={reiniciar} fit clip observe margin={margem}>
            <Modelo src={src} />
          </Bounds>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          makeDefault
          minDistance={distMin}
          maxDistance={distMax}
        />
      </Canvas>
      <figcaption id={idLegenda} className="vis039Legenda">
        {rotulo}
      </figcaption>
    </figure>
  );
}

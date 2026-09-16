"use client";

// Projeto 040 — Árvore Média de 3 Níveis. Terceiro modelo do fluxo imagem → 3D.
// Wrapper sobre VisualizadorModelo. Proporção entre o piloto (baixo) e a torre
// 041 (alta): margem um pouco maior que a do piloto, teto de zoom no meio.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_040 = "/modelos/002-arvore-media-de-3-niveis/model.glb";

export function Visualizador040() {
  return (
    <VisualizadorModelo
      src={MODELO_040}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.45}
      distMin={2.4}
      distMax={10}
    />
  );
}

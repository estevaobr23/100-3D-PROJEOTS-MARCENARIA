"use client";

// Playground PLAY5 — Playground Família. Árvore → ponte → segunda árvore →
// rede de tecido → plataforma de topo. A maior composição do acervo.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_PLAY5 = "/modelos/084-playground-familia/model.glb";

export function VisualizadorPlay5() {
  return (
    <VisualizadorModelo
      src={MODELO_PLAY5}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.1}
      distMax={18}
    />
  );
}

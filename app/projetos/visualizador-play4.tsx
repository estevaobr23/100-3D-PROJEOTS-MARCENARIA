"use client";

// Playground PLAY4 — Circuito Arranhador. Painel de sisal → poste de chão →
// plataforma → ponte de ripas até a plataforma final.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_PLAY4 = "/modelos/PLAY4-circuito-arranhador/model.glb";

export function VisualizadorPlay4() {
  return (
    <VisualizadorModelo
      src={MODELO_PLAY4}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1}
      distMax={18}
    />
  );
}

"use client";

// Playground PLAY3 — Circuito Vertical de Canto. Poste de sisal → escada de
// canto → pilha de plataformas → nicho de canto no topo. Sobe pela quina.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_PLAY3 = "/modelos/PLAY3-circuito-vertical-canto/model.glb";

export function VisualizadorPlay3() {
  return (
    <VisualizadorModelo
      src={MODELO_PLAY3}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.2}
      distMax={16}
    />
  );
}

"use client";

// Projeto C1 — Poste de Ligação entre Dois Níveis. Bloco C (ligação vertical).
// Cilindro reto revestido de sisal entre duas tábuas quadradas (topo e base).
// Móvel alto e estreito: margem folgada, teto de zoom maior.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_C1 = "/modelos/C1-poste-ligacao-dois-niveis/model.glb";

export function VisualizadorC1() {
  return (
    <VisualizadorModelo
      src={MODELO_C1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.5}
      distMax={11}
    />
  );
}

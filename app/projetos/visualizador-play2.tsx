"use client";

// Playground PLAY2 — Circuito com Nicho. Degraus → passarela → nicho-túnel →
// mirante. Cena larga na horizontal: margem folgada, teto de zoom alto.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_PLAY2 = "/modelos/081-circuito-com-nicho/model.glb";

export function VisualizadorPlay2() {
  return (
    <VisualizadorModelo
      src={MODELO_PLAY2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.15}
      distMax={16}
    />
  );
}

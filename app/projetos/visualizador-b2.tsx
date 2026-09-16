"use client";

// Projeto B2 — Ponte Flexível de Tecido Reforçado. Bloco B (travessias flexíveis).
// Faixa de lona tensa entre duas molduras de madeira. O tecido é comprado à
// parte; a moldura é o que entra no corte.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_B2 = "/modelos/060-ponte-flexivel-de-tecido-reforcado/model.glb";

export function VisualizadorB2() {
  return (
    <VisualizadorModelo
      src={MODELO_B2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={12}
    />
  );
}

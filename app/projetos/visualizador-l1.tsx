"use client";

// Projeto L1 — Comedouro Elevado Simples. Bloco L (utilitários).
// Tampo de compensado sobre quatro pernas, um furo circular, uma tigela.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_L1 = "/modelos/L1-comedouro-simples/model.glb";

export function VisualizadorL1() {
  return (
    <VisualizadorModelo
      src={MODELO_L1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
    />
  );
}

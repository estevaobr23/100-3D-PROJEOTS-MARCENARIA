"use client";

// Projeto L2 — Comedouro Elevado Duplo. Bloco L (utilitários).
// Mesmo módulo do L1 com dois furos e duas tigelas — parâmetro de contagem.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_L2 = "/modelos/L2-comedouro-duplo/model.glb";

export function VisualizadorL2() {
  return (
    <VisualizadorModelo
      src={MODELO_L2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
    />
  );
}

"use client";

// Projeto H2 — Cama Suspensa em Tecido Tenso. Bloco H (descanso em tecido).
// Mesmo módulo do H1, tensão diferente: tecido esticado quase plano numa
// moldura de compensado, tipo trampolim.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_H2 = "/modelos/046-cama-suspensa-em-tecido-tenso/model.glb";

export function VisualizadorH2() {
  return (
    <VisualizadorModelo
      src={MODELO_H2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
      distMax={11}
    />
  );
}

"use client";

// Projeto B1 — Ponte Suspensa de Ripas com Corda. Bloco B (travessias flexíveis).
// Muitas ripas de madeira transversais unidas por duas cordas laterais. Nunca
// tábua única — é o MODULO_PONTE validado.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_B1 = "/modelos/059-ponte-suspensa-de-ripas-com-corda/model.glb";

export function VisualizadorB1() {
  return (
    <VisualizadorModelo
      src={MODELO_B1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={12}
    />
  );
}

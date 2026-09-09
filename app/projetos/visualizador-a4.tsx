"use client";

// Projeto A4 — Passarela Reta. Bloco A (subida/passagem).
// Uma prancha longa reta única sobre três mãos-francesas. O caso mais simples.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_A4 = "/modelos/A4-passarela-reta/model.glb";

export function VisualizadorA4() {
  return (
    <VisualizadorModelo
      src={MODELO_A4}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
      distMax={12}
    />
  );
}

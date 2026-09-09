"use client";

// Projeto 032 — Painel Arranhador de Canto (90°). Bloco I.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_032 = "/modelos/032-painel-arranhador-canto/model.glb";

export function Visualizador032() {
  return (
    <VisualizadorModelo
      src={MODELO_032}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
    />
  );
}

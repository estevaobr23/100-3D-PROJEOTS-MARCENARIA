"use client";

// Projeto 036 — Arranhador Horizontal tipo Banco. Bloco I. Baixo e comprido.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_036 = "/modelos/036-arranhador-banco/model.glb";

export function Visualizador036() {
  return (
    <VisualizadorModelo
      src={MODELO_036}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

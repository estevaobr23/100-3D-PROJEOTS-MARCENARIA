"use client";

// Projeto 035 — Arranhador Inclinado tipo Cunha. Bloco I.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_035 = "/modelos/035-arranhador-cunha/model.glb";

export function Visualizador035() {
  return (
    <VisualizadorModelo
      src={MODELO_035}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
    />
  );
}

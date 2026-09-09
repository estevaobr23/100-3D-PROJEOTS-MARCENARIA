"use client";

// Projeto 033 — Poste Arranhador de Chão. Bloco I. Móvel alto e estreito.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_033 = "/modelos/033-poste-arranhador-chao/model.glb";

export function Visualizador033() {
  return (
    <VisualizadorModelo
      src={MODELO_033}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.5}
      distMax={11}
    />
  );
}

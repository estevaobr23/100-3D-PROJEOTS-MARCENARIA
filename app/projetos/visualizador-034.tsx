"use client";

// Projeto 034 — Poste Arranhador com Plataforma. Bloco I. Alto e estreito.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_034 = "/modelos/014-poste-arranhador-com-plataforma/model.glb";

export function Visualizador034() {
  return (
    <VisualizadorModelo
      src={MODELO_034}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.5}
      distMax={11}
    />
  );
}

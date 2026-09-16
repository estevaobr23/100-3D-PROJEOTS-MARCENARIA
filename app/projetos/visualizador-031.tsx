"use client";

// Projeto 031 — Painel Arranhador de Parede. Bloco I (arranhadores retos).
// Chapa vertical: a margem padrão do VisualizadorModelo enquadra bem.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_031 = "/modelos/011-painel-arranhador-de-parede/model.glb";

export function Visualizador031() {
  return (
    <VisualizadorModelo
      src={MODELO_031}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
    />
  );
}

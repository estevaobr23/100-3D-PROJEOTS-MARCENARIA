"use client";

// Projeto A1 — Degraus Escalonados de Parede. Bloco A (subida/passagem).
// Quatro degraus retangulares em escada ascendente, mão-francesa sob cada um.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_A1 = "/modelos/A1-degraus-escalonados-parede/model.glb";

export function VisualizadorA1() {
  return (
    <VisualizadorModelo
      src={MODELO_A1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={11}
    />
  );
}

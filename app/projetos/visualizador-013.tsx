"use client";

// Projeto 013 — Nicho Túnel Retangular. Bloco de nichos (E+F).
// Caixa baixa e larga: a margem padrão do VisualizadorModelo já enquadra bem.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_013 = "/modelos/013-nicho-tunel-retangular/model.glb";

export function Visualizador013() {
  return (
    <VisualizadorModelo
      src={MODELO_013}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

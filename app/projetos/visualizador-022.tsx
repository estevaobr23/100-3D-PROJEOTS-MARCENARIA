"use client";

// Projeto 022 — Casinha Suspensa com Telhado de Dois Planos. Bloco de nichos (E+F).
// O telhado de duas águas deixa o móvel um pouco mais alto que os nichos-caixa:
// margem levemente maior.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_022 = "/modelos/022-casinha-suspensa-telhado/model.glb";

export function Visualizador022() {
  return (
    <VisualizadorModelo
      src={MODELO_022}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
    />
  );
}

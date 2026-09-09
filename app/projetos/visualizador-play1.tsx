"use client";

// Playground PLAY1 — Circuito de Parede Simples. Primeira cena composta do
// acervo: 5 módulos (rampa, plataforma, ponte, plataforma, plataforma de topo)
// num único GLB, gerado a partir de imagem de referência do Gemini 3 Pro Image
// e convertido no Tripo. Cena larga: margem folgada e teto de zoom alto.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_PLAY1 = "/modelos/PLAY1-circuito-parede-simples/model.glb";

export function VisualizadorPlay1() {
  return (
    <VisualizadorModelo
      src={MODELO_PLAY1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.15}
      distMax={16}
    />
  );
}

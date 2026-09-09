"use client";

// Projeto H3 — Cama Concha com Laterais Retas. Bloco H (descanso em tecido).
// Berço facetado de painéis retos unidos em ângulo (nunca curva), almofada
// fina no fundo. Correção do 029: laterais curvas viraram anguladas retas.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_H3 = "/modelos/H3-cama-concha-laterais-retas/model.glb";

export function VisualizadorH3() {
  return (
    <VisualizadorModelo
      src={MODELO_H3}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
      distMax={11}
    />
  );
}

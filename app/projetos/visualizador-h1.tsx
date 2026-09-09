"use client";

// Projeto H1 — Rede Suspensa de Parede. Bloco H (descanso em tecido).
// Faixa de tecido em rede rasa entre dois braços de madeira presos à parede.
// A madeira entra no corte; o tecido é comprado.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_H1 = "/modelos/H1-rede-suspensa-parede/model.glb";

export function VisualizadorH1() {
  return (
    <VisualizadorModelo
      src={MODELO_H1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={11}
    />
  );
}

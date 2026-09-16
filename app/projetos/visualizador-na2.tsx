"use client";

// Projeto NA2 — Nicho Aberto de Canto. Família "Nichos abertos / mirantes".
// Duas faces fechadas (encostam nas duas paredes do canto), frente e o outro
// lado abertos, teto com furo.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_NA2 = "/modelos/022-nicho-aberto-de-canto/model.glb";

export function VisualizadorNA2() {
  return (
    <VisualizadorModelo
      src={MODELO_NA2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

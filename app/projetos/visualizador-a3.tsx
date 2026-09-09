"use client";

// Projeto A3 — Escada em Zigue-Zague de Parede. Bloco A (subida/passagem).
// Degraus alternando esquerda/direita conforme sobem, todos na mesma parede.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_A3 = "/modelos/A3-escada-zigue-zague/model.glb";

export function VisualizadorA3() {
  return (
    <VisualizadorModelo
      src={MODELO_A3}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={11}
    />
  );
}

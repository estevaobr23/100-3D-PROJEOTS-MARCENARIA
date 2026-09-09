"use client";

// Projeto D1 — Painel Modular de Escalada com Apoios. Bloco D (painel de escalada).
// Painel vertical de compensado com 6 blocos retangulares em grade escalonada.
// Painel em pé: margem intermediária.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_D1 = "/modelos/D1-painel-modular-escalada/model.glb";

export function VisualizadorD1() {
  return (
    <VisualizadorModelo
      src={MODELO_D1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={10}
    />
  );
}

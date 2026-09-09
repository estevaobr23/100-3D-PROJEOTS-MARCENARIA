"use client";

// Projeto G1 — Prateleira de Descanso Simples. Bloco G (plataformas de descanso).
// Tábua horizontal única sobre duas mãos-francesas. Móvel baixo e largo:
// margem folgada, teto de zoom baixo.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_G1 = "/modelos/G1-plataforma-descanso-simples/model.glb";

export function VisualizadorG1() {
  return (
    <VisualizadorModelo
      src={MODELO_G1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

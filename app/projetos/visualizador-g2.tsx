"use client";

// Projeto G2 — Prateleira de Descanso com Borda. Bloco G (plataformas de descanso).
// Mesma tábua do G1 + borda de contenção em 3 lados (fundo + 2 laterais),
// frente aberta. Baixo e largo: margem folgada.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_G2 = "/modelos/038-prateleira-de-descanso-com-borda/model.glb";

export function VisualizadorG2() {
  return (
    <VisualizadorModelo
      src={MODELO_G2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

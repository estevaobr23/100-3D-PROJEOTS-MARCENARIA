"use client";

// Projeto G3 — Mirante de Janela. Bloco G (plataformas de descanso).
// Prateleira larga e funda (gato deitado esticado), na cota de um parapeito,
// borda baixa em 3 lados, frente aberta, mãos-francesas reforçadas.
// A janela nunca entra no modelo — é produto isolado.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_G3 = "/modelos/G3-mirante-de-janela/model.glb";

export function VisualizadorG3() {
  return (
    <VisualizadorModelo
      src={MODELO_G3}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.35}
    />
  );
}

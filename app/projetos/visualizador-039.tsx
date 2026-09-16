"use client";

// Piloto 039 — Árvore Compacta de 2 Níveis.
// Wrapper fino sobre VisualizadorModelo: a cena foi extraída quando o
// projeto 041 entrou. A API pública (Visualizador039) não mudou, então as
// páginas do piloto seguem intactas.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_039 = "/modelos/001-arvore-compacta-de-2-niveis/model.glb";

export function Visualizador039({ reiniciar = 0 }: { reiniciar?: number }) {
  return (
    <VisualizadorModelo
      src={MODELO_039}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      reiniciar={reiniciar}
    />
  );
}

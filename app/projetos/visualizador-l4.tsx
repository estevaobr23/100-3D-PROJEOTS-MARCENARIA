"use client";

// Projeto L4 — Estação Compacta com Armazenamento. Bloco L (utilitários).
// Gabinete vertical estreito: porta na base, gaveta e comedouro integrado no
// topo. Versão vertical da estação de alimentação.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_L4 = "/modelos/070-estacao-compacta-com-armazenamento/model.glb";

export function VisualizadorL4() {
  return (
    <VisualizadorModelo
      src={MODELO_L4}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={11}
    />
  );
}

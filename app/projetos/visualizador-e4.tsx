"use client";

// Projeto E4 — Nicho Túnel com Saída no Topo. Bloco de nichos (E+F).
// Sem número antigo no catálogo (módulo novo); slug estável "nicho-tunel-saida-topo".

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_E4 = "/modelos/E4-nicho-tunel-saida-topo/model.glb";

export function VisualizadorE4() {
  return (
    <VisualizadorModelo
      src={MODELO_E4}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

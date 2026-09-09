"use client";

// Projeto 015 — Nicho Túnel com Entrada em Ângulo. Bloco de nichos (E+F).

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_015 = "/modelos/015-nicho-tunel-entrada-angulo/model.glb";

export function Visualizador015() {
  return (
    <VisualizadorModelo
      src={MODELO_015}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

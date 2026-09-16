"use client";

// Projeto J1 — Protetor de Canto de Sofá em Sisal. Bloco J (acessório).
// Peça em L de dois painéis a 90°, faces externas em sisal, interior nu.
// É SOB MEDIDA: depende das dimensões reais do sofá do comprador.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_J1 = "/modelos/076-protetor-de-canto-de-sofa-em-sisal/model.glb";

export function VisualizadorJ1() {
  return (
    <VisualizadorModelo
      src={MODELO_J1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

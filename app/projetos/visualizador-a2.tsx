"use client";

// Projeto A2 — Escada de Canto. Bloco A (subida/passagem).
// Cinco degraus + patamar em L, fazendo uma virada de 90° numa quina.
// Nota: a conversão 3D gravou rótulos de referência ("STEP 1/3/4/5") nas
// faces dos degraus — defeito cosmético anotado no aviso da página.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_A2 = "/modelos/052-escada-de-canto/model.glb";

export function VisualizadorA2() {
  return (
    <VisualizadorModelo
      src={MODELO_A2}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={11}
    />
  );
}

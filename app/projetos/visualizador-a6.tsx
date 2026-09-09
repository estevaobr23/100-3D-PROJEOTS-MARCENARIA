"use client";

// Projeto A6 — Rampa de Acesso (gato idoso). Bloco A (subida/passagem).
// Plano inclinado reto com ripas travessas antiderrapantes. Sem curva.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_A6 = "/modelos/A6-rampa-acesso-idoso/model.glb";

export function VisualizadorA6() {
  return (
    <VisualizadorModelo
      src={MODELO_A6}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={12}
    />
  );
}

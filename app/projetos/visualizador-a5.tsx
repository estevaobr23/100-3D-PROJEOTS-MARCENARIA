"use client";

// Projeto A5 — Passarela com Recorte Reto. Bloco A (subida/passagem).
// Dois segmentos retos que se encontram num desvio anguloso (dog-leg),
// nunca curva — é o ponto do projeto.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_A5 = "/modelos/A5-passarela-recorte-reto/model.glb";

export function VisualizadorA5() {
  return (
    <VisualizadorModelo
      src={MODELO_A5}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.4}
      distMax={12}
    />
  );
}

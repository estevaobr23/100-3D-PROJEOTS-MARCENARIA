"use client";

// Projeto NA1 — Nicho Aberto de Parede. Família "Nichos abertos / mirantes".
// Estilo desenhado pelo usuário: frente + duas laterais abertas, fundo e piso
// sólidos, teto com um furo. É o modelo de nicho mais usado nos projetos reais.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_NA1 = "/modelos/021-nicho-aberto-de-parede/model.glb";

export function VisualizadorNA1() {
  return (
    <VisualizadorModelo
      src={MODELO_NA1}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.3}
    />
  );
}

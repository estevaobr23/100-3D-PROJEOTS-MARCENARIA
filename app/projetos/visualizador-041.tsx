"use client";

// Projeto 041 — Torre Alta Vertical. Segundo modelo do fluxo imagem → 3D.
// Wrapper sobre VisualizadorModelo. A torre é alta e estreita: margem de
// enquadramento maior pra <Bounds> não encostar no topo e na base, e teto
// de zoom mais alto pra caber recuada.

import { VisualizadorModelo } from "./visualizador-modelo";

const MODELO_041 = "/modelos/041-torre-alta-vertical/model.glb";

export function Visualizador041() {
  return (
    <VisualizadorModelo
      src={MODELO_041}
      rotulo="Arraste para girar · role ou use pinça para aproximar"
      margem={1.6}
      distMin={2.5}
      distMax={12}
    />
  );
}

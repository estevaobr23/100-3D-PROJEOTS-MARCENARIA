"use client";

import { useEffect, useRef, useState } from "react";
import { VisualizadorModelo } from "../../projetos/visualizador-modelo";

export function Visualizador3DFicha({ src, nome }: { src: string; nome: string }) {
  const ancora = useRef<HTMLDivElement>(null);
  const [carregar, setCarregar] = useState(false);
  const [reiniciar, setReiniciar] = useState(0);

  useEffect(() => {
    const elemento = ancora.current;
    if (!elemento || carregar) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setCarregar(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [carregar]);

  return (
    <div ref={ancora} className="ficha3dPalco">
      {carregar ? (
        <VisualizadorModelo
          src={src}
          rotulo={`Modelo 3D de ${nome}. Arraste para girar e use a rolagem para aproximar.`}
          reiniciar={reiniciar}
          margem={1.35}
        />
      ) : (
        <div className="ficha3dCarregando">Preparando o visualizador 3D…</div>
      )}
      <button className="fichaBotaoSecundario" type="button" onClick={() => setReiniciar((n) => n + 1)}>
        Reenquadrar modelo
      </button>
    </div>
  );
}

"use client";

// app/cabecalho.tsx
//
// O header global ("Móveis para Gatos / FICHAS VISUAIS") é sticky, mas não
// pode ficar preso na tela o tempo todo: em telas com feed longo (fichas,
// projetos) ele disputa espaço com a barra de busca/abas logo abaixo. Padrão
// de app: esconde ao rolar pra baixo, volta a aparecer ao rolar pra cima —
// o usuário nunca perde o topo de vista por muito tempo, mas ganha espaço
// de tela durante a rolagem contínua.

import { useEffect, useRef, useState } from "react";

export function Cabecalho({ children }: { children: React.ReactNode }) {
  const [escondido, setEscondido] = useState(false);
  const ultimoY = useRef(0);

  useEffect(() => {
    ultimoY.current = window.scrollY;

    function aoRolar() {
      const y = window.scrollY;
      const delta = y - ultimoY.current;

      // Perto do topo, sempre mostra — evita "piscar" escondido/visível em
      // rolagens minúsculas logo no início da página.
      if (y < 80) {
        setEscondido(false);
      } else if (delta > 4) {
        setEscondido(true); // descendo
      } else if (delta < -4) {
        setEscondido(false); // subindo
      }

      ultimoY.current = y;
    }

    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header className="iniTopo" data-escondido={escondido || undefined}>
      {children}
    </header>
  );
}

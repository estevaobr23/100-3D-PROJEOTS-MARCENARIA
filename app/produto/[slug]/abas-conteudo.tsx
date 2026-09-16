"use client";

// app/produto/[slug]/abas-conteudo.tsx
//
// Troca client-side entre os dois feeds do produto: "Fichas Técnicas" (o
// que o Gemini + GPT geraram) e "Modelos 3D" (todos os 99 móveis — os que
// já têm GLB abrem o visualizador em /projetos/<slug>; os que ainda não
// têm aparecem com a imagem de referência e o selo "Em breve em 3D", sem
// link, para não abrir uma rota inexistente). Só a aba ativa fica montada.

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Ficha } from "@/lib/data/fichas";
import type { Projeto3D } from "@/lib/data/projetos3d";

export function AbasConteudo({
  fichas,
  projetos3d,
}: {
  fichas: Ficha[];
  projetos3d: Projeto3D[];
}) {
  const [aba, setAba] = useState<"fichas" | "3d">("fichas");

  return (
    <>
      <div className="prodAbas" role="tablist" aria-label="Conteúdo do produto">
        <button
          type="button"
          role="tab"
          aria-selected={aba === "fichas"}
          className="prodAba"
          data-ativa={aba === "fichas" || undefined}
          onClick={() => setAba("fichas")}
        >
          Fichas Técnicas
          <span className="prodAbaConta">{fichas.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={aba === "3d"}
          className="prodAba"
          data-ativa={aba === "3d" || undefined}
          onClick={() => setAba("3d")}
        >
          Modelos 3D · Bônus
          <span className="prodAbaConta">{projetos3d.length}</span>
        </button>
      </div>

      {aba === "fichas" ? (
        <FeedFichas fichas={fichas} />
      ) : (
        <Feed3D projetos={projetos3d} />
      )}
    </>
  );
}

function FeedFichas({ fichas }: { fichas: Ficha[] }) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [so3d, setSo3d] = useState(false);
  const [colunas, setColunas] = useState(3);

  useEffect(() => {
    try {
      const salva = Number(localStorage.getItem("fichas-colunas"));
      if ([1, 2, 3].includes(salva)) setColunas(salva);
    } catch {}
  }, []);

  const categorias = useMemo(() => ["Todas", ...new Set(fichas.map((f) => f.categoria))], [fichas]);
  const visiveis = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return fichas.filter((ficha) =>
      (!termo || `${ficha.numero} ${ficha.nome}`.toLocaleLowerCase("pt-BR").includes(termo)) &&
      (categoria === "Todas" || ficha.categoria === categoria) &&
      (!so3d || ficha.tem3d)
    );
  }, [busca, categoria, fichas, so3d]);

  if (fichas.length === 0) {
    return (
      <p className="prodFichasVazio">
        As fichas técnicas estão sendo preparadas e aparecerão aqui em breve.
      </p>
    );
  }

  return (
    <>
      <div className="prodFerramentasBusca">
        <label className="prodBusca"><span className="srOnly">Buscar fichas</span><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou número…" /></label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoria">
          {categorias.map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="prodFiltro3d"><input type="checkbox" checked={so3d} onChange={(e) => setSo3d(e.target.checked)} /> Com modelo 3D</label>
        <div className="prodDensidade" aria-label="Colunas da galeria">
          {[1, 2, 3].map((n) => <button key={n} type="button" aria-pressed={colunas === n} onClick={() => { setColunas(n); try { localStorage.setItem("fichas-colunas", String(n)); } catch {} }}>{n}</button>)}
        </div>
      </div>
      <div className="prodResultado"><strong>{visiveis.length}</strong> {visiveis.length === 1 ? "ficha encontrada" : "fichas encontradas"}</div>
      <div className={`prodFichasFeed grade${colunas}`}>
      {visiveis.map((ficha) => (
        <Link
          key={ficha.numero}
          className="prodFichaCard"
          href={`/fichas/${ficha.numero}-${ficha.slug}`}
        >
          <div className="prodFichaCapa">
            <Image
              src={ficha.grande}
              alt=""
              fill
              sizes="(max-width: 700px) 100vw, 33vw"
            />
            <span className="prodFichaNum">{ficha.numero}</span>
            {ficha.tem3d && <span className="prodFicha3d">3D</span>}
          </div>
          <span className="prodFichaNome">{ficha.nome}</span>
        </Link>
      ))}
      </div>
      {visiveis.length === 0 && <p className="prodFichasVazio">Nenhuma ficha corresponde aos filtros selecionados.</p>}
    </>
  );
}

function Feed3D({ projetos }: { projetos: Projeto3D[] }) {
  if (projetos.length === 0) {
    return (
      <p className="prodFichasVazio">
        Os modelos 3D estão sendo preparados e aparecerão aqui em breve.
      </p>
    );
  }

  return (
    <div className="prod3dFeed">
      {projetos.map((projeto) =>
        projeto.tem3d ? (
          <Link
            key={projeto.codigo}
            className="prod3dCard"
            href={`/projetos/${projeto.slug}`}
          >
            <CapaProjeto3D projeto={projeto} />
          </Link>
        ) : (
          <div key={projeto.codigo} className="prod3dCard" data-pendente>
            <CapaProjeto3D projeto={projeto} />
          </div>
        )
      )}
    </div>
  );
}

function CapaProjeto3D({ projeto }: { projeto: Projeto3D }) {
  return (
    <>
      <div className="prod3dCapa">
        <Image
          src={projeto.preview}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 33vw"
        />
        {!projeto.tem3d && <span className="prod3dSelo">Em breve em 3D</span>}
      </div>
      <span className="prod3dNome">{projeto.nome}</span>
    </>
  );
}

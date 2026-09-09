import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listaProjetosTecnicos, obterProjetoTecnico } from "@/lib/projetos-tecnicos";
import { ExperienciaTecnica } from "./experiencia-tecnica";

export function criarMetadataProjeto(slug: string): Metadata {
  const projeto = obterProjetoTecnico(slug);
  if (!projeto) return {};
  return {
    title: `${projeto.nome} · Móveis para Gatos`,
    description: `Modelo 3D, medidas sugeridas, peças, montagem e calculadora do projeto ${projeto.codigo}.`,
  };
}

export function PaginaProjeto({ slug }: { slug: string }) {
  const projeto = obterProjetoTecnico(slug);
  if (!projeto) notFound();
  const { largura, altura, profundidade } = projeto.dimensoesGerais;
  const indice = listaProjetosTecnicos.findIndex((item) => item.slug === projeto.slug);
  const anterior = listaProjetosTecnicos[(indice - 1 + listaProjetosTecnicos.length) % listaProjetosTecnicos.length];
  const proximo = listaProjetosTecnicos[(indice + 1) % listaProjetosTecnicos.length];

  return (
    <main className="envolucro tecPagina">
      <header className="pagTopo">
        <Link className="pagVoltar" href="/projetos">
          <span aria-hidden>←</span> Voltar aos projetos
        </Link>
        <div className="projCabecalho">
          <div>
            <span className="projNumero medida">PROJETO {projeto.codigo}</span>
            <h1 className="pagTitulo">{projeto.nome}</h1>
            <p className="pagSub">
              Explore o modelo realista, consulte as medidas sugeridas de cada
              peça, visualize a montagem e estime os custos do seu projeto.
            </p>
          </div>
          <Link className="tecProximoTopo" href={`/projetos/${proximo.slug}`}>
            <span><small>PRÓXIMO PROJETO</small><strong>{proximo.codigo}</strong></span>
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="tecResumoProjeto" aria-label="Resumo do projeto">
          <span><small>MEDIDAS GERAIS SUGERIDAS</small><strong>{largura / 10} × {altura / 10} × {profundidade / 10} cm</strong></span>
          <span><small>DIFICULDADE</small><strong>{projeto.dificuldade}</strong></span>
          <span><small>TEMPO ESTIMADO</small><strong>{projeto.tempoEstimado}</strong></span>
          <span><small>MONTAGEM</small><strong>{projeto.pessoas} {projeto.pessoas === 1 ? "pessoa" : "pessoas"}</strong></span>
        </div>
      </header>

      <ExperienciaTecnica key={projeto.slug} projeto={projeto} />

      <section className="tecSeguranca" aria-labelledby={`seguranca-${projeto.codigo}`}>
        <div>
          <span className="projRotulo">ANTES DE FABRICAR</span>
          <h2 id={`seguranca-${projeto.codigo}`}>Adaptação e segurança</h2>
        </div>
        <ul>
          {projeto.avisosSeguranca.map((aviso) => <li key={aviso}>{aviso}</li>)}
        </ul>
      </section>

      <nav className="tecNavegacaoProjetos" aria-label="Navegação entre projetos">
        <Link className="tecProjetoVizinho" href={`/projetos/${anterior.slug}`}>
          <span className="tecProjetoSeta" aria-hidden>←</span>
          <Image src={anterior.preview} alt="" width={96} height={72} />
          <span><small>PROJETO ANTERIOR · {anterior.codigo}</small><strong>{anterior.nome}</strong></span>
        </Link>
        <Link className="tecTodosProjetos" href="/projetos"><span aria-hidden>⊞</span> Ver todos</Link>
        <Link className="tecProjetoVizinho tecProjetoProximo" href={`/projetos/${proximo.slug}`}>
          <span><small>PRÓXIMO PROJETO · {proximo.codigo}</small><strong>{proximo.nome}</strong></span>
          <Image src={proximo.preview} alt="" width={96} height={72} />
          <span className="tecProjetoSeta" aria-hidden>→</span>
        </Link>
      </nav>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import path from "node:path";
import { requireCustomer } from "@/lib/auth/session";
import { listarFichas } from "@/lib/data/fichas";
import { listaProjetosTecnicos, type DimensoesPeca } from "@/lib/projetos-tecnicos";
import { Visualizador3DFicha } from "./visualizador-3d-ficha";
import "../../inicio.css";

type Params = { slug: string };

function projetoDaFicha(numero: string) {
  return listaProjetosTecnicos.find((p) => p.preview.startsWith(`/modelos/${numero}-`));
}

function dimensoes(d: DimensoesPeca) {
  const partes = [d.comprimento, d.largura, d.espessura].filter(
    (valor): valor is number => typeof valor === "number",
  );
  if (d.diametro && d.comprimento) return `Ø ${d.diametro} × ${d.comprimento} mm`;
  return partes.length ? `${partes.join(" × ")} mm` : "Conferir no projeto";
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const ficha = listarFichas().find((f) => `${f.numero}-${f.slug}` === slug);
  return { title: ficha ? `${ficha.nome} · Projeto visual · Móveis para Gatos` : "Projeto visual · Móveis para Gatos" };
}

export default async function PaginaFicha({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  await requireCustomer();

  const fichas = listarFichas();
  const indice = fichas.findIndex((f) => `${f.numero}-${f.slug}` === slug);
  if (indice === -1) notFound();
  const ficha = fichas[indice];
  const projeto = projetoDaFicha(ficha.numero);
  const anterior = fichas[indice - 1];
  const proxima = fichas[indice + 1];
  const modeloExiste = Boolean(
    projeto && existsSync(path.join(process.cwd(), "public", projeto.modeloVisual.replace(/^\//, ""))),
  );

  return (
    <main className="envolucro fichaPagina">
      <header className="fichaCabecalho">
        <Link className="prodVoltar" href="/produto/acervo-3d-gatos">← Voltar à biblioteca</Link>
        <div className="fichaSobretitulo">PROJETO {ficha.numero} · {ficha.categoria.toUpperCase()}</div>
        <h1 className="pagTitulo">{ficha.nome}</h1>
        <p className="pagSub">Ficha visual, medidas sugeridas e informações organizadas para planejar a construção.</p>
        <div className="fichaChips" aria-label="Informações rápidas">
          <span>{indice + 1} de {fichas.length}</span>
          {projeto?.dificuldade && <span>{projeto.dificuldade}</span>}
          {projeto?.tempoEstimado && <span>{projeto.tempoEstimado}</span>}
          {projeto && <span>{projeto.pessoas} {projeto.pessoas === 1 ? "pessoa" : "pessoas"}</span>}
          {modeloExiste && <span data-destaque>Modelo 3D disponível</span>}
        </div>
      </header>

      <section className="fichaLeitor" aria-labelledby="titulo-ficha-visual">
        <div className="fichaSecaoTitulo">
          <div><span className="fichaRotulo">VISÃO GERAL</span><h2 id="titulo-ficha-visual">Ficha visual do projeto</h2></div>
          <a className="fichaBotaoSecundario" href={ficha.grande} target="_blank" rel="noreferrer">Abrir em tamanho maior</a>
        </div>
        <div className="fichaVisor">
          <Image src={ficha.grande} alt={`Ficha visual: ${ficha.nome}`} width={1500} height={2121} sizes="(max-width: 700px) 100vw, 900px" priority />
        </div>
      </section>

      {projeto && modeloExiste && (
        <section className="fichaBloco fichaBloco3d" aria-labelledby="titulo-modelo-3d">
          <div className="fichaSecaoTitulo">
            <div><span className="fichaRotulo">BÔNUS INTERATIVO</span><h2 id="titulo-modelo-3d">Explore o móvel em 3D</h2></div>
            <p>Gire, aproxime e observe o projeto por diferentes ângulos.</p>
          </div>
          <Visualizador3DFicha src={projeto.modeloVisual} nome={ficha.nome} />
        </section>
      )}

      {projeto ? (
        <>
          <section className="fichaBloco" aria-labelledby="titulo-medidas">
            <div className="fichaSecaoTitulo"><div><span className="fichaRotulo">DIMENSÕES GERAIS</span><h2 id="titulo-medidas">Medidas sugeridas</h2></div></div>
            <div className="fichaMedidas">
              <div><strong>{projeto.dimensoesGerais.largura} mm</strong><span>Largura</span></div>
              <div><strong>{projeto.dimensoesGerais.altura} mm</strong><span>Altura</span></div>
              <div><strong>{projeto.dimensoesGerais.profundidade} mm</strong><span>Profundidade</span></div>
            </div>
            <p className="fichaNota">Medidas sugeridas e adaptáveis ao ambiente e às necessidades de cada gato e tutor.</p>
          </section>

          <section className="fichaBloco" aria-labelledby="titulo-pecas">
            <div className="fichaSecaoTitulo"><div><span className="fichaRotulo">PLANEJAMENTO</span><h2 id="titulo-pecas">Peças e materiais</h2></div><span className="fichaContagem">{projeto.pecas.length} itens</span></div>
            <div className="fichaTabelaWrap"><table className="fichaTabela"><thead><tr><th>Peça</th><th>Qtd.</th><th>Dimensões</th><th>Material</th></tr></thead><tbody>
              {projeto.pecas.map((peca) => <tr key={peca.id}><td><b>{peca.identificador}</b> {peca.nome}</td><td>{peca.quantidade}</td><td>{dimensoes(peca.dimensoes)}</td><td>{peca.material}</td></tr>)}
            </tbody></table></div>
          </section>

          <section className="fichaDuasColunas">
            <div className="fichaBloco"><span className="fichaRotulo">FERRAGENS E CONSUMÍVEIS</span><h2>O que separar</h2><ul className="fichaLista">
              {projeto.ferragens.map((item) => <li key={item.id}><span>{item.nome}</span><strong>{item.quantidade} {item.unidade}</strong></li>)}
              {projeto.pecas.filter((p) => p.grupoCusto !== "madeira").map((p) => <li key={p.id}><span>{p.material}</span><strong>{p.quantidade} un.</strong></li>)}
            </ul></div>
            <div className="fichaBloco"><span className="fichaRotulo">FERRAMENTAS</span><h2>Kit recomendado</h2><div className="fichaTags"><span>Trena</span><span>Esquadro</span><span>Furadeira</span><span>Parafusadeira</span><span>Lixadeira</span><span>EPIs</span></div></div>
          </section>

          <section className="fichaBloco" aria-labelledby="titulo-montagem">
            <div className="fichaSecaoTitulo"><div><span className="fichaRotulo">SEQUÊNCIA SUGERIDA</span><h2 id="titulo-montagem">Montagem passo a passo</h2></div></div>
            <ol className="fichaEtapas">{projeto.montagem.map((etapa) => <li key={etapa.ordem}><span>{etapa.ordem}</span><div><h3>{etapa.titulo}</h3><p>{etapa.descricao}</p>{etapa.pecas.length > 0 && <small>Peças: {etapa.pecas.join(", ")}</small>}</div></li>)}</ol>
          </section>

          {projeto.avisosSeguranca.length > 0 && <section className="fichaBloco fichaCuidados"><span className="fichaRotulo">ANTES DE USAR</span><h2>Cuidados e adaptações</h2><ul>{projeto.avisosSeguranca.map((aviso) => <li key={aviso}>{aviso}</li>)}</ul></section>}
        </>
      ) : (
        <section className="fichaBloco fichaEmPreparacao"><h2>Informações técnicas em preparação</h2><p>A ficha visual está disponível. Os dados detalhados serão publicados somente após a revisão técnica do projeto.</p></section>
      )}

      <section className="fichaDownloads" aria-labelledby="titulo-downloads">
        <div><span className="fichaRotulo">LEVE PARA A OFICINA</span><h2 id="titulo-downloads">Baixe a ficha em alta resolução</h2><p>Arquivo PNG no formato A4, pronto para salvar ou imprimir.</p></div>
        <a className="fichaBaixar" href={ficha.original} download>Baixar ficha A4 em PNG</a>
      </section>

      <nav className="fichaNav" aria-label="Navegar entre fichas">
        {anterior ? <Link href={`/fichas/${anterior.numero}-${anterior.slug}`} className="fichaNavLink">← <span><small>Anterior</small>{anterior.nome}</span></Link> : <span />}
        {proxima && <Link href={`/fichas/${proxima.numero}-${proxima.slug}`} className="fichaNavLink fichaNavLink--prox"><span><small>Próxima</small>{proxima.nome}</span> →</Link>}
      </nav>
    </main>
  );
}

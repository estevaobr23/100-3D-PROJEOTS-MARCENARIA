"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { PecaTecnica, ProjetoTecnico, TabelaPrecos } from "@/lib/projetos-tecnicos";
import { calcularCustos } from "@/lib/projetos-tecnicos";
import { ModeloSegmentadoTecnico } from "./modelo-segmentado";
import { VisualizadorModelo } from "./visualizador-modelo";

type Modo = "visual" | "pecas" | "explodida" | "montagem";
type Unidade = "mm" | "cm";

const PRECOS_INICIAIS: TabelaPrecos = {
  madeiraM2: 0,
  posteMetro: 0,
  sisalMetro: 0,
  tecidoM2: 0,
  ferragemUnidade: 0,
  desperdicio: 0,
  horas: 0,
  valorHora: 0,
  margem: 0,
};

const MODOS: { id: Modo; numero: string; nome: string }[] = [
  { id: "visual", numero: "01", nome: "Visual" },
  { id: "pecas", numero: "02", nome: "Peças" },
  { id: "explodida", numero: "03", nome: "Explodida" },
  { id: "montagem", numero: "04", nome: "Montagem" },
];

function nomeDimensoes(peca: PecaTecnica, unidade: Unidade) {
  if (!peca.dimensoes) return "Aguardando ficha técnica";

  const fator = unidade === "cm" ? 0.1 : 1;
  const sufixo = unidade;
  const valor = (numero: number) => `${(numero * fator).toLocaleString("pt-BR")} ${sufixo}`;
  const itens = [
    peca.dimensoes.comprimento && `C ${valor(peca.dimensoes.comprimento)}`,
    peca.dimensoes.largura && `L ${valor(peca.dimensoes.largura)}`,
    peca.dimensoes.espessura && `E ${valor(peca.dimensoes.espessura)}`,
    peca.dimensoes.diametro && `Ø ${valor(peca.dimensoes.diametro)}`,
  ].filter(Boolean);

  return itens.join(" × ");
}

function linhasDimensoes(peca: PecaTecnica, unidade: Unidade) {
  const fator = unidade === "cm" ? 0.1 : 1;
  const valor = (numero: number) => `${(numero * fator).toLocaleString("pt-BR")} ${unidade}`;
  return [
    { sigla: "C", nome: "Comprimento", valor: peca.dimensoes.comprimento },
    { sigla: "L", nome: "Largura", valor: peca.dimensoes.largura },
    { sigla: "E", nome: "Espessura", valor: peca.dimensoes.espessura },
    { sigla: "Ø", nome: "Diâmetro", valor: peca.dimensoes.diametro },
  ].filter((item): item is { sigla: string; nome: string; valor: number } => typeof item.valor === "number")
    .map((item) => ({ ...item, exibicao: valor(item.valor) }));
}

function moeda(valor: number | null | undefined) {
  return valor === null || valor === undefined
    ? "—"
    : valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CampoCusto({
  id,
  label,
  sufixo,
  valor,
  onChange,
}: {
  id: keyof TabelaPrecos;
  label: string;
  sufixo: string;
  valor: number;
  onChange: (id: keyof TabelaPrecos, valor: number) => void;
}) {
  return (
    <label className="tecCampo" htmlFor={`custo-${id}`}>
      <span>{label}</span>
      <span className="tecCampoEntrada">
        <input
          id={`custo-${id}`}
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={valor}
          onChange={(evento) => onChange(id, Math.max(0, Number(evento.target.value) || 0))}
        />
        <small>{sufixo}</small>
      </span>
    </label>
  );
}

export function ExperienciaTecnica({ projeto }: { projeto: ProjetoTecnico }) {
  const [modo, setModo] = useState<Modo>("visual");
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [ocultas, setOcultas] = useState<Set<string>>(new Set());
  const [isolada, setIsolada] = useState<string | null>(null);
  const [transparentes, setTransparentes] = useState(false);
  const [mostrarIdentificadores, setMostrarIdentificadores] = useState(true);
  const [unidade, setUnidade] = useState<Unidade>("cm");
  const [explosao, setExplosao] = useState(0.62);
  const [etapa, setEtapa] = useState(1);
  const [reiniciarCamera, setReiniciarCamera] = useState(0);
  const [telaCheiaAtiva, setTelaCheiaAtiva] = useState(false);
  const [precos, setPrecos] = useState<TabelaPrecos>(PRECOS_INICIAIS);
  const [custosCarregados, setCustosCarregados] = useState(false);
  const chaveCustos = `projeto-${projeto.codigo.toLowerCase()}-custos-v1`;
  const chaveNotas = `projeto-${projeto.codigo.toLowerCase()}-notas-v1`;
  const [notas, setNotas] = useState("");

  const pecaSelecionada = useMemo(
    () => projeto.pecas.find((peca) => peca.id === selecionada) ?? null,
    [projeto, selecionada],
  );
  const etapaAtual = projeto.montagem.find((item) => item.ordem === etapa);
  const custos = useMemo(() => calcularCustos(projeto, precos), [precos, projeto]);

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(chaveCustos);
      if (salvo) setPrecos({ ...PRECOS_INICIAIS, ...(JSON.parse(salvo) as Partial<TabelaPrecos>) });
      setNotas(window.localStorage.getItem(chaveNotas) ?? "");
    } catch {
      // Armazenamento indisponível: a calculadora continua funcional na sessão.
    } finally {
      setCustosCarregados(true);
    }
  }, [chaveCustos, chaveNotas]);

  useEffect(() => {
    if (!custosCarregados) return;
    try {
      window.localStorage.setItem(chaveCustos, JSON.stringify(precos));
    } catch {
      // Sem persistência, preservamos os valores no estado atual.
    }
  }, [chaveCustos, custosCarregados, precos]);

  useEffect(() => {
    if (!custosCarregados) return;
    try {
      window.localStorage.setItem(chaveNotas, notas);
    } catch {
      // As observações continuam disponíveis durante a sessão.
    }
  }, [chaveNotas, custosCarregados, notas]);

  useEffect(() => {
    if (!telaCheiaAtiva) return;

    document.body.classList.add("tecTelaCheiaAberta");
    const fecharComEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setTelaCheiaAtiva(false);
    };
    window.addEventListener("keydown", fecharComEscape);

    return () => {
      document.body.classList.remove("tecTelaCheiaAberta");
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [telaCheiaAtiva]);

  function trocarModo(novoModo: Modo) {
    setModo(novoModo);
    setSelecionada(null);
    setIsolada(null);
    setTransparentes(false);
  }

  function restaurarPecas() {
    setOcultas(new Set());
    setIsolada(null);
    setTransparentes(false);
  }

  function ocultarSelecionada() {
    if (!selecionada) return;
    setOcultas((atuais) => new Set([...atuais, selecionada]));
    setSelecionada(null);
    setIsolada(null);
  }

  function atualizarPreco(id: keyof TabelaPrecos, valor: number) {
    setPrecos((atuais) => ({ ...atuais, [id]: valor }));
  }

  function abrirPeca(id: string) {
    setModo("pecas");
    setSelecionada(id);
    setIsolada(null);
    setTransparentes(false);
    window.requestAnimationFrame(() => {
      document.querySelector(".tecArea")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function telaCheia() {
    setTelaCheiaAtiva((ativa) => !ativa);
  }

  function exportarLista() {
    const linhas = [
      ["Identificação", "Código", "Peça", "Quantidade", "Material", "Dimensões sugeridas (cm)"],
      ...projeto.pecas.map((peca) => [peca.identificador, peca.codigo, peca.nome, String(peca.quantidade), peca.material, nomeDimensoes(peca, "cm")]),
    ];
    const csv = linhas.map((linha) => linha.map((valor) => `"${valor.replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${projeto.codigo}-${projeto.slug}-lista-de-corte.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="tecExperiencia">
      <nav className="tecModos" aria-label="Modos de visualização">
        {MODOS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={modo === item.id ? "tecModo tecModoAtivo" : "tecModo"}
            aria-pressed={modo === item.id}
            onClick={() => trocarModo(item.id)}
          >
            <small>{item.numero}</small>
            <span>{item.nome}</span>
          </button>
        ))}
      </nav>

      <section
        className="tecArea"
        data-tela-cheia={telaCheiaAtiva || undefined}
        aria-label="Visualizador técnico do projeto"
      >
        <div className="tecPalco">
          <div className="tecBarra">
            <div className="tecStatus">
              <span className={modo === "visual" ? "tecPonto tecPontoVisual" : "tecPonto"} />
              {modo === "visual" ? "Modelo realista" : "Modelo original segmentado"}
            </div>
            <div className="tecAcoes">
              {modo !== "visual" && (
                <>
                  <button type="button" aria-pressed={mostrarIdentificadores} onClick={() => setMostrarIdentificadores((valor) => !valor)}>
                    {mostrarIdentificadores ? "Ocultar identificadores" : "Mostrar identificadores"}
                  </button>
                  <button type="button" onClick={restaurarPecas} disabled={!ocultas.size && !isolada && !transparentes}>
                    Restaurar peças
                  </button>
                </>
              )}
              <button type="button" onClick={() => setReiniciarCamera((valor) => valor + 1)}>
                Resetar câmera
              </button>
              <button type="button" aria-pressed={telaCheiaAtiva} onClick={telaCheia}>
                {telaCheiaAtiva ? "Sair da tela cheia" : "Tela cheia"}
              </button>
            </div>
          </div>

          <div className="tecViewport">
            {modo === "visual" ? (
              <VisualizadorModelo
                src={projeto.modeloVisual}
                rotulo="Arraste para girar · role ou use pinça para aproximar"
                reiniciar={reiniciarCamera}
              />
            ) : (
              <figure className="tecCanvas" aria-label={`Modelo original segmentado do Projeto ${projeto.codigo}`}>
                <Canvas
                  shadows
                  camera={{ fov: 35, position: [3.3, 2.8, 4.5] }}
                  dpr={[1, 1.5]}
                  gl={{ antialias: true, alpha: true }}
                  onCreated={({ raycaster }) => { raycaster.firstHitOnly = true; }}
                  onPointerMissed={() => setSelecionada(null)}
                >
                  <Suspense fallback={null}>
                    <ModeloSegmentadoTecnico
                      projeto={projeto}
                      modo={modo}
                      explosao={explosao}
                      etapa={etapa}
                      selecionada={selecionada}
                      ocultas={ocultas}
                      isolada={isolada}
                      transparentes={transparentes}
                      mostrarIdentificadores={mostrarIdentificadores}
                      reiniciarCamera={reiniciarCamera}
                      onSelecionar={setSelecionada}
                    />
                  </Suspense>
                </Canvas>
                <figcaption className="vis039Legenda">
                  Selecione uma letra ou clique diretamente na peça
                </figcaption>
              </figure>
            )}
          </div>

          {modo === "explodida" && (
            <label className="tecControleFaixa">
              <span>Separação das peças</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(explosao * 100)}
                onChange={(evento) => setExplosao(Number(evento.target.value) / 100)}
              />
              <strong>{Math.round(explosao * 100)}%</strong>
            </label>
          )}

          {modo === "montagem" && (
            <div className="tecMontagemControle">
              <div>
                <small>ETAPA {etapa} DE {projeto.montagem.length}</small>
                <strong>{etapaAtual?.titulo}</strong>
                <span>{etapaAtual?.descricao}</span>
              </div>
              <div className="tecMontagemBotoes">
                <button type="button" disabled={etapa === 1} onClick={() => setEtapa((valor) => Math.max(1, valor - 1))}>Anterior</button>
                <button type="button" disabled={etapa === projeto.montagem.length} onClick={() => setEtapa((valor) => Math.min(projeto.montagem.length, valor + 1))}>Próxima</button>
              </div>
            </div>
          )}
        </div>

        <aside className="tecInspetor" aria-live="polite">
          {modo === "visual" ? (
            <div className="tecVazio">
              <span className="tecIcone">3D</span>
              <h2>Modelo de apresentação</h2>
              <p>Use este modo para conferir aparência e acabamento. Para selecionar componentes, abra o modo Peças.</p>
              <button type="button" className="tecPrimario" onClick={() => trocarModo("pecas")}>Abrir modo Peças</button>
            </div>
          ) : pecaSelecionada ? (
            <div className="tecFichaPeca">
              <div className="tecFichaTopo">
                <div className="tecFichaIdentificacao">
                  <span>{pecaSelecionada.identificador}</span>
                  <small>{pecaSelecionada.codigo}</small>
                </div>
                <button type="button" aria-label="Fechar seleção" onClick={() => setSelecionada(null)}>×</button>
              </div>
              <h2>{pecaSelecionada.nome}</h2>
              <dl className="tecDados">
                <div><dt>Quantidade</dt><dd>{pecaSelecionada.quantidade} un.</dd></div>
                <div><dt>Material</dt><dd>{pecaSelecionada.material}</dd></div>
                <div><dt>Acabamento</dt><dd>{pecaSelecionada.acabamento}</dd></div>
                <div><dt>Montagem</dt><dd>Etapa {pecaSelecionada.etapaMontagem}</dd></div>
              </dl>
              <div className="tecDimensoes">
                <div className="tecDimensoesTopo">
                  <strong>Dimensões</strong>
                  <div className="tecUnidades" aria-label="Unidade de medida">
                    <button type="button" aria-pressed={unidade === "mm"} onClick={() => setUnidade("mm")}>mm</button>
                    <button type="button" aria-pressed={unidade === "cm"} onClick={() => setUnidade("cm")}>cm</button>
                  </div>
                </div>
                <p className="tecMedidaSugerida">Medidas sugeridas para este modelo. Adapte ao ambiente, ao material e ao porte do gato antes da fabricação.</p>
                <div className="tecMedidasGrade">
                  {linhasDimensoes(pecaSelecionada, unidade).map((medida) => (
                    <div className="tecMedidaItem" key={medida.sigla}>
                      <span>{medida.sigla}</span>
                      <small>{medida.nome}</small>
                      <strong>{medida.exibicao}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="tecCustoPeca">
                <span>Custo desta peça</span>
                <strong>{custos.porPeca[pecaSelecionada.id] === null ? "—" : custos.porPeca[pecaSelecionada.id]?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
                <small>Estimativa baseada nas medidas sugeridas e nos preços informados.</small>
              </div>
              <div className="tecAcoesPeca">
                <button type="button" aria-pressed={isolada === pecaSelecionada.id} onClick={() => setIsolada((atual) => atual === pecaSelecionada.id ? null : pecaSelecionada.id)}>
                  {isolada === pecaSelecionada.id ? "Remover isolamento" : "Isolar peça"}
                </button>
                <button type="button" onClick={ocultarSelecionada}>Ocultar</button>
                <button type="button" aria-pressed={transparentes} onClick={() => setTransparentes((valor) => !valor)}>Demais transparentes</button>
              </div>
            </div>
          ) : (
            <div className="tecVazio">
              <span className="tecIcone">+</span>
              <h2>Selecione uma peça</h2>
              <p>Clique em uma letra no modelo, diretamente no componente ou escolha uma peça na legenda.</p>
              <ul>
                {projeto.pecas.map((peca) => (
                  <li key={peca.id}>
                    <button type="button" onClick={() => setSelecionada(peca.id)}>
                      <span className="tecListaLetra">{peca.identificador}</span><strong>{peca.nome}</strong>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <div className="tecAviso" role="note">
        <strong>Medidas adaptáveis.</strong>
        <span>As dimensões são sugestões proporcionais ao modelo. Ajuste conforme espaço disponível, porte e quantidade de gatos, material escolhido e sistema de fixação. Antes de fabricar, confirme estabilidade e resistência com um profissional.</span>
      </div>

      <section className="tecGradeInferior">
        <article className="tecCartao tecCalculadora">
          <header className="tecCartaoTopo">
            <div><span className="projRotulo">ORÇAMENTO INTERATIVO</span><h2>Calculadora de custos</h2><p>Preencha os valores praticados na sua região.</p></div>
            <span className="tecSalvo">Salvo neste navegador</span>
          </header>
          <div className="tecOrcamentoDestaque">
            <span className="tecOrcamentoIcone">R$</span>
            <div><small>PREÇO SUGERIDO</small><strong>{custos.disponivel ? moeda(custos.precoSugerido) : "Preencha os valores"}</strong></div>
            <span className="tecOrcamentoStatus">Atualização automática</span>
          </div>
          <div className="tecResumoCustos" aria-label="Resumo do orçamento">
            <div><span>Materiais</span><strong>{moeda(custos.materiais)}</strong></div>
            <div><span>Mão de obra</span><strong>{moeda(custos.maoDeObra)}</strong></div>
            <div><span>Desperdício</span><strong>{moeda(custos.desperdicio)}</strong></div>
          </div>
          <div className="tecCustoSecoes">
            <fieldset className="tecCustoGrupo">
              <legend><span>01</span> Materiais</legend>
              <div className="tecCampos">
                <CampoCusto id="madeiraM2" label="Madeira" sufixo="R$/m²" valor={precos.madeiraM2} onChange={atualizarPreco} />
                <CampoCusto id="posteMetro" label="Sarrafo ou poste" sufixo="R$/m" valor={precos.posteMetro} onChange={atualizarPreco} />
                <CampoCusto id="sisalMetro" label="Sisal" sufixo="R$/m" valor={precos.sisalMetro} onChange={atualizarPreco} />
                <CampoCusto id="tecidoM2" label="Tecido" sufixo="R$/m²" valor={precos.tecidoM2} onChange={atualizarPreco} />
                <CampoCusto id="ferragemUnidade" label="Ferragens" sufixo="R$/un" valor={precos.ferragemUnidade} onChange={atualizarPreco} />
                <CampoCusto id="desperdicio" label="Desperdício" sufixo="%" valor={precos.desperdicio} onChange={atualizarPreco} />
              </div>
            </fieldset>
            <fieldset className="tecCustoGrupo">
              <legend><span>02</span> Produção e margem</legend>
              <div className="tecCampos tecCamposProducao">
                <CampoCusto id="horas" label="Tempo de produção" sufixo="horas" valor={precos.horas} onChange={atualizarPreco} />
                <CampoCusto id="valorHora" label="Valor da hora" sufixo="R$/h" valor={precos.valorHora} onChange={atualizarPreco} />
                <CampoCusto id="margem" label="Margem desejada" sufixo="%" valor={precos.margem} onChange={atualizarPreco} />
              </div>
            </fieldset>
          </div>
          <div className="tecComposicao">
            <div className="tecComposicaoTopo"><strong>Composição estimada</strong><span>Custo total {moeda(custos.total)}</span></div>
            <ul>
              <li><span><i className="tecCor tecCorMadeira" />Madeira</span><strong>{moeda(custos.porGrupo.madeira)}</strong></li>
              <li><span><i className="tecCor tecCorSisal" />Sisal</span><strong>{moeda(custos.porGrupo.sisal)}</strong></li>
              <li><span><i className="tecCor tecCorTecido" />Tecido</span><strong>{moeda(custos.porGrupo.tecido)}</strong></li>
              <li><span><i className="tecCor tecCorFerragem" />Ferragens</span><strong>{moeda(custos.ferragens)}</strong></li>
            </ul>
          </div>
        </article>

        <article className="tecCartao tecMateriais">
          <header className="tecCartaoTopo">
            <div><span className="projRotulo">PEÇAS DO PROJETO {projeto.codigo}</span><h2>Lista de materiais</h2><p>Selecione uma peça para encontrá-la no modelo 3D.</p></div>
            <span className="tecContagem">{projeto.pecas.length} peças</span>
          </header>
          <div className="tecMateriaisGrade">
            {projeto.pecas.map((peca) => (
              <article className="tecMaterialCard" key={peca.id}>
                <header>
                  <span className="tecMaterialLetra">{peca.identificador}</span>
                  <div><small>{peca.codigo}</small><h3>{peca.nome}</h3></div>
                  <span className="tecMaterialQtd">{peca.quantidade} un.</span>
                </header>
                <p>{peca.material}</p>
                <div className="tecMaterialMedida"><span>Dimensões sugeridas</span><strong>{nomeDimensoes(peca, "cm")}</strong></div>
                <footer>
                  <span><small>Custo estimado</small><strong>{moeda(custos.porPeca[peca.id])}</strong></span>
                  <button type="button" onClick={() => abrirPeca(peca.id)}>Ver no 3D <span aria-hidden>↗</span></button>
                </footer>
              </article>
            ))}
          </div>
          <div className="tecFerragens">
            <h3>Ferragens sugeridas</h3>
            <ul>
              {projeto.ferragens.map((item) => (
                <li key={item.id}><span>{item.nome}</span><strong>{item.quantidade} {item.unidade}</strong></li>
              ))}
            </ul>
          </div>
          <div className="tecMontagemLista">
            <h3>Sequência preliminar</h3>
            <ol>
              {projeto.montagem.map((item) => (
                <li key={item.ordem}><span>{item.ordem}</span><div><strong>{item.titulo}</strong><small>{item.descricao}</small></div></li>
              ))}
            </ol>
          </div>
          <div className="tecFerramentasFicha">
            <button type="button" onClick={exportarLista}>Exportar lista em CSV</button>
            <button type="button" onClick={() => window.print()}>Imprimir ficha</button>
          </div>
          <label className="tecNotas">
            <span>Observações pessoais</span>
            <textarea value={notas} onChange={(evento) => setNotas(evento.target.value)} placeholder="Anote adaptações, materiais e medidas do seu ambiente…" />
            <small>Salvo somente neste navegador.</small>
          </label>
        </article>
      </section>
    </div>
  );
}

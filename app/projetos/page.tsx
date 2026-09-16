import Image from "next/image";
import Link from "next/link";

const CAPAS = {
  "039": "/modelos/001-arvore-compacta-de-2-niveis/preview.png",
  "040": "/modelos/002-arvore-media-de-3-niveis/preview.png",
  "041": "/modelos/003-torre-alta-vertical/preview.png",
  "031": "/modelos/011-painel-arranhador-de-parede/preview.png",
  "032": "/modelos/012-painel-arranhador-de-canto/preview.png",
  "033": "/modelos/013-poste-arranhador-de-chao/preview.png",
  "034": "/modelos/014-poste-arranhador-com-plataforma/preview.png",
  "035": "/modelos/015-arranhador-cunha/preview.png",
  "036": "/modelos/016-arranhador-banco/preview.png",
  NA1: "/modelos/021-nicho-aberto-de-parede/preview.png",
  NA2: "/modelos/022-nicho-aberto-de-canto/preview.png",
  "013": "/modelos/023-nicho-tunel-retangular/preview.png",
  "015": "/modelos/024-nicho-tunel-com-entrada-em-angulo/preview.png",
  E4: "/modelos/025-nicho-tunel-com-saida-no-topo/preview.png",
  "022": "/modelos/031-casinha-suspensa-com-telhado-de-dois-planos/preview.png",
  G1: "/modelos/037-prateleira-de-descanso-simples/preview.png",
  G2: "/modelos/038-prateleira-de-descanso-com-borda/preview.png",
  G3: "/modelos/039-mirante-de-janela/preview.png",
  C1: "/modelos/064-poste-de-ligacao-entre-dois-niveis/preview.png",
  D1: "/modelos/065-painel-modular-de-escalada-com-apoios/preview.png",
  A1: "/modelos/051-degraus-escalonados-de-parede/preview.png",
  A2: "/modelos/052-escada-de-canto/preview.png",
  A3: "/modelos/053-escada-em-zigue-zague-de-parede/preview.png",
  A4: "/modelos/054-passarela-reta/preview.png",
  A5: "/modelos/055-passarela-com-recorte-reto/preview.png",
  A6: "/modelos/056-rampa-de-acesso/preview.png",
  B1: "/modelos/059-ponte-suspensa-de-ripas-com-corda/preview.png",
  B2: "/modelos/060-ponte-flexivel-de-tecido-reforcado/preview.png",
  H1: "/modelos/045-rede-suspensa-de-parede/preview.png",
  H2: "/modelos/046-cama-suspensa-em-tecido-tenso/preview.png",
  H3: "/modelos/047-cama-concha-com-laterais-retas/preview.png",
  L1: "/modelos/068-comedouro-elevado-simples/preview.png",
  L2: "/modelos/069-comedouro-elevado-duplo/preview.png",
  L4: "/modelos/070-estacao-compacta-com-armazenamento/preview.png",
  J1: "/modelos/076-protetor-de-canto-de-sofa-em-sisal/preview.png",
  PLAY1: "/modelos/080-circuito-de-parede-simples/preview.png",
  PLAY2: "/modelos/081-circuito-com-nicho/preview.png",
  PLAY3: "/modelos/082-circuito-vertical-de-canto/preview.png",
  PLAY4: "/modelos/083-circuito-arranhador/preview.png",
  PLAY5: "/modelos/084-playground-familia/preview.png",
} as const;

function CapaProjeto({ codigo }: { codigo: keyof typeof CAPAS }) {
  return (
    <Image
      className="iniMiniImagem"
      src={CAPAS[codigo]}
      alt=""
      fill
      sizes="(max-width: 700px) 100vw, 232px"
    />
  );
}

export const metadata = { title: "Projetos · Móveis para Gatos" };

export default function Projetos() {
  return (
    <main className="envolucro">
      <div className="pagTopo">
        <h1 className="pagTitulo">Projetos</h1>
        <p className="pagSub">
          Escolha um móvel para explorar o modelo 3D, as peças, as medidas
          sugeridas, a montagem e a calculadora de custos.
        </p>
      </div>

      <section className="iniSecao" aria-labelledby="piloto-titulo">
        <div className="iniSecaoTopo">
          <h2 id="piloto-titulo" className="iniSecaoTitulo">Projeto em destaque</h2>
          <span className="iniSecaoConta">1 projeto</span>
        </div>
        <p className="iniSecaoDescricao">
          Um projeto compacto para começar e conhecer todas as ferramentas da área.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="039" />
              <span className="iniNum">039</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Árvore Compacta de 2 Níveis</span>
              <span className="iniFuncao">Poste com sisal e duas plataformas de descanso</span>
              <p className="iniDescricao">
                Projeto compacto com geometria reta e clara: base, poste vertical
                e duas plataformas de descanso em alturas diferentes.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">60 × 90 × 50 cm</span>
                <span className="iniFamilia">Torres simples</span>
              </div>
              <Link
                className="iniAbrirProjeto"
                href="/projetos/arvore-compacta-2-niveis"
              >
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="catalogo-titulo">
        <div className="iniSecaoTopo">
          <h2 id="catalogo-titulo" className="iniSecaoTitulo">Torres simples</h2>
          <span className="iniSecaoConta">2 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Mesma família do piloto: poste central em sisal e plataformas em pilha reta,
          variando altura e contagem de níveis.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="040" />
              <span className="iniNum">040</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Árvore Média de 3 Níveis</span>
              <span className="iniFuncao">Poste com sisal e três plataformas próximas</span>
              <p className="iniDescricao">
                Variação de contagem da Árvore Compacta: um nível a mais, três plataformas
                em proporção média numa pilha reta. Sem circuito, curvas orgânicas ou nichos.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">65 × 125 × 55 cm</span>
                <span className="iniFamilia">Torres simples</span>
              </div>
              <Link
                className="iniAbrirProjeto"
                href="/projetos/arvore-media-3-niveis"
              >
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="041" />
              <span className="iniNum">041</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Torre Alta Vertical</span>
              <span className="iniFuncao">Poste alto com sisal e três plataformas empilhadas</span>
              <p className="iniDescricao">
                Variação de altura da Árvore Compacta: mesmo poste central revestido em
                sisal, três plataformas em níveis diferentes numa pilha reta. Sem circuito,
                curvas orgânicas ou nichos.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">70 × 170 × 60 cm</span>
                <span className="iniFamilia">Torres simples</span>
              </div>
              <Link
                className="iniAbrirProjeto"
                href="/projetos/torre-alta-vertical"
              >
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="arranhadores-titulo">
        <div className="iniSecaoTopo">
          <h2 id="arranhadores-titulo" className="iniSecaoTitulo">Arranhadores retos</h2>
          <span className="iniSecaoConta">6 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Painéis, postes e rampas de sisal, todos em forma reta ou ângulo fixo.
          O sisal aparece no visual mas é sempre comprado à parte — a madeira é o
          que entra em plano de corte.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="031" />
              <span className="iniNum">031</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Painel Arranhador de Parede</span>
              <span className="iniFuncao">Chapa vertical revestida de sisal na frente</span>
              <p className="iniDescricao">
                O mais simples: uma chapa retangular fixa na parede, face da frente
                inteira de sisal, traseira plana, furos de parafuso nos cantos.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">30 × 70 × 4 cm</span>
                <span className="iniFamilia">Arranhadores retos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/painel-arranhador-parede">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="032" />
              <span className="iniNum">032</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Painel Arranhador de Canto (90°)</span>
              <span className="iniFuncao">Duas chapas em L para a quina de duas paredes</span>
              <p className="iniDescricao">
                Duas chapas iguais unidas a 90°, faces internas de sisal, faces
                externas planas encostando nas paredes.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">42 × 70 × 22 cm</span>
                <span className="iniFamilia">Arranhadores retos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/painel-arranhador-canto">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="033" />
              <span className="iniNum">033</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Poste Arranhador de Chão</span>
              <span className="iniFuncao">Poste vertical de sisal sobre base quadrada</span>
              <p className="iniDescricao">
                Poste livre revestido de sisal do chão ao topo, base quadrada para
                estabilidade, tampa redonda de madeira na ponta.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">45 × 75 × 45 cm</span>
                <span className="iniFamilia">Arranhadores retos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/poste-arranhador-chao">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="034" />
              <span className="iniNum">034</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Poste Arranhador com Plataforma</span>
              <span className="iniFuncao">O poste de chão com uma plataforma no topo</span>
              <p className="iniDescricao">
                Mesmo poste de sisal, com uma plataforma quadrada no topo para o
                gato deitar depois de subir.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">50 × 90 × 50 cm</span>
                <span className="iniFamilia">Arranhadores retos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/poste-arranhador-plataforma">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="035" />
              <span className="iniNum">035</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Arranhador Inclinado tipo Cunha</span>
              <span className="iniFuncao">Rampa triangular de sisal em ângulo fixo</span>
              <p className="iniDescricao">
                Cunha triangular apoiada no chão, face de cima inclinada e revestida
                de sisal, laterais e traseira em madeira.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">35 × 25 × 65 cm</span>
                <span className="iniFamilia">Arranhadores retos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/arranhador-cunha">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="036" />
              <span className="iniNum">036</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Arranhador Horizontal tipo Banco</span>
              <span className="iniFuncao">Banco baixo com tampo de sisal para arranhar deitado</span>
              <p className="iniDescricao">
                Banco baixo e comprido, tampo inteiro de sisal, duas laterais de
                madeira até o chão fazendo os pés.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">65 × 25 × 32 cm</span>
                <span className="iniFamilia">Arranhadores retos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/arranhador-banco">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="nichos-abertos-titulo">
        <div className="iniSecaoTopo">
          <h2 id="nichos-abertos-titulo" className="iniSecaoTitulo">Nichos abertos e mirantes</h2>
          <span className="iniSecaoConta">2 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          O estilo de nicho mais usado na coleção: aberto na frente e nas duas
          laterais para o gato observar em todas as direções. Só o fundo e o
          piso são fechados, e o teto tem um furo de passagem.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="NA1" />
              <span className="iniNum">NA1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Nicho Aberto de Parede</span>
              <span className="iniFuncao">Frente e duas laterais abertas, furo no teto</span>
              <p className="iniDescricao">
                O modelo-base da família. Fundo e piso fechados, teto com furo de
                passagem, três lados abertos sustentados por montantes de canto.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">52 × 45 × 40 cm</span>
                <span className="iniFamilia">Nichos abertos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/nicho-aberto-parede">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="NA2" />
              <span className="iniNum">NA2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Nicho Aberto de Canto</span>
              <span className="iniFuncao">Duas faces na quina, frente e um lado abertos</span>
              <p className="iniDescricao">
                Versão para o encontro de duas paredes: fundo e uma lateral
                fechados encostam na quina, a frente e o lado externo ficam abertos.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">50 × 45 × 40 cm</span>
                <span className="iniFamilia">Nichos abertos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/nicho-aberto-canto">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="nichos-titulo">
        <div className="iniSecaoTopo">
          <h2 id="nichos-titulo" className="iniSecaoTitulo">Nichos e abrigos</h2>
          <span className="iniSecaoConta">4 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Caixas-túnel e abrigo com telhado. Regra da família: a entrada nunca
          fica na frente — o gato entra por uma lateral e sai pela lateral
          oposta ou pelo topo.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="013" />
              <span className="iniNum">013</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Nicho Túnel Retangular</span>
              <span className="iniFuncao">Caixa-túnel com passagem lateral de lado a lado</span>
              <p className="iniDescricao">
                Caixa fechada com um furo de passagem numa lateral e outro na
                lateral oposta. Frente e traseira sólidas. É o módulo-base da família.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">60 × 40 × 40 cm</span>
                <span className="iniFamilia">Nichos e abrigos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/nicho-tunel-retangular">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="015" />
              <span className="iniNum">015</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Nicho Túnel com Entrada em Ângulo</span>
              <span className="iniFuncao">Aberturas desalinhadas, caminho interno diagonal</span>
              <p className="iniDescricao">
                Variação do nicho-túnel: furo baixo e à frente numa lateral, furo
                mais alto e ao fundo na outra. A frente continua fechada.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">60 × 45 × 45 cm</span>
                <span className="iniFamilia">Nichos e abrigos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/nicho-tunel-entrada-angulo">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="E4" />
              <span className="iniNum">E4</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Nicho Túnel com Saída no Topo</span>
              <span className="iniFuncao">Entra pela lateral, sai por furo no telhado</span>
              <p className="iniDescricao">
                Módulo novo da família: entrada numa lateral e saída num furo do
                painel de cima. Frente, traseira e a outra lateral fechadas.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">55 × 50 × 45 cm</span>
                <span className="iniFamilia">Nichos e abrigos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/nicho-tunel-saida-topo">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="022" />
              <span className="iniNum">022</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Casinha Suspensa com Telhado de Dois Planos</span>
              <span className="iniFuncao">Abrigo de telhado em duas águas, entrada lateral</span>
              <p className="iniDescricao">
                Corpo de caixa com telhado de dois planos retos. Entrada redonda
                numa lateral, empena da frente fechada, traseira lisa para parede.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">60 × 65 × 45 cm</span>
                <span className="iniFamilia">Nichos e abrigos</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/casinha-suspensa-telhado">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="plataformas-titulo">
        <div className="iniSecaoTopo">
          <h2 id="plataformas-titulo" className="iniSecaoTitulo">Plataformas de descanso</h2>
          <span className="iniSecaoConta">3 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Superfícies horizontais fixadas na parede por mãos-francesas, no
          tamanho de um gato deitado: da prateleira nua ao mirante largo de
          janela, passando pela versão com borda de contenção.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="G1" />
              <span className="iniNum">G1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Prateleira de Descanso Simples</span>
              <span className="iniFuncao">Tábua horizontal sobre duas mãos-francesas</span>
              <p className="iniDescricao">
                O ponto de descanso mais elementar: uma tábua retangular na
                parede, superfície livre, sem borda, sem sisal, sem almofada.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">50 × 16 × 35 cm</span>
                <span className="iniFamilia">Plataformas de descanso</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/plataforma-descanso-simples">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="G2" />
              <span className="iniNum">G2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Prateleira de Descanso com Borda</span>
              <span className="iniFuncao">Mesma prateleira com contenção em três lados</span>
              <p className="iniDescricao">
                Borda baixa no fundo e nas duas laterais para o gato se apoiar; a
                frente fica aberta como entrada baixa.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">55 × 18 × 40 cm</span>
                <span className="iniFamilia">Plataformas de descanso</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/plataforma-descanso-borda">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="G3" />
              <span className="iniNum">G3</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Mirante de Janela</span>
              <span className="iniFuncao">Plataforma larga na cota de um parapeito</span>
              <p className="iniDescricao">
                Larga e funda para o gato deitar esticado e observar a rua. Borda
                baixa no fundo e nas laterais, frente aberta, suportes reforçados.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">65 × 18 × 30 cm</span>
                <span className="iniFamilia">Plataformas de descanso</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/mirante-de-janela">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="subida-vertical-titulo">
        <div className="iniSecaoTopo">
          <h2 id="subida-vertical-titulo" className="iniSecaoTitulo">Subida vertical e escalada</h2>
          <span className="iniSecaoConta">2 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Dois jeitos de ganhar altura entre um nível e outro: o poste de sisal
          entre duas plataformas e o painel de parede com blocos de apoio
          escalonados.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="C1" />
              <span className="iniNum">C1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Poste de Ligação entre Dois Níveis</span>
              <span className="iniFuncao">Poste de sisal entre duas plataformas quadradas</span>
              <p className="iniDescricao">
                Cilindro vertical revestido de sisal ligando uma plataforma
                embaixo e uma em cima. A subida vertical mais direta da coleção.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">35 × 90 × 35 cm</span>
                <span className="iniFamilia">Subida vertical</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/poste-ligacao-dois-niveis">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="D1" />
              <span className="iniNum">D1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Painel Modular de Escalada com Apoios</span>
              <span className="iniFuncao">Chapa vertical com seis blocos escalonados</span>
              <p className="iniDescricao">
                Painel de parede com seis blocos de apoio em grade de três linhas
                e duas colunas, escalonados para subida em zigue-zague.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">80 × 100 × 30 cm</span>
                <span className="iniFamilia">Subida vertical</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/painel-modular-escalada">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="subida-parede-titulo">
        <div className="iniSecaoTopo">
          <h2 id="subida-parede-titulo" className="iniSecaoTitulo">Subida e passagem de parede</h2>
          <span className="iniSecaoConta">6 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Módulos para ganhar altura e atravessar a parede: degraus retos, escada
          de canto, escada em zigue-zague, passarela reta, passarela com desvio
          anguloso e rampa suave para o gato idoso.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="A1" />
              <span className="iniNum">A1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Degraus Escalonados de Parede</span>
              <span className="iniFuncao">Quatro degraus retos subindo em linha</span>
              <p className="iniDescricao">
                Degraus iguais presos à parede, cada um mais alto e recuado que o
                anterior, com uma mão-francesa sob cada degrau.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">90 × 70 × 32 cm</span>
                <span className="iniFamilia">Subida de parede</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/degraus-escalonados-parede">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="A2" />
              <span className="iniNum">A2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Escada de Canto</span>
              <span className="iniFuncao">Cinco degraus com virada de 90° na quina</span>
              <p className="iniDescricao">
                Degraus que sobem e viram uma vez em ângulo reto no encontro de
                duas paredes, com um degrau de canto maior como patamar.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">70 × 90 × 35 cm</span>
                <span className="iniFamilia">Subida de parede</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/escada-canto">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="A3" />
              <span className="iniNum">A3</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Escada em Zigue-Zague de Parede</span>
              <span className="iniFuncao">Degraus alternando esquerda e direita ao subir</span>
              <p className="iniDescricao">
                Degraus na mesma parede que trocam de lado a cada nível, para o
                gato subir saltando na diagonal de um ao outro.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">50 × 110 × 32 cm</span>
                <span className="iniFamilia">Subida de parede</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/escada-zigue-zague">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="A4" />
              <span className="iniNum">A4</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Passarela Reta</span>
              <span className="iniFuncao">Prancha longa contínua sobre três apoios</span>
              <p className="iniDescricao">
                Um corredor suspenso de uma peça só, sem dobra nem recorte,
                apoiado em três mãos-francesas. A travessia mais simples.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">90 × 18 × 30 cm</span>
                <span className="iniFamilia">Subida de parede</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/passarela-reta">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="A5" />
              <span className="iniNum">A5</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Passarela com Recorte Reto</span>
              <span className="iniFuncao">Passarela com um desvio anguloso, sem curva</span>
              <p className="iniDescricao">
                Dois trechos retos de mesma largura que se encontram num único
                desvio de arestas retas — nunca uma curva suave.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">90 × 22 × 30 cm</span>
                <span className="iniFamilia">Subida de parede</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/passarela-recorte-reto">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="A6" />
              <span className="iniNum">A6</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Rampa de Acesso</span>
              <span className="iniFuncao">Plano inclinado reto com ripas antiderrapantes</span>
              <p className="iniDescricao">
                Inclinação suave e contínua, com ripas travessas ao longo de toda
                a superfície, para o gato idoso subir sem precisar saltar.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">35 × 55 × 90 cm</span>
                <span className="iniFamilia">Subida de parede</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/rampa-acesso-idoso">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="pontes-titulo">
        <div className="iniSecaoTopo">
          <h2 id="pontes-titulo" className="iniSecaoTitulo">Pontes e travessias flexíveis</h2>
          <span className="iniSecaoConta">2 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Travessias que cedem sob a pata: a ponte de ripas de madeira unidas por
          corda e a ponte de faixa de tecido tensa entre duas molduras.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="B1" />
              <span className="iniNum">B1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Ponte Suspensa de Ripas com Corda</span>
              <span className="iniFuncao">Ripas de madeira transversais unidas por corda</span>
              <p className="iniDescricao">
                Várias ripas iguais e espaçadas, costuradas por duas cordas
                laterais, penduradas com uma leve barriga no meio.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">100 × 18 × 30 cm</span>
                <span className="iniFamilia">Pontes</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/ponte-ripas-corda">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="B2" />
              <span className="iniNum">B2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Ponte Flexível de Tecido Reforçado</span>
              <span className="iniFuncao">Faixa de lona tensa entre duas molduras</span>
              <p className="iniDescricao">
                Uma faixa larga de tecido reforçado esticada entre duas molduras
                de madeira, como uma passarela de rede tensa.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">100 × 15 × 35 cm</span>
                <span className="iniFamilia">Pontes</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/ponte-tecido-reforcado">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="descanso-tecido-titulo">
        <div className="iniSecaoTopo">
          <h2 id="descanso-tecido-titulo" className="iniSecaoTitulo">Descanso em tecido</h2>
          <span className="iniSecaoConta">3 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Camas de parede com fundo de tecido: a rede rasa que embala, a cama de
          lona tensa quase plana e o berço facetado de laterais retas com
          almofada.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="H1" />
              <span className="iniNum">H1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Rede Suspensa de Parede</span>
              <span className="iniFuncao">Faixa de tecido em rede rasa entre dois braços</span>
              <p className="iniDescricao">
                Tecido pendurado entre dois braços de madeira presos à parede,
                formando uma rede rasa que embala o gato.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">65 × 25 × 45 cm</span>
                <span className="iniFamilia">Descanso em tecido</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/rede-suspensa-parede">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="H2" />
              <span className="iniNum">H2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Cama Suspensa em Tecido Tenso</span>
              <span className="iniFuncao">Lona quase plana numa moldura de madeira</span>
              <p className="iniDescricao">
                Moldura de madeira com o tecido esticado quase plano, como a lona
                de um trampolim, com pouca folga no centro.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">65 × 18 × 45 cm</span>
                <span className="iniFamilia">Descanso em tecido</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/cama-tecido-tenso">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="H3" />
              <span className="iniNum">H3</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Cama Concha com Laterais Retas</span>
              <span className="iniFuncao">Berço facetado de painéis retos, sem curva</span>
              <p className="iniDescricao">
                Berço em forma de concha feito só de painéis retos unidos em
                ângulo, com almofada fina no fundo e frente aberta.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">60 × 22 × 45 cm</span>
                <span className="iniFamilia">Descanso em tecido</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/cama-concha-laterais-retas">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="utilitarios-titulo">
        <div className="iniSecaoTopo">
          <h2 id="utilitarios-titulo" className="iniSecaoTitulo">Comedouros e utilitários</h2>
          <span className="iniSecaoConta">3 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Móveis de serviço em madeira: o comedouro elevado de uma tigela, o de
          duas tigelas e a estação compacta vertical com armazenamento de ração.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="L1" />
              <span className="iniNum">L1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Comedouro Elevado Simples</span>
              <span className="iniFuncao">Mesinha baixa com um furo e uma tigela</span>
              <p className="iniDescricao">
                Tampo de madeira sobre quatro pernas, com um furo circular onde a
                tigela encaixa pelo aro. Come na altura certa.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">42 × 18 × 30 cm</span>
                <span className="iniFamilia">Utilitários</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/comedouro-simples">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="L2" />
              <span className="iniNum">L2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Comedouro Elevado Duplo</span>
              <span className="iniFuncao">Dois furos e duas tigelas, lado a lado</span>
              <p className="iniDescricao">
                Mesma mesinha do comedouro simples com dois furos no tampo — uma
                tigela para ração e uma para água.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">65 × 18 × 30 cm</span>
                <span className="iniFamilia">Utilitários</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/comedouro-duplo">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="L4" />
              <span className="iniNum">L4</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Estação Compacta com Armazenamento</span>
              <span className="iniFuncao">Gabinete vertical: porta, gaveta e comedouro no topo</span>
              <p className="iniDescricao">
                Versão vertical da estação de alimentação: guarda a ração numa
                porta e numa gaveta, com o comedouro integrado no topo.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">80 × 70 × 40 cm</span>
                <span className="iniFamilia">Utilitários</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/estacao-compacta">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="acessorios-titulo">
        <div className="iniSecaoTopo">
          <h2 id="acessorios-titulo" className="iniSecaoTitulo">Acessórios de mobília</h2>
          <span className="iniSecaoConta">1 projeto</span>
        </div>
        <p className="iniSecaoDescricao">
          Peças que se acoplam a um móvel que o comprador já tem. Sob medida: as
          dimensões saem do móvel real, não de um catálogo fixo.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="J1" />
              <span className="iniNum">J1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Protetor de Canto de Sofá em Sisal</span>
              <span className="iniFuncao">Peça em L revestida de sisal para a quina do sofá</span>
              <p className="iniDescricao">
                Duas faces de madeira em ângulo reto, revestidas de sisal por
                fora, que vestem o braço do sofá. Medida tirada do sofá real.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">35 × 70 × 25 cm</span>
                <span className="iniFamilia">Acessórios</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/protetor-canto-sofa">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="iniSecao" aria-labelledby="playgrounds-titulo">
        <div className="iniSecaoTopo">
          <h2 id="playgrounds-titulo" className="iniSecaoTitulo">Playgrounds e circuitos</h2>
          <span className="iniSecaoConta">5 projetos</span>
        </div>
        <p className="iniSecaoDescricao">
          Composições completas: vários módulos encadeados num percurso único de
          parede. Mostram a ordem do trajeto e a relação de altura entre as
          peças — a fabricação continua sendo módulo por módulo.
        </p>

        <div className="iniGrade">
          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="PLAY1" />
              <span className="iniNum">PLAY1</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Circuito de Parede Simples</span>
              <span className="iniFuncao">Rampa → plataforma → ponte → plataforma → topo</span>
              <p className="iniDescricao">
                O primeiro circuito completo do acervo: cinco módulos ligados num
                percurso de subida na parede, do chão até a plataforma mais alta.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">180 × 120 × 40 cm</span>
                <span className="iniFamilia">Playgrounds</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/playground-circuito-parede-simples">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="PLAY2" />
              <span className="iniNum">PLAY2</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Circuito com Nicho</span>
              <span className="iniFuncao">Degraus → passarela → nicho-túnel → mirante</span>
              <p className="iniDescricao">
                Um percurso de parede que passa por dentro de um abrigo: sobe
                pelos degraus, cruza a passarela, entra e sai de um nicho-túnel e
                termina num mirante.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">200 × 150 × 50 cm</span>
                <span className="iniFamilia">Playgrounds</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/playground-circuito-com-nicho">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="PLAY3" />
              <span className="iniNum">PLAY3</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Circuito Vertical de Canto</span>
              <span className="iniFuncao">Poste → escada de canto → plataformas → nicho no topo</span>
              <p className="iniDescricao">
                Um percurso que sobe pela quina de duas paredes, do poste de sisal
                no chão até um nicho encaixado no alto do canto.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">120 × 190 × 65 cm</span>
                <span className="iniFamilia">Playgrounds</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/playground-circuito-vertical-canto">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="PLAY4" />
              <span className="iniNum">PLAY4</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Circuito Arranhador</span>
              <span className="iniFuncao">Painel de sisal → poste → plataforma → ponte de ripas</span>
              <p className="iniDescricao">
                Um percurso centrado em superfícies de arranhar: painel de sisal
                na parede, poste de sisal no chão, plataforma e ponte de ripas.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">220 × 140 × 60 cm</span>
                <span className="iniFamilia">Playgrounds</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/playground-circuito-arranhador">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>

          <article className="iniCard">
            <div className="iniMini iniMiniModelo">
              <CapaProjeto codigo="PLAY5" />
              <span className="iniNum">PLAY5</span>
            </div>
            <div className="iniCorpo">
              <span className="iniTitulo">Playground Família</span>
              <span className="iniFuncao">Árvore → ponte → árvore → rede → plataforma de topo</span>
              <p className="iniDescricao">
                A maior composição do acervo: duas árvores de chão ligadas por uma
                ponte, mais uma rede de tecido e uma plataforma de topo.
              </p>
              <div className="iniRodapeCard">
                <span className="iniMedida medida">300 × 180 × 80 cm</span>
                <span className="iniFamilia">Playgrounds</span>
              </div>
              <Link className="iniAbrirProjeto" href="/projetos/playground-familia">
                Entrar no projeto <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export type Vetor3 = [number, number, number];
export type FormatoPeca = "caixa" | "cilindro" | "painel" | "tecido";
export type GrupoCusto = "madeira" | "sisal" | "tecido" | "ferragem";
export type StatusRevisao = "sugerida" | "revisada";

export interface DimensoesPeca {
  comprimento?: number;
  largura?: number;
  espessura?: number;
  diametro?: number;
}

export interface GeometriaVisual {
  /** Escala normalizada para a cena; as medidas exibidas vêm de `dimensoes`. */
  tamanho: Vetor3;
}

export interface PecaTecnica {
  id: string;
  /** Letra estável exibida nos marcadores e na ficha do projeto. */
  identificador: string;
  codigo: string;
  nome: string;
  formato: FormatoPeca;
  quantidade: number;
  material: string;
  acabamento: string;
  dimensoes: DimensoesPeca;
  posicao: Vetor3;
  rotacao: Vetor3;
  vetorExplosao: Vetor3;
  grupoCusto: GrupoCusto;
  etapaMontagem: number;
  geometriaVisual: GeometriaVisual;
}

export interface Insumo {
  id: string;
  nome: string;
  quantidade: number;
  unidade: "un" | "m" | "m²";
  grupoCusto: GrupoCusto;
}

export interface EtapaMontagem {
  ordem: number;
  titulo: string;
  descricao: string;
  pecas: string[];
}

export interface ProjetoTecnico {
  codigo: string;
  slug: string;
  nome: string;
  preview: string;
  modeloVisual: string;
  unidade: "mm";
  statusRevisao: StatusRevisao;
  dimensoesGerais: { largura: number; altura: number; profundidade: number };
  pecas: PecaTecnica[];
  ferragens: Insumo[];
  montagem: EtapaMontagem[];
  dificuldade: "Iniciante" | "Intermediário" | "Avançado";
  tempoEstimado: string;
  pessoas: number;
  avisosSeguranca: string[];
}

export interface TabelaPrecos {
  madeiraM2: number;
  posteMetro: number;
  sisalMetro: number;
  tecidoM2: number;
  ferragemUnidade: number;
  desperdicio: number;
  horas: number;
  valorHora: number;
  margem: number;
}

export interface ResultadoCustos {
  disponivel: boolean;
  porPeca: Record<string, number | null>;
  porGrupo: Record<GrupoCusto, number | null>;
  materiais: number | null;
  ferragens: number | null;
  desperdicio: number | null;
  maoDeObra: number;
  total: number | null;
  precoSugerido: number | null;
}

/** Estimativa local baseada nas medidas sugeridas e nos preços informados. */
export function calcularCustos(projeto: ProjetoTecnico, precos: TabelaPrecos): ResultadoCustos {
  const porPeca: Record<string, number | null> = {};

  for (const peca of projeto.pecas) {
    const d = peca.dimensoes;
    let custo: number | null = null;

    if (peca.grupoCusto === "madeira" && peca.formato === "cilindro" && d.comprimento) {
      custo = (d.comprimento / 1000) * precos.posteMetro * peca.quantidade;
    } else if (peca.grupoCusto === "madeira" && d.comprimento && d.largura) {
      custo = (d.comprimento * d.largura / 1_000_000) * precos.madeiraM2 * peca.quantidade;
    } else if (peca.grupoCusto === "sisal" && d.comprimento) {
      // Corda de 6 mm: área revestida ÷ largura da corda = comprimento aproximado.
      const area = peca.formato === "cilindro" && d.diametro
        ? Math.PI * d.diametro * d.comprimento
        : d.comprimento * (d.largura ?? 1);
      custo = (area / 6 / 1000) * precos.sisalMetro * peca.quantidade;
    } else if (peca.grupoCusto === "tecido" && d.comprimento && d.largura) {
      custo = (d.comprimento * d.largura / 1_000_000) * precos.tecidoM2 * peca.quantidade;
    } else if (peca.grupoCusto === "ferragem") {
      custo = precos.ferragemUnidade * peca.quantidade;
    }

    porPeca[peca.id] = custo;
  }

  const grupos = ["madeira", "sisal", "tecido", "ferragem"] as GrupoCusto[];
  const porGrupo = grupos.reduce((resultado, grupo) => {
    const pecas = projeto.pecas.filter((peca) => peca.grupoCusto === grupo);
    resultado[grupo] = pecas.some((peca) => porPeca[peca.id] === null)
      ? null
      : pecas.reduce((total, peca) => total + (porPeca[peca.id] ?? 0), 0);
    return resultado;
  }, {} as Record<GrupoCusto, number | null>);

  const disponivel = Object.values(porPeca).every((valor) => valor !== null);
  const maoDeObra = precos.horas * precos.valorHora;
  if (!disponivel) {
    return { disponivel, porPeca, porGrupo, materiais: null, ferragens: null, desperdicio: null, maoDeObra, total: null, precoSugerido: null };
  }

  const ferragensAvulsas = projeto.ferragens.reduce((total, item) => total + item.quantidade * precos.ferragemUnidade, 0);
  const ferragens = ferragensAvulsas + (porGrupo.ferragem ?? 0);
  const materiais = Object.values(porPeca).reduce<number>((total, valor) => total + (valor ?? 0), 0) + ferragensAvulsas;
  const desperdicio = materiais * (precos.desperdicio / 100);
  const total = materiais + desperdicio + maoDeObra;
  const precoSugerido = total * (1 + precos.margem / 100);
  return { disponivel, porPeca, porGrupo, materiais, ferragens, desperdicio, maoDeObra, total, precoSugerido };
}

type TipoProjeto =
  | "torre" | "painel" | "painel-canto" | "poste" | "cunha" | "banco"
  | "nicho" | "casinha" | "prateleira" | "mirante" | "ligacao" | "modular"
  | "degraus" | "escada-canto" | "zigue-zague" | "passarela" | "rampa"
  | "ponte-ripas" | "ponte-tecido" | "rede" | "cama-tecido" | "cama-concha"
  | "comedouro" | "estacao" | "protetor" | "playground";

interface ProjetoBase {
  codigo: string;
  slug: string;
  nome: string;
  pasta: string;
  tipo: TipoProjeto;
  medidas: Vetor3; // largura, altura e profundidade
  variante?: number;
}

interface PecaBruta {
  id: string;
  nome: string;
  formato: FormatoPeca;
  quantidade: number;
  material: string;
  acabamento: string;
  dimensoes: DimensoesPeca;
  tamanho: Vetor3;
  posicao: Vetor3;
  rotacao: Vetor3;
  explosao: Vetor3;
  grupoCusto: GrupoCusto;
  etapa: number;
}

const E = 18;
const MADEIRA = "Compensado ou MDF de 18 mm";
const ACABAMENTO = "Lixar, selar e aplicar acabamento atóxico";

function letraIdentificacao(indice: number) {
  let numero = indice + 1;
  let resultado = "";
  while (numero > 0) {
    numero--;
    resultado = String.fromCharCode(65 + (numero % 26)) + resultado;
    numero = Math.floor(numero / 26);
  }
  return resultado;
}

function horizontal(id: string, nome: string, comprimento: number, largura: number, espessura: number, posicao: Vetor3, etapa: number, explosao: Vetor3 = [0, 1, 0], grupoCusto: GrupoCusto = "madeira", material = MADEIRA): PecaBruta {
  return { id, nome, formato: grupoCusto === "tecido" ? "tecido" : "painel", quantidade: 1, material, acabamento: ACABAMENTO, dimensoes: { comprimento, largura, espessura }, tamanho: [comprimento, espessura, largura], posicao, rotacao: [0, 0, 0], explosao, grupoCusto, etapa };
}

function verticalFrente(id: string, nome: string, altura: number, largura: number, espessura: number, posicao: Vetor3, etapa: number, explosao: Vetor3 = [0, 0, 1], grupoCusto: GrupoCusto = "madeira", material = MADEIRA): PecaBruta {
  return { id, nome, formato: grupoCusto === "tecido" ? "tecido" : "painel", quantidade: 1, material, acabamento: ACABAMENTO, dimensoes: { comprimento: altura, largura, espessura }, tamanho: [largura, altura, espessura], posicao, rotacao: [0, 0, 0], explosao, grupoCusto, etapa };
}

function verticalLado(id: string, nome: string, altura: number, profundidade: number, espessura: number, posicao: Vetor3, etapa: number, explosao: Vetor3): PecaBruta {
  return { id, nome, formato: "painel", quantidade: 1, material: MADEIRA, acabamento: ACABAMENTO, dimensoes: { comprimento: altura, largura: profundidade, espessura }, tamanho: [espessura, altura, profundidade], posicao, rotacao: [0, 0, 0], explosao, grupoCusto: "madeira", etapa };
}

function cilindro(id: string, nome: string, altura: number, diametro: number, posicao: Vetor3, etapa: number, grupoCusto: GrupoCusto, material: string, explosao: Vetor3): PecaBruta {
  return { id, nome, formato: "cilindro", quantidade: 1, material, acabamento: grupoCusto === "sisal" ? "Enrolamento firme e uniforme" : ACABAMENTO, dimensoes: { comprimento: altura, diametro }, tamanho: [diametro, altura, diametro], posicao, rotacao: [0, 0, 0], explosao, grupoCusto, etapa };
}

function inclinada(id: string, nome: string, comprimento: number, largura: number, espessura: number, elevacao: number, posicao: Vetor3, etapa: number, grupoCusto: GrupoCusto = "madeira"): PecaBruta {
  const angulo = Math.atan2(elevacao, comprimento);
  return { ...horizontal(id, nome, comprimento, largura, espessura, posicao, etapa, [0, 0.7, 0.5], grupoCusto, grupoCusto === "sisal" ? "Revestimento de corda de sisal de 6 mm" : MADEIRA), tamanho: [largura, espessura, comprimento], rotacao: [-angulo, 0, 0] };
}

function pecasPorTipo(base: ProjetoBase): PecaBruta[] {
  const [w, h, d] = base.medidas;
  const y0 = -h / 2;

  if (base.tipo === "torre") {
    const niveis = base.variante ?? 2;
    const pecas: PecaBruta[] = [horizontal("base", "Base", Math.min(w, 600), Math.min(d, 520), 25, [0, y0 + 12.5, 0], 1, [0, -1, 0])];
    const alturaPoste = h - 70;
    pecas.push(cilindro("poste", "Poste estrutural", alturaPoste, 90, [0, y0 + 25 + alturaPoste / 2, 0], 2, "madeira", "Poste de madeira maciça ou tubo estrutural", [0, 0, -1]));
    pecas.push(cilindro("sisal", "Revestimento de sisal", alturaPoste - 40, 110, [0, y0 + 45 + (alturaPoste - 40) / 2, 0], 3, "sisal", "Corda de sisal de 6 mm", [0, 0, 1]));
    for (let i = 0; i < niveis; i++) {
      const py = y0 + 300 + i * ((h - 360) / Math.max(1, niveis - 1));
      pecas.push(horizontal(`plataforma-${i + 1}`, `Plataforma ${i + 1}`, Math.min(460, w * 0.72), Math.min(380, d * 0.72), E, [(i % 2 ? 1 : -1) * Math.min(80, w * 0.12), py, 0], 4 + i, [i % 2 ? 1 : -1, 0.35, 0]));
    }
    return pecas;
  }

  if (base.tipo === "painel" || base.tipo === "painel-canto") {
    const larguraFace = base.tipo === "painel-canto" ? Math.round(w * 0.62) : w;
    const pecas = [verticalFrente("painel", "Painel estrutural", h, larguraFace, E, [0, 0, 0], 1, [0, 0, -1])];
    pecas.push(verticalFrente("sisal", "Revestimento de sisal", h - 30, larguraFace - 30, 8, [0, 0, d / 2], 2, [0, 0, 1], "sisal", "Corda de sisal de 6 mm"));
    if (base.tipo === "painel-canto") {
      pecas.push(verticalLado("painel-lateral", "Painel lateral", h, larguraFace, E, [larguraFace / 2, 0, larguraFace / 2], 3, [1, 0, 0]));
      pecas.push(verticalLado("sisal-lateral", "Revestimento lateral", h - 30, larguraFace - 30, 8, [larguraFace / 2 - 8, 0, larguraFace / 2], 4, [1, 0, 0]));
      pecas[3].grupoCusto = "sisal";
      pecas[3].material = "Corda de sisal de 6 mm";
    }
    return pecas;
  }

  if (base.tipo === "poste" || base.tipo === "ligacao") {
    const comPlataforma = base.variante === 1 || base.tipo === "ligacao";
    const ph = h - (comPlataforma ? 70 : 35);
    const pecas = [horizontal("base", base.tipo === "ligacao" ? "Placa inferior" : "Base", Math.min(w, 500), Math.min(d, 500), 25, [0, y0 + 12.5, 0], 1, [0, -1, 0])];
    pecas.push(cilindro("poste", "Poste estrutural", ph, 90, [0, y0 + 25 + ph / 2, 0], 2, "madeira", "Poste de madeira maciça ou tubo estrutural", [0, 0, -1]));
    pecas.push(cilindro("sisal", "Revestimento de sisal", ph - 30, 110, [0, y0 + 40 + (ph - 30) / 2, 0], 3, "sisal", "Corda de sisal de 6 mm", [0, 0, 1]));
    if (comPlataforma) pecas.push(horizontal("topo", base.tipo === "ligacao" ? "Placa superior" : "Plataforma superior", Math.min(w, 480), Math.min(d, 420), E, [0, h / 2 - E / 2, 0], 4, [0, 1, 0]));
    return pecas;
  }

  if (base.tipo === "cunha" || base.tipo === "rampa") {
    const comp = Math.round(Math.hypot(d, h));
    return [
      horizontal("base", "Base de apoio", w, d * 0.72, E, [0, y0 + E / 2, 0], 1, [0, -1, 0]),
      inclinada("rampa", "Painel inclinado", comp, w, E, h - 40, [0, 0, 0], 2),
      inclinada("revestimento", "Faixa de sisal", comp - 40, w - 40, 8, h - 40, [0, 12, 0], 3, "sisal"),
    ];
  }

  if (base.tipo === "banco") {
    return [
      horizontal("tampo", "Tampo", w, d, E, [0, h / 2 - E / 2, 0], 1, [0, 1, 0]),
      horizontal("sisal", "Revestimento de sisal", w - 30, d - 30, 8, [0, h / 2 + 5, 0], 2, [0, 1, 0], "sisal", "Corda de sisal de 6 mm"),
      verticalFrente("pe-esquerdo", "Pé esquerdo", h - E, d, E, [-w / 2 + 45, -E / 2, 0], 3, [-1, 0, 0]),
      verticalFrente("pe-direito", "Pé direito", h - E, d, E, [w / 2 - 45, -E / 2, 0], 4, [1, 0, 0]),
    ];
  }

  if (base.tipo === "nicho" || base.tipo === "casinha") {
    const pecas = [
      horizontal("piso", "Piso", w, d, E, [0, y0 + E / 2, 0], 1, [0, -1, 0]),
      verticalFrente("fundo", "Painel de fundo", h - E * 2, w, E, [0, 0, -d / 2 + E / 2], 2, [0, 0, -1]),
      verticalLado("lateral-esquerda", "Lateral esquerda", h - E * 2, d, E, [-w / 2 + E / 2, 0, 0], 3, [-1, 0, 0]),
      verticalLado("lateral-direita", "Lateral direita", h - E * 2, d, E, [w / 2 - E / 2, 0, 0], 4, [1, 0, 0]),
    ];
    if (base.tipo === "casinha") {
      const telhado = Math.round(w * 0.58);
      const esquerda = horizontal("telhado-e", "Água esquerda do telhado", telhado, d + 40, E, [-w * 0.22, h / 2 - 10, 0], 5, [-0.7, 1, 0]);
      esquerda.rotacao = [0, 0, -0.48];
      const direita = horizontal("telhado-d", "Água direita do telhado", telhado, d + 40, E, [w * 0.22, h / 2 - 10, 0], 6, [0.7, 1, 0]);
      direita.rotacao = [0, 0, 0.48];
      pecas.push(esquerda, direita);
    } else {
      pecas.push(horizontal("teto", "Teto", w, d, E, [0, h / 2 - E / 2, 0], 5, [0, 1, 0]));
    }
    return pecas;
  }

  if (base.tipo === "prateleira" || base.tipo === "mirante" || base.tipo === "passarela") {
    const pecas = [horizontal("plataforma", base.tipo === "passarela" ? "Passarela" : "Plataforma", w, d, E, [0, 0, 0], 1, [0, 1, 0])];
    pecas.push(verticalFrente("suporte-e", "Suporte esquerdo", Math.max(90, h - E), Math.min(140, d), E, [-w * 0.33, -h * 0.25, -d * 0.35], 2, [-1, -0.2, 0]));
    pecas.push(verticalFrente("suporte-d", "Suporte direito", Math.max(90, h - E), Math.min(140, d), E, [w * 0.33, -h * 0.25, -d * 0.35], 3, [1, -0.2, 0]));
    if ((base.variante ?? 0) > 0) pecas.push(verticalFrente("borda", "Borda de proteção", 70, w, E, [0, 44, d / 2 - E / 2], 4, [0, 0, 1]));
    return pecas;
  }

  if (base.tipo === "modular" || base.tipo === "degraus" || base.tipo === "escada-canto" || base.tipo === "zigue-zague") {
    const quantidade = base.tipo === "modular" ? 4 : base.tipo === "zigue-zague" ? 5 : 4;
    const pecas: PecaBruta[] = [];
    if (base.tipo === "modular") pecas.push(verticalFrente("painel", "Painel de fixação", h, w, E, [0, 0, -d / 2], 1, [0, 0, -1]));
    for (let i = 0; i < quantidade; i++) {
      const x = base.tipo === "escada-canto" ? (i % 2 ? w * 0.22 : -w * 0.22) : (i - (quantidade - 1) / 2) * (w / quantidade * 0.75);
      const z = base.tipo === "escada-canto" ? (i % 2 ? d * 0.2 : -d * 0.2) : 0;
      const py = y0 + 100 + i * ((h - 200) / Math.max(1, quantidade - 1));
      pecas.push(horizontal(`degrau-${i + 1}`, `Degrau ${i + 1}`, Math.min(300, w * 0.38), Math.min(280, d), E, [x, py, z], (base.tipo === "modular" ? 2 : 1) + i, [i % 2 ? 1 : -1, 0.35, 0]));
    }
    return pecas;
  }

  if (base.tipo === "ponte-ripas") {
    const quantidade = 9;
    return Array.from({ length: quantidade }, (_, i) => horizontal(`ripa-${i + 1}`, `Ripa ${i + 1}`, Math.round(w / quantidade - 12), d, E, [-w / 2 + (i + 0.5) * (w / quantidade), 0, 0], i + 1, [0, (i % 2 ? 1 : -1) * 0.4, i % 2 ? 0.5 : -0.5]));
  }

  if (base.tipo === "ponte-tecido" || base.tipo === "rede" || base.tipo === "cama-tecido") {
    const tecido = horizontal("tecido", base.tipo === "rede" ? "Rede de descanso" : "Tecido estrutural", w - 80, d - 50, 8, [0, 0, 0], 1, [0, -0.7, 0], "tecido", "Lona ou tecido de alta resistência");
    return [
      tecido,
      horizontal("trilho-e", "Travessa esquerda", w, 45, 30, [0, 35, -d / 2 + 25], 2, [0, 0, -1]),
      horizontal("trilho-d", "Travessa direita", w, 45, 30, [0, 35, d / 2 - 25], 3, [0, 0, 1]),
    ];
  }

  if (base.tipo === "cama-concha") {
    return [
      horizontal("base", "Base da cama", w, d, E, [0, -h / 2 + E / 2, 0], 1, [0, -1, 0]),
      verticalLado("lateral-e", "Lateral esquerda", h, d, E, [-w / 2 + E / 2, 0, 0], 2, [-1, 0, 0]),
      verticalLado("lateral-d", "Lateral direita", h, d, E, [w / 2 - E / 2, 0, 0], 3, [1, 0, 0]),
      horizontal("almofada", "Almofada", w - 50, d - 40, 50, [0, -h / 2 + 55, 0], 4, [0, 0.8, 0], "tecido", "Tecido removível com enchimento"),
    ];
  }

  if (base.tipo === "comedouro") {
    const duplo = (base.variante ?? 1) > 1;
    const pecas = [horizontal("tampo", "Tampo", w, d, E, [0, h / 2 - E / 2, 0], 1, [0, 1, 0])];
    pecas.push(verticalFrente("pe-e", "Pé esquerdo", h - E, d, E, [-w / 2 + 35, -E / 2, 0], 2, [-1, 0, 0]));
    pecas.push(verticalFrente("pe-d", "Pé direito", h - E, d, E, [w / 2 - 35, -E / 2, 0], 3, [1, 0, 0]));
    const xs = duplo ? [-w * 0.23, w * 0.23] : [0];
    xs.forEach((x, i) => pecas.push({ ...cilindro(`pote-${i + 1}`, `Pote ${i + 1}`, 55, 160, [x, h / 2 + 15, 0], 4 + i, "ferragem", "Pote removível de inox", [i ? 1 : -1, 0.6, 0]), tamanho: [160, 55, 160] }));
    return pecas;
  }

  if (base.tipo === "estacao") {
    return [
      horizontal("base", "Base do gabinete", w, d, E, [0, y0 + E / 2, 0], 1, [0, -1, 0]),
      verticalLado("lateral-e", "Lateral esquerda", h - E * 2, d, E, [-w / 2 + E / 2, 0, 0], 2, [-1, 0, 0]),
      verticalLado("lateral-d", "Lateral direita", h - E * 2, d, E, [w / 2 - E / 2, 0, 0], 3, [1, 0, 0]),
      verticalFrente("fundo", "Fundo", h - E * 2, w - E * 2, E, [0, 0, -d / 2 + E / 2], 4, [0, 0, -1]),
      horizontal("tampo", "Tampo superior", w, d, E, [0, h / 2 - E / 2, 0], 5, [0, 1, 0]),
      { ...cilindro("pote-1", "Pote esquerdo", 55, 160, [-w * 0.2, h / 2 + 15, 0], 6, "ferragem", "Pote removível de inox", [-1, 0.7, 0]), tamanho: [160, 55, 160] },
      { ...cilindro("pote-2", "Pote direito", 55, 160, [w * 0.2, h / 2 + 15, 0], 7, "ferragem", "Pote removível de inox", [1, 0.7, 0]), tamanho: [160, 55, 160] },
    ];
  }

  if (base.tipo === "protetor") {
    const face = Math.round(w * 0.7);
    return [
      verticalFrente("painel-frente", "Painel frontal", h, face, E, [-face * 0.25, 0, 0], 1, [0, 0, 1]),
      verticalLado("painel-lado", "Painel lateral", h, face, E, [face * 0.25, 0, face * 0.25], 2, [1, 0, 0]),
      verticalFrente("sisal-frente", "Sisal frontal", h - 30, face - 30, 8, [-face * 0.25, 0, 12], 3, [0, 0, 1], "sisal", "Corda de sisal de 6 mm"),
    ];
  }

  // Playgrounds: cada módulo é selecionável; a marcenaria interna de cada módulo
  // permanece detalhada nos projetos simples que o compõem.
  return [
    horizontal("plataforma-baixa", "Plataforma baixa", Math.min(500, w * 0.2), 360, E, [-w * 0.3, y0 + h * 0.25, 0], 1, [-1, -0.3, 0]),
    cilindro("poste", "Poste arranhador", Math.min(900, h * 0.55), 110, [-w * 0.3, y0 + Math.min(900, h * 0.55) / 2, 0], 2, "sisal", "Poste revestido de sisal", [-1, 0, 0]),
    horizontal("passarela", "Passarela de ligação", Math.min(900, w * 0.36), 300, E, [0, y0 + h * 0.55, 0], 3, [0, 0.7, 1]),
    horizontal("plataforma-alta", "Plataforma alta", Math.min(520, w * 0.2), 380, E, [w * 0.3, y0 + h * 0.72, 0], 4, [1, 0.4, 0]),
    verticalFrente("nicho", "Módulo de nicho", Math.min(420, h * 0.25), Math.min(520, w * 0.2), E, [w * 0.3, y0 + h * 0.88, -d * 0.18], 5, [1, 0.8, 0]),
    horizontal("rede", "Rede de descanso", Math.min(620, w * 0.22), Math.min(420, d * 0.7), 8, [w * 0.05, y0 + h * 0.82, 0], 6, [0, 1, -0.6], "tecido", "Lona ou tecido de alta resistência"),
  ];
}

function dificuldade(tipo: TipoProjeto): ProjetoTecnico["dificuldade"] {
  if (["playground", "casinha", "estacao", "escada-canto"].includes(tipo)) return "Avançado";
  if (["torre", "nicho", "modular", "degraus", "zigue-zague", "rampa", "ponte-ripas", "ponte-tecido", "rede", "cama-tecido", "cama-concha"].includes(tipo)) return "Intermediário";
  return "Iniciante";
}

function criarProjeto(base: ProjetoBase): ProjetoTecnico {
  const [largura, altura, profundidade] = base.medidas;
  const brutas = pecasPorTipo(base);
  const escala = 2.45 / Math.max(largura, altura, profundidade);
  const pecas = brutas.map<PecaTecnica>((peca, indice) => ({
    id: peca.id,
    identificador: letraIdentificacao(indice),
    codigo: `${base.codigo}-P${String(indice + 1).padStart(2, "0")}`,
    nome: peca.nome,
    formato: peca.formato,
    quantidade: peca.quantidade,
    material: peca.material,
    acabamento: peca.acabamento,
    dimensoes: peca.dimensoes,
    posicao: peca.posicao.map((valor) => valor * escala) as Vetor3,
    rotacao: peca.rotacao,
    vetorExplosao: peca.explosao.map((valor) => valor * 0.9) as Vetor3,
    grupoCusto: peca.grupoCusto,
    etapaMontagem: peca.etapa,
    geometriaVisual: { tamanho: peca.tamanho.map((valor) => Math.max(valor * escala, 0.025)) as Vetor3 },
  }));
  const montagem = pecas.map<EtapaMontagem>((peca, indice) => ({
    ordem: indice + 1,
    titulo: `Instalar ${peca.nome.toLowerCase()}`,
    descricao: `Posicione ${peca.nome.toLowerCase()} conforme o gêmeo técnico e confira alinhamento, esquadro e fixação.`,
    pecas: [peca.id],
  }));
  const dif = dificuldade(base.tipo);
  const parede = ["painel", "painel-canto", "nicho", "casinha", "prateleira", "mirante", "ligacao", "modular", "degraus", "escada-canto", "zigue-zague", "passarela", "rampa", "ponte-ripas", "ponte-tecido", "rede", "cama-tecido", "playground"].includes(base.tipo);

  return {
    codigo: base.codigo,
    slug: base.slug,
    nome: base.nome,
    preview: `/modelos/${base.pasta}/preview.png`,
    modeloVisual: `/modelos/${base.pasta}/model.glb`,
    unidade: "mm",
    statusRevisao: "sugerida",
    dimensoesGerais: { largura, altura, profundidade },
    pecas,
    ferragens: [{ id: "fixacao", nome: parede ? "Parafusos e buchas adequados à parede" : "Parafusos para montagem", quantidade: Math.max(4, Math.ceil(pecas.length * 1.5)), unidade: "un", grupoCusto: "ferragem" }],
    montagem,
    dificuldade: dif,
    tempoEstimado: dif === "Iniciante" ? "2 a 4 horas" : dif === "Intermediário" ? "4 a 8 horas" : "1 a 2 dias",
    pessoas: dif === "Avançado" || parede ? 2 : 1,
    avisosSeguranca: [
      parede ? "Confirme o tipo de parede e use buchas, parafusos e pontos de fixação compatíveis." : "Teste a estabilidade da base antes de liberar o uso.",
      "Arredonde quinas, use acabamento atóxico e revise folgas, farpas e parafusos expostos.",
      "Adapte as medidas ao porte, peso e quantidade de gatos e ao espaço disponível.",
    ],
  };
}

const bases: ProjetoBase[] = [
  { codigo: "039", slug: "arvore-compacta-2-niveis", nome: "Árvore Compacta de 2 Níveis", pasta: "001-arvore-compacta-de-2-niveis", tipo: "torre", medidas: [600, 900, 500], variante: 2 },
  { codigo: "040", slug: "arvore-media-3-niveis", nome: "Árvore Média de 3 Níveis", pasta: "002-arvore-media-de-3-niveis", tipo: "torre", medidas: [650, 1250, 550], variante: 3 },
  { codigo: "041", slug: "torre-alta-vertical", nome: "Torre Alta Vertical", pasta: "003-torre-alta-vertical", tipo: "torre", medidas: [700, 1700, 600], variante: 3 },
  { codigo: "031", slug: "painel-arranhador-parede", nome: "Painel Arranhador de Parede", pasta: "011-painel-arranhador-de-parede", tipo: "painel", medidas: [300, 700, 40] },
  { codigo: "032", slug: "painel-arranhador-canto", nome: "Painel Arranhador de Canto (90°)", pasta: "012-painel-arranhador-de-canto", tipo: "painel-canto", medidas: [420, 700, 220] },
  { codigo: "033", slug: "poste-arranhador-chao", nome: "Poste Arranhador de Chão", pasta: "013-poste-arranhador-de-chao", tipo: "poste", medidas: [450, 750, 450] },
  { codigo: "034", slug: "poste-arranhador-plataforma", nome: "Poste Arranhador com Plataforma", pasta: "014-poste-arranhador-com-plataforma", tipo: "poste", medidas: [500, 900, 500], variante: 1 },
  { codigo: "035", slug: "arranhador-cunha", nome: "Arranhador Inclinado tipo Cunha", pasta: "015-arranhador-cunha", tipo: "cunha", medidas: [350, 250, 650] },
  { codigo: "036", slug: "arranhador-banco", nome: "Arranhador Horizontal tipo Banco", pasta: "016-arranhador-banco", tipo: "banco", medidas: [650, 250, 320] },
  { codigo: "NA1", slug: "nicho-aberto-parede", nome: "Nicho Aberto de Parede", pasta: "021-nicho-aberto-de-parede", tipo: "nicho", medidas: [520, 450, 400] },
  { codigo: "NA2", slug: "nicho-aberto-canto", nome: "Nicho Aberto de Canto", pasta: "022-nicho-aberto-de-canto", tipo: "nicho", medidas: [500, 450, 400] },
  { codigo: "013", slug: "nicho-tunel-retangular", nome: "Nicho Túnel Retangular", pasta: "023-nicho-tunel-retangular", tipo: "nicho", medidas: [600, 400, 400] },
  // E2 no catálogo revisado (gpt.md) — janela frontal é decorativa, a entrada
  // real segue nas duas laterais como no resto da família E. Medida entre o
  // 013 (600x400x400) e o 015 (600x450x450), mesma proporção da família.
  { codigo: "014", slug: "nicho-tunel-janela-redonda", nome: "Nicho Túnel com Janela Frontal Redonda", pasta: "026-nicho-tunel-com-janela-frontal-redonda", tipo: "nicho", medidas: [600, 420, 420] },
  { codigo: "015", slug: "nicho-tunel-entrada-angulo", nome: "Nicho Túnel com Entrada em Ângulo", pasta: "024-nicho-tunel-com-entrada-em-angulo", tipo: "nicho", medidas: [600, 450, 450] },
  { codigo: "E4", slug: "nicho-tunel-saida-topo", nome: "Nicho Túnel com Saída no Topo", pasta: "025-nicho-tunel-com-saida-no-topo", tipo: "nicho", medidas: [550, 500, 450] },
  { codigo: "022", slug: "casinha-suspensa-telhado", nome: "Casinha Suspensa com Telhado de Dois Planos", pasta: "031-casinha-suspensa-com-telhado-de-dois-planos", tipo: "casinha", medidas: [600, 650, 450] },
  { codigo: "G1", slug: "plataforma-descanso-simples", nome: "Prateleira de Descanso Simples", pasta: "037-prateleira-de-descanso-simples", tipo: "prateleira", medidas: [500, 160, 350] },
  { codigo: "G2", slug: "plataforma-descanso-borda", nome: "Prateleira de Descanso com Borda", pasta: "038-prateleira-de-descanso-com-borda", tipo: "prateleira", medidas: [550, 180, 400], variante: 1 },
  { codigo: "G3", slug: "mirante-de-janela", nome: "Mirante de Janela", pasta: "039-mirante-de-janela", tipo: "mirante", medidas: [650, 180, 300], variante: 1 },
  { codigo: "C1", slug: "poste-ligacao-dois-niveis", nome: "Poste de Ligação entre Dois Níveis", pasta: "064-poste-de-ligacao-entre-dois-niveis", tipo: "ligacao", medidas: [350, 900, 350] },
  { codigo: "D1", slug: "painel-modular-escalada", nome: "Painel Modular de Escalada com Apoios", pasta: "065-painel-modular-de-escalada-com-apoios", tipo: "modular", medidas: [800, 1000, 300] },
  { codigo: "A1", slug: "degraus-escalonados-parede", nome: "Degraus Escalonados de Parede", pasta: "051-degraus-escalonados-de-parede", tipo: "degraus", medidas: [900, 700, 320] },
  { codigo: "A2", slug: "escada-canto", nome: "Escada de Canto", pasta: "052-escada-de-canto", tipo: "escada-canto", medidas: [700, 900, 350] },
  { codigo: "A3", slug: "escada-zigue-zague", nome: "Escada em Zigue-Zague de Parede", pasta: "053-escada-em-zigue-zague-de-parede", tipo: "zigue-zague", medidas: [500, 1100, 320] },
  { codigo: "A4", slug: "passarela-reta", nome: "Passarela Reta", pasta: "054-passarela-reta", tipo: "passarela", medidas: [900, 180, 300] },
  { codigo: "A5", slug: "passarela-recorte-reto", nome: "Passarela com Recorte Reto", pasta: "055-passarela-com-recorte-reto", tipo: "passarela", medidas: [900, 220, 300], variante: 1 },
  { codigo: "A6", slug: "rampa-acesso-idoso", nome: "Rampa de Acesso", pasta: "056-rampa-de-acesso", tipo: "rampa", medidas: [350, 550, 900] },
  { codigo: "B1", slug: "ponte-ripas-corda", nome: "Ponte Suspensa de Ripas com Corda", pasta: "059-ponte-suspensa-de-ripas-com-corda", tipo: "ponte-ripas", medidas: [1000, 180, 300] },
  { codigo: "B2", slug: "ponte-tecido-reforcado", nome: "Ponte Flexível de Tecido Reforçado", pasta: "060-ponte-flexivel-de-tecido-reforcado", tipo: "ponte-tecido", medidas: [1000, 150, 350] },
  { codigo: "H1", slug: "rede-suspensa-parede", nome: "Rede Suspensa de Parede", pasta: "045-rede-suspensa-de-parede", tipo: "rede", medidas: [650, 250, 450] },
  { codigo: "H2", slug: "cama-tecido-tenso", nome: "Cama Suspensa em Tecido Tenso", pasta: "046-cama-suspensa-em-tecido-tenso", tipo: "cama-tecido", medidas: [650, 180, 450] },
  { codigo: "H3", slug: "cama-concha-laterais-retas", nome: "Cama Concha com Laterais Retas", pasta: "047-cama-concha-com-laterais-retas", tipo: "cama-concha", medidas: [600, 220, 450] },
  { codigo: "L1", slug: "comedouro-simples", nome: "Comedouro Elevado Simples", pasta: "068-comedouro-elevado-simples", tipo: "comedouro", medidas: [420, 180, 300], variante: 1 },
  { codigo: "L2", slug: "comedouro-duplo", nome: "Comedouro Elevado Duplo", pasta: "069-comedouro-elevado-duplo", tipo: "comedouro", medidas: [650, 180, 300], variante: 2 },
  { codigo: "L4", slug: "estacao-compacta", nome: "Estação Compacta com Armazenamento", pasta: "070-estacao-compacta-com-armazenamento", tipo: "estacao", medidas: [800, 700, 400] },
  { codigo: "J1", slug: "protetor-canto-sofa", nome: "Protetor de Canto de Sofá em Sisal", pasta: "076-protetor-de-canto-de-sofa-em-sisal", tipo: "protetor", medidas: [350, 700, 250] },
  { codigo: "PLAY1", slug: "playground-circuito-parede-simples", nome: "Circuito de Parede Simples", pasta: "080-circuito-de-parede-simples", tipo: "playground", medidas: [1800, 1200, 400] },
  { codigo: "PLAY2", slug: "playground-circuito-com-nicho", nome: "Circuito com Nicho", pasta: "081-circuito-com-nicho", tipo: "playground", medidas: [2000, 1500, 500] },
  { codigo: "PLAY3", slug: "playground-circuito-vertical-canto", nome: "Circuito Vertical de Canto", pasta: "082-circuito-vertical-de-canto", tipo: "playground", medidas: [1200, 1900, 650] },
  { codigo: "PLAY4", slug: "playground-circuito-arranhador", nome: "Circuito Arranhador", pasta: "083-circuito-arranhador", tipo: "playground", medidas: [2200, 1400, 600] },
  { codigo: "PLAY5", slug: "playground-familia", nome: "Playground Família", pasta: "084-playground-familia", tipo: "playground", medidas: [3000, 1800, 800] },
  { codigo: "004", slug: "torre-canto-duas-paredes", nome: "Torre de Canto para Duas Paredes", pasta: "004-torre-de-canto-para-duas-paredes", tipo: "torre", medidas: [550, 1100, 550], variante: 2 },
  { codigo: "005", slug: "torre-toca-central", nome: "Torre com Toca Central", pasta: "005-torre-com-toca-central", tipo: "torre", medidas: [600, 1300, 550], variante: 2 },
  { codigo: "006", slug: "torre-dupla-ponte", nome: "Torre Dupla com Ponte", pasta: "006-torre-dupla-com-ponte", tipo: "playground", medidas: [1600, 1100, 500] },
  { codigo: "007", slug: "arvore-xl-4-niveis", nome: "Árvore XL de 4 Níveis", pasta: "007-arvore-xl-de-4-niveis", tipo: "torre", medidas: [700, 1900, 600], variante: 4 },
  { codigo: "008", slug: "torre-slim-apartamento", nome: "Torre Slim para Apartamento Pequeno", pasta: "008-torre-slim-para-apartamento-pequeno", tipo: "torre", medidas: [400, 1400, 400], variante: 2 },
  { codigo: "009", slug: "torre-balanco-suspenso", nome: "Torre com Balanço Suspenso", pasta: "009-torre-com-balanco-suspenso", tipo: "torre", medidas: [650, 1300, 550], variante: 2 },
  { codigo: "017", slug: "arco-arranhador-curvo", nome: "Arco Arranhador Curvo", pasta: "017-arco-arranhador-curvo", tipo: "cunha", medidas: [350, 600, 400] },
  { codigo: "018", slug: "poste-arranhador-duplo", nome: "Poste Arranhador Duplo", pasta: "018-poste-arranhador-duplo", tipo: "poste", medidas: [550, 850, 400] },
  { codigo: "019", slug: "arranhador-porta", nome: "Arranhador de Porta", pasta: "019-arranhador-de-porta", tipo: "painel", medidas: [280, 600, 40] },
  { codigo: "020", slug: "mesa-arranhador-puff", nome: "Mesa Arranhador (Puff)", pasta: "020-mesa-arranhador", tipo: "banco", medidas: [500, 220, 400] },
  { codigo: "027", slug: "nicho-canto-triangular", nome: "Nicho de Canto Triangular", pasta: "027-nicho-de-canto-triangular", tipo: "nicho", medidas: [500, 450, 500] },
  { codigo: "028", slug: "nichos-comunicantes-horizontais", nome: "Nichos Comunicantes Horizontais", pasta: "028-nichos-comunicantes-horizontais", tipo: "playground", medidas: [1100, 450, 420] },
  { codigo: "029", slug: "nichos-comunicantes-verticais", nome: "Nichos Comunicantes Verticais", pasta: "029-nichos-comunicantes-verticais", tipo: "torre", medidas: [500, 950, 450], variante: 2 },
  { codigo: "030", slug: "nicho-trelicado-ripas", nome: "Nicho Treliçado de Ripas", pasta: "030-nicho-trelicado-de-ripas", tipo: "nicho", medidas: [600, 420, 420] },
  { codigo: "032", slug: "casinha-chao-telhado-a", nome: "Casinha de Chão com Telhado A", pasta: "032-casinha-de-chao-com-telhado-a", tipo: "casinha", medidas: [600, 600, 450] },
  { codigo: "033", slug: "casinha-varanda", nome: "Casinha com Varanda", pasta: "033-casinha-com-varanda", tipo: "casinha", medidas: [650, 620, 500] },
  { codigo: "034", slug: "casinha-redonda-iglu", nome: "Casinha Redonda tipo Iglu", pasta: "034-casinha-redonda-tipo-iglu", tipo: "casinha", medidas: [550, 500, 550] },
  { codigo: "035", slug: "casinha-duplex", nome: "Casinha Duplex", pasta: "035-casinha-duplex", tipo: "casinha", medidas: [550, 850, 450] },
  { codigo: "036", slug: "casinha-telhado-removivel", nome: "Casinha com Telhado Removível", pasta: "036-casinha-com-telhado-removivel", tipo: "casinha", medidas: [600, 600, 450] },
  { codigo: "040", slug: "prateleira-escalonada-tripla", nome: "Prateleira Escalonada Tripla", pasta: "040-prateleira-escalonada-tripla", tipo: "degraus", medidas: [700, 500, 260] },
  { codigo: "041", slug: "mirante-almofada-encaixada", nome: "Mirante com Almofada Encaixada", pasta: "041-mirante-com-almofada-encaixada", tipo: "mirante", medidas: [550, 170, 350], variante: 1 },
  { codigo: "042", slug: "prateleira-circular-canto", nome: "Prateleira Circular", pasta: "042-prateleira-circular", tipo: "prateleira", medidas: [420, 160, 420] },
  { codigo: "043", slug: "plataforma-suspensa-correntes", nome: "Plataforma Suspensa por Correntes", pasta: "043-plataforma-suspensa-por-correntes", tipo: "prateleira", medidas: [450, 160, 400] },
  { codigo: "044", slug: "varanda-gato-janela", nome: "Varanda-Gato", pasta: "044-varanda-gato", tipo: "mirante", medidas: [500, 220, 300], variante: 1 },
  { codigo: "048", slug: "cama-concha-laterais-curvas", nome: "Cama Concha com Laterais Curvas", pasta: "048-cama-concha-com-laterais-curvas", tipo: "cama-concha", medidas: [600, 220, 450] },
  { codigo: "049", slug: "berco-duplo-tecido", nome: "Berço Duplo", pasta: "049-berco-duplo", tipo: "cama-tecido", medidas: [1000, 180, 450] },
  { codigo: "050", slug: "rede-chao-moldura-baixa", nome: "Rede de Chão com Moldura Baixa", pasta: "050-rede-de-chao-com-moldura-baixa", tipo: "cama-tecido", medidas: [600, 120, 450] },
  { codigo: "057", slug: "degraus-flutuantes-alternados", nome: "Degraus Flutuantes Alternados", pasta: "057-degraus-flutuantes-alternados", tipo: "zigue-zague", medidas: [550, 1200, 320] },
  { codigo: "058", slug: "escada-espiral-parede", nome: "Escada Espiral de Parede", pasta: "058-escada-espiral-de-parede", tipo: "modular", medidas: [500, 1300, 500] },
  { codigo: "061", slug: "ponte-rigida-corrimao", nome: "Ponte Rígida com Corrimão de Corda", pasta: "061-ponte-rigida-com-corrimao-de-corda", tipo: "passarela", medidas: [1000, 180, 300], variante: 1 },
  { codigo: "062", slug: "ponte-pensil-dupla", nome: "Ponte Pênsil Dupla", pasta: "062-ponte-pensil-dupla", tipo: "ponte-ripas", medidas: [1000, 200, 280] },
  { codigo: "063", slug: "tunel-ponte-coberta", nome: "Túnel-Ponte", pasta: "063-tunel-ponte", tipo: "ponte-tecido", medidas: [1000, 300, 350] },
  { codigo: "066", slug: "painel-escalada-espinha-peixe", nome: "Painel de Escalada em Espinha de Peixe", pasta: "066-painel-de-escalada-em-espinha-de-peixe", tipo: "modular", medidas: [500, 900, 250] },
  { codigo: "067", slug: "coluna-sisal-chao-teto", nome: "Coluna de Sisal do Chão ao Teto", pasta: "067-coluna-de-sisal-do-chao-ao-teto", tipo: "poste", medidas: [400, 2400, 400] },
  { codigo: "071", slug: "estacao-porta-racao", nome: "Estação de Alimentação com Porta-Ração", pasta: "071-estacao-de-alimentacao-com-porta-racao", tipo: "estacao", medidas: [500, 400, 350] },
  { codigo: "072", slug: "comedouro-triplo", nome: "Comedouro Triplo", pasta: "072-comedouro-triplo", tipo: "comedouro", medidas: [850, 180, 300], variante: 2 },
  { codigo: "073", slug: "estacao-agua-elevada", nome: "Estação de Água Elevada", pasta: "073-estacao-de-agua-elevada", tipo: "comedouro", medidas: [280, 150, 280], variante: 1 },
  { codigo: "074", slug: "movel-higiene-caixa-areia", nome: "Móvel de Higiene", pasta: "074-movel-de-higiene", tipo: "estacao", medidas: [600, 500, 450] },
  { codigo: "075", slug: "bancada-escovacao", nome: "Bancada de Escovação", pasta: "075-bancada-de-escovacao", tipo: "comedouro", medidas: [650, 250, 450], variante: 1 },
  { codigo: "077", slug: "protetor-pe-mesa", nome: "Protetor de Pé de Mesa", pasta: "077-protetor-de-pe-de-mesa", tipo: "poste", medidas: [140, 200, 140] },
  { codigo: "078", slug: "prateleira-encaixe-estante", nome: "Prateleira de Encaixe em Estante Existente", pasta: "078-prateleira-de-encaixe-em-estante-existente", tipo: "prateleira", medidas: [350, 140, 300] },
  { codigo: "079", slug: "degrau-apoio-movel-alto", nome: "Degrau de Apoio para Cama/Sofá Alto", pasta: "079-degrau-de-apoio-para-cama", tipo: "banco", medidas: [450, 250, 350] },
  { codigo: "085", slug: "circuito-multi-gato-paralelo", nome: "Circuito Multi-Gato", pasta: "085-circuito-multi-gato", tipo: "playground", medidas: [1900, 1300, 500] },
  { codigo: "086", slug: "circuito-compacto-apartamento", nome: "Circuito Compacto para Apartamento", pasta: "086-circuito-compacto-para-apartamento", tipo: "degraus", medidas: [900, 1100, 320] },
  { codigo: "087", slug: "playground-canto-casinha-topo", nome: "Playground de Canto com Casinha no Topo", pasta: "087-playground-de-canto-com-casinha-no-topo", tipo: "playground", medidas: [1300, 1900, 650] },
  { codigo: "088", slug: "cama-chao-bordas-altas", nome: "Cama de Chão com Bordas Altas", pasta: "088-cama-de-chao-com-bordas-altas", tipo: "cama-concha", medidas: [550, 220, 450] },
  { codigo: "089", slug: "cama-chao-redonda-facetada", nome: "Cama de Chão Redonda (facetada)", pasta: "089-cama-de-chao-redonda", tipo: "cama-concha", medidas: [500, 180, 500] },
  { codigo: "090", slug: "sofa-cama-duas-alturas", nome: "Sofá-Cama para Gatos", pasta: "090-sofa-cama-para-gatos", tipo: "cama-concha", medidas: [550, 250, 450] },
  { codigo: "091", slug: "cama-teto-baixo-semi-toca", nome: "Cama com Teto Baixo (semi-toca)", pasta: "091-cama-com-teto-baixo", tipo: "casinha", medidas: [550, 300, 450] },
  { codigo: "092", slug: "caixote-externo-telhado", nome: "Caixote Externo com Telhado Impermeável", pasta: "092-caixote-externo-com-telhado-impermeavel", tipo: "casinha", medidas: [600, 550, 450] },
  { codigo: "093", slug: "poste-arranhador-externo", nome: "Poste de Arranhar Externo", pasta: "093-poste-de-arranhar-externo", tipo: "poste", medidas: [600, 800, 600] },
  { codigo: "094", slug: "plataforma-varanda-grade", nome: "Plataforma de Varanda com Grade de Proteção", pasta: "094-plataforma-de-varanda-com-grade-de-protecao", tipo: "mirante", medidas: [500, 300, 350], variante: 1 },
  { codigo: "095", slug: "tunel-quintal-elevado", nome: "Túnel de Quintal", pasta: "095-tunel-de-quintal", tipo: "nicho", medidas: [650, 450, 450] },
  { codigo: "096", slug: "central-observacao-giratoria", nome: "Central de Observação (360°)", pasta: "096-central-de-observacao", tipo: "poste", medidas: [400, 950, 400], variante: 1 },
  { codigo: "097", slug: "complexo-multi-gato-xl", nome: "Complexo Multi-Gato XL", pasta: "097-complexo-multi-gato-xl", tipo: "playground", medidas: [2000, 1600, 600] },
  { codigo: "098", slug: "kit-modular-empilhavel", nome: "Kit Modular Empilhável", pasta: "098-kit-modular-empilhavel", tipo: "estacao", medidas: [700, 800, 400] },
  { codigo: "099", slug: "movel-divisor-ambiente", nome: "Móvel Divisor de Ambiente", pasta: "099-movel-divisor-de-ambiente", tipo: "painel", medidas: [500, 1500, 350] },
  { codigo: "100", slug: "torre-gato-idoso", nome: "Torre para Gato Idoso (acesso facilitado)", pasta: "100-torre-para-gato-idoso", tipo: "torre", medidas: [800, 700, 700], variante: 2 },
];

export const listaProjetosTecnicos = bases.map(criarProjeto);
export const projetosTecnicos = Object.fromEntries(listaProjetosTecnicos.map((projeto) => [projeto.slug, projeto])) as Record<string, ProjetoTecnico>;
export const projeto039 = projetosTecnicos["arvore-compacta-2-niveis"];

export function obterProjetoTecnico(slug: string) {
  return projetosTecnicos[slug];
}

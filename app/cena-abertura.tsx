// app/cena-abertura.tsx
//
// A cena da abertura: um circuito de parede com o gato nele.
//
// A skill pede "figuras recortadas sangrando até as bordas, com a saudação
// DENTRO da cena, no corredor entre as figuras, e o pé dissolvendo no fundo".
// Aqui isso é desenhado em código, não em arquivo:
//
//   · custo de banda ZERO (a alternativa em PNG são ~300 KB por visita, e a
//     cota do Supabase free é 5 GB/mês — a mesma conta que já estourou antes);
//   · fala a MESMA linguagem das miniaturas dos cards (mesmo traço, mesma
//     paleta), então a área parece um sistema e não um site com banner;
//   · não há cache a furar quando mudar — não existe arquivo servido.
//
// A dissolução do pé é `mask-image` no CSS (.abrCena), como manda a skill.
// ⚠️ aria-hidden fica no CONTÊINER da cena; a saudação continua sendo lida.

const TRACO = "#334155";
const MADEIRA = "#e9823d";
const MADEIRA_TOPO = "#f2a766";
const MADEIRA_LADO = "#c95a1d";

/** Um degrau/prateleira visto de canto — a mesma forma da miniatura do painel. */
function Degrau({ x, y, l = 46, d = 13 }: { x: number; y: number; l?: number; d?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points={`${d},0 ${d + l},0 ${l},${d} 0,${d}`}
        fill={MADEIRA_TOPO} stroke={TRACO} strokeWidth="1.4" strokeLinejoin="round" />
      <polygon points={`0,${d} ${l},${d} ${l},${d + 6} 0,${d + 6}`}
        fill={MADEIRA} stroke={TRACO} strokeWidth="1.4" strokeLinejoin="round" />
      {/* mão-francesa: FERRAGEM comprada, não peça de corte */}
      <path d={`M 8,${d + 6} L 8,${d + 20} L 21,${d + 6}`}
        fill="none" stroke={TRACO} strokeWidth="1.5" opacity="0.55" />
    </g>
  );
}

/** O nicho fechado — a caixa isométrica com a entrada vazada. */
function Nicho({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon points="12,0 70,0 58,12 0,12"
        fill={MADEIRA_TOPO} stroke={TRACO} strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="58,12 70,0 70,50 58,62"
        fill={MADEIRA_LADO} stroke={TRACO} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="0" y="12" width="58" height="50"
        fill={MADEIRA} stroke={TRACO} strokeWidth="1.5" strokeLinejoin="round" />
      {/* A entrada é FURO, não textura colada — é instrução de corte. */}
      <circle cx="29" cy="38" r="13" fill="#1e293b" stroke={TRACO} strokeWidth="1.4" />
    </g>
  );
}

/** O poste de sisal, com a trama que o gato arranha. */
function Poste({ x, y, h = 96 }: { x: number; y: number; h?: number }) {
  const larg = 17;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={larg / 2} cy={h} rx="30" ry="7"
        fill={MADEIRA_TOPO} stroke={TRACO} strokeWidth="1.5" />
      <rect x="0" y="0" width={larg} height={h} rx="7"
        fill={MADEIRA} stroke={TRACO} strokeWidth="1.5" />
      {Array.from({ length: Math.floor(h / 8) }).map((_, i) => (
        <line key={i} x1="1.6" y1={6 + i * 8} x2={larg - 1.6} y2={6 + i * 8}
          stroke={TRACO} strokeWidth="0.9" opacity="0.32" />
      ))}
    </g>
  );
}

/**
 * O gato: silhueta sentada, de perfil, olhando o circuito.
 * Traço contínuo — é figura, não ícone de pet shop.
 */
function Gato({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M18 78 C 6 78 4 62 8 50 C 11 40 14 34 14 27
           L 9 9 C 8.4 6 11 5 12.6 7 L 21 19
           C 25 17.6 32 17.6 36 19 L 44.4 7 C 46 5 48.6 6 48 9 L 43 27
           C 43 36 47 46 49 56 C 51 68 46 78 34 78 Z"
        fill="#1e293b" stroke={TRACO} strokeWidth="1.6" strokeLinejoin="round"
      />
      {/* rabo enrolado no pé, o jeito que gato senta */}
      <path d="M46 76 C 62 80 66 66 57 62"
        fill="none" stroke={TRACO} strokeWidth="4.2" strokeLinecap="round" />
      <circle cx="23" cy="30" r="2.4" fill="hsl(45 70% 72%)" />
      <circle cx="35" cy="30" r="2.4" fill="hsl(45 70% 72%)" />
    </g>
  );
}

/**
 * Duas montagens da mesma cena, e a razão é geométrica: num viewBox largo
 * (900) o `slice` corta as pontas — que é justamente onde as figuras moram.
 * A versão estreita reagrupa tudo para dentro, ladeando o título.
 *
 * ⚠️ CSS decide qual aparece (`[data-largo]` / `[data-estreito]`), não JS:
 * media query em
 * JavaScript daria mismatch de hidratação, e a cena piscaria na troca.
 */
export function CenaAbertura() {
  return (
    <>
      <CenaLarga />
      <CenaEstreita />
    </>
  );
}

function CenaEstreita() {
  return (
    <svg className="abrSvg" data-estreito viewBox="0 0 390 250"
      preserveAspectRatio="xMidYMin meet" role="presentation">
      {/* Esquerda: o circuito descendo do canto de cima */}
      <g opacity="0.95">
        <Nicho x={-6} y={4} s={0.6} />
        <Degrau x={4} y={78} l={34} d={10} />
        <Degrau x={16} y={126} l={30} d={9} />
      </g>
      {/* Direita: poste e o gato no alto */}
      <g opacity="0.95">
        <Degrau x={318} y={72} l={38} d={11} />
        <Poste x={352} y={112} h={78} />
        <Gato x={330} y={40} s={0.62} />
      </g>
      <defs>
        <linearGradient id="abrChaoE" x1="0" x2="1">
          <stop offset="0" stopColor={TRACO} stopOpacity="0" />
          <stop offset="0.5" stopColor={TRACO} stopOpacity="0.22" />
          <stop offset="1" stopColor={TRACO} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="235" x2="390" y2="235" stroke="url(#abrChaoE)" strokeWidth="1.4" />
    </svg>
  );
}

function CenaLarga() {
  return (
    <svg className="abrSvg" data-largo viewBox="0 0 900 260" preserveAspectRatio="xMidYMax slice"
      role="presentation">
      {/* ── LADO ESQUERDO: o circuito que sobe ─────────────────── */}
      <g opacity="0.95">
        <Degrau x={20} y={186} />
        <Degrau x={86} y={142} />
        <Degrau x={30} y={98} l={40} />
        <Nicho x={104} y={36} s={0.86} />
      </g>

      {/* ── LADO DIREITO: poste, prateleira e o gato ───────────── */}
      <g opacity="0.95">
        <Degrau x={742} y={96} l={52} />
        <Poste x={786} y={140} h={100} />
        <Nicho x={690} y={168} s={0.72} />
        <Gato x={800} y={62} s={0.92} />
      </g>

      {/* Linha do chão: dissolve nas pontas, sem começo nem fim visíveis */}
      <defs>
        <linearGradient id="abrChao" x1="0" x2="1">
          <stop offset="0" stopColor={TRACO} stopOpacity="0" />
          <stop offset="0.5" stopColor={TRACO} stopOpacity="0.28" />
          <stop offset="1" stopColor={TRACO} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="247" x2="900" y2="247" stroke="url(#abrChao)" strokeWidth="1.6" />
    </svg>
  );
}

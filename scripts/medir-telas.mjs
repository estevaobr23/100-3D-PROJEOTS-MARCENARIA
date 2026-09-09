// scripts/medir-telas.mjs
//
// MEDE as telas num navegador real, em vez de olhar print.
// Roda desktop E celular — a maioria do tráfego é mobile, e o que cabe no
// monitor volta a rolar no telefone.
//
// ⚠️ A asserção roda em TODAS as viewports, sem `if (!isMobile)`: asserção que
// não roda no aparelho da maioria do tráfego é asserção que não existe.
//
// Saída compacta: uma linha por tela + falhas. Nunca dump.
//
//   node scripts/medir-telas.mjs [--url http://localhost:3210]

import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const url = process.argv.includes("--url")
  ? process.argv[process.argv.indexOf("--url") + 1]
  : "http://localhost:3210";

const VIEWPORTS = [
  { nome: "pc", width: 1440, height: 900 },
  { nome: "notebook", width: 1280, height: 720 },
  { nome: "tablet", width: 820, height: 1180 },
  { nome: "celular", width: 390, height: 844 },
  { nome: "celular-p", width: 360, height: 640 },
];

// O que cada rota precisa ter. Os totais são lidos do MAPA, não digitados:
// se o mapa mudar, a asserção acompanha em vez de reprovar o certo.
const fonte = readFileSync(new URL("../lib/dados/projetos.ts", import.meta.url), "utf8");
const TOTAL = [...fonte.matchAll(/^\s*\{ slug: "/gm)].length;
const CATEGORIAS = new Set([...fonte.matchAll(/necessidade: "([^"]+)"/g)].map((m) => m[1])).size;
const ESCONDER = [...fonte.matchAll(/necessidade: "esconder"/g)].length;

const ROTAS = [
  { caminho: "/", nome: "inicio", espera: { ".catCard": CATEGORIAS }, capas: 0 },
  { caminho: "/projetos", nome: "projetos", espera: { ".iniCard": TOTAL }, capas: TOTAL },
  { caminho: "/categoria/esconder", nome: "categoria", espera: { ".iniCard": ESCONDER }, capas: ESCONDER },
  { caminho: "/perfil", nome: "perfil", espera: {}, capas: 0 },
];

const falhas = [];
const navegador = await chromium.launch();

for (const rota of ROTAS) {
  for (const vp of VIEWPORTS) {
    const pagina = await navegador.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    const errosConsole = [];
    pagina.on("pageerror", (e) => errosConsole.push(e.message));
    await pagina.goto(url + rota.caminho, { waitUntil: "networkidle" });

    const m = await pagina.evaluate(() => {
      const doc = document.documentElement;
      const estouram = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
      const alvosPequenos = [...document.querySelectorAll("a, button")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.height < 32;
        })
        .map((el) => {
          const nome = `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`;
          return `${nome}(${Math.round(el.getBoundingClientRect().height)}px)`;
        });
      // A navegação não pode cobrir a marca.
      // ⚠️ Medir os ITENS, não .navBarra: no PC a barra ocupa a faixa inteira
      // do cabeçalho (é pointer-events:none, com os itens à direita), então a
      // caixa dela cruza a marca sem cobrir nada. Medir o contêiner dava um
      // falso positivo em todas as telas grandes.
      const marca = document.querySelector(".iniMarca")?.getBoundingClientRect();
      const navSobreMarca = !!marca && [...document.querySelectorAll(".navItem")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < marca.bottom && r.bottom > marca.top &&
               r.left < marca.right && r.right > marca.left;
      });
      return {
        rolagemLateral: doc.scrollWidth > window.innerWidth + 1,
        scrollWidth: doc.scrollWidth,
        altura: doc.scrollHeight,
        estouram: [...new Set(estouram)].slice(0, 3),
        alvosPequenos,
        navSobreMarca,
      };
    });

    const contagens = {};
    for (const [seletor, esperado] of Object.entries(rota.espera)) {
      const achou = await pagina.locator(seletor).count();
      contagens[seletor] = achou;
      if (achou !== esperado) {
        falhas.push(`${rota.nome}/${vp.nome}: ${achou} ${seletor}, esperado ${esperado}`);
      }
    }

    const imagens = await pagina.locator("img").count();
    const capas = pagina.locator(".iniMiniImagem");
    const capasEncontradas = await capas.count();
    if (capasEncontradas !== rota.capas)
      falhas.push(`${rota.nome}/${vp.nome}: ${capasEncontradas} capas, esperado ${rota.capas}`);
    if (capasEncontradas > 0) {
      await capas.first().scrollIntoViewIfNeeded();
      const primeiraCarregou = await capas.first().evaluate((img) =>
        img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0,
      );
      if (!primeiraCarregou)
        falhas.push(`${rota.nome}/${vp.nome}: primeira capa não carregou`);
    }

    if (m.rolagemLateral)
      falhas.push(`${rota.nome}/${vp.nome}: rolagem lateral (${m.scrollWidth} > ${vp.width}) — ${m.estouram.join(", ")}`);
    if (errosConsole.length)
      falhas.push(`${rota.nome}/${vp.nome}: erro de console — ${errosConsole[0]}`);
    if (m.navSobreMarca)
      falhas.push(`${rota.nome}/${vp.nome}: a navegação está sobre a marca`);
    if (vp.width <= 420 && m.alvosPequenos.length > 0)
      falhas.push(`${rota.nome}/${vp.nome}: alvo de toque < 32px — ${m.alvosPequenos.join(", ")}`);

    const detalhe = Object.entries(contagens).map(([s, n]) => `${s.replace(".", "")}=${n}`).join(" ");
    console.log(
      `${rota.nome.padEnd(10)} ${vp.nome.padEnd(10)} ${String(vp.width).padStart(4)}px  ` +
      `${detalhe.padEnd(14)} altura=${String(m.altura).padStart(5)} ` +
      `lateral=${m.rolagemLateral ? "SIM" : "nao"} img=${imagens}`,
    );
    await pagina.close();
  }
}

await navegador.close();

if (falhas.length) {
  console.error(`\nFALHOU (${falhas.length}):`);
  for (const f of falhas) console.error(`  · ${f}`);
  process.exitCode = 1;
} else {
  console.log("\ntelas OK");
}

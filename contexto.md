# Estado do projeto — móveis 3D para gatos

Última atualização: **8 de setembro de 2026**. Este documento é auto-suficiente:
ao retomar, ler ele + `CLAUDE.md` + `gpt.md` + `catalogo-revisado.md`.
Backup da versão longa anterior em `contexto.md.bak-pre-resumo`.

---

## 1. O que é o projeto

Área de membros / infoproduto com projetos de marcenaria para gatos. O
comprador é marceneiro/maker. Cada projeto entrega, na área, um **modelo 3D
navegável** de um móvel + uma ficha visual.

A parte técnica (lista de corte, plano de chapa, lista de compras, passo a
passo) **ainda não foi reconstruída** e não é o foco agora.

## 2. Método atual (validado, não mexer sem decisão explícita)

O motor geométrico por código antigo (`CaixaParametrica`, compositor de
circuito, `lib/construtor/`, `lib/3d/`) foi **abandonado** — nunca convergiu
para resultado visual aceitável. Não recriar.

O que substitui, e funciona:

```
especificação → imagem de referência (Tripo text-to-image, seedream_v5, 2K)
             → GLB (Tripo image-to-3D, v3.1-20260211, textura padrão + PBR)
             → visualizador React Three Fiber
             → página individual na área
```

**Princípio que não mudou:** imagem/GLB de IA **nunca é fonte de medida de
corte**. Serve só para aprovação visual de forma. Nada é "pronto para
fabricação" sem engenharia + protótipo físico (não iniciados).

## 3. O fluxo de trabalho: PRODUÇÃO POR BLOCO

Um "bloco" = um grupo do `catalogo-revisado.md`, normalmente uma categoria
(A–L) ou uma família nova.

**Dentro do bloco, para cada projeto, SEM PARAR entre eles:**
1. reduzir o móvel a componentes contáveis e inequívocos;
2. escrever prompt de referência (ver seção 5) — **uma única imagem**, sem retry;
3. inspecionar a imagem e registrar o que se vê;
4. converter em GLB (mesmos parâmetros sempre — ver seção 6);
5. inspecionar a prévia do GLB e registrar;
6. copiar `model.glb` + `preview.png` para `public/modelos/<slug>/`;
7. criar wrapper de visualizador + página individual + card na listagem;
8. `npm run validar` + `npm run build`.

**No fim do bloco:**
9. subir `npm run dev` (porta **3000**), checar todas as rotas do bloco por
   HTTP + screenshot real (Playwright, rodar o `.cjs` a partir da raiz do
   projeto para resolver a dependência);
10. entregar UM relatório do bloco (projetos, créditos por etapa, saldo,
    defeitos, rotas, tsc/build);
11. **parar e esperar aprovação humana antes do próximo bloco.**

**Regras:**
- Informar o teto do bloco inteiro (35 × nº de projetos) ANTES de começar.
- Sem retry automático. Imagem ou GLB ruim: registrar o defeito, seguir, e
  pedir autorização de retry no relatório de fim de bloco.
- Não emendar um bloco no seguinte sem o OK humano.
- Nunca expor a API key do Tripo.

## 4. ONDE ESTAMOS (8 de setembro de 2026)

**15 projetos publicados**, no ar em `http://localhost:3000/projetos`,
aguardando checkpoint. Saldo Tripo: **1.405 / 2.000 créditos**.

| bloco | projetos (slug de rota) | status |
|---|---|---|
| **K — Torres** | `arvore-compacta-2-niveis` (039, piloto) · `arvore-media-3-niveis` (040) · `torre-alta-vertical` (041) | ✅ completo |
| **I — Arranhadores retos** | `painel-arranhador-parede` (031) · `painel-arranhador-canto` (032) · `poste-arranhador-chao` (033) · `poste-arranhador-plataforma` (034) · `arranhador-cunha` (035) · `arranhador-banco` (036) | ✅ completo |
| **E+F — Nichos-túnel** | `nicho-tunel-retangular` (013) · `nicho-tunel-entrada-angulo` (015) · `nicho-tunel-saida-topo` (E4) · `casinha-suspensa-telhado` (022) | ✅ 4 de 5 |
| **NA — Nichos abertos** (família nova, do desenho do usuário) | `nicho-aberto-parede` (NA1) · `nicho-aberto-canto` (NA2) | ✅ 2 de 3 |

Regra da família E+F: entrada nunca na frente (entra por uma lateral, sai
pela lateral oposta ou pelo topo). Regra da família NA: frente + as duas
laterais abertas, fundo e piso fechados, teto com um furo; estrutura por
montantes de canto.

Defeito recorrente do Tripo: furo em painel de topo sai com mancha
cobre/rosé na borda (E4, NA2) — cosmético, anotado no aviso da página.
Postes de sisal às vezes saem parecidos com madeira clara na conversão.

## 5. O QUE FAZER NOS PRÓXIMOS BLOCOS

Confirmar com o usuário qual bloco e o teto de créditos, então rodar pelo
fluxo da seção 3.

| bloco | categoria | nº | teto créditos |
|---|---|--:|--:|
| retry E2 | `nicho-tunel-janela-redonda` (014) — a frente saiu ABERTA em vez de parede sólida com furinho decorativo | 1 | 35 |
| **G** | Plataformas de descanso (G1 prateleira simples, G2 com borda, G3 mirante de janela) | 3 | 105 |
| **C+D** | Poste de ligação entre 2 níveis + Painel modular de escalada | 2 | 70 |
| **A** | Subida de parede (A1 degraus, A2 escada canto, A3 zigue-zague, A4 passarela, A5 recorte reto, A6 rampa idoso) | 6 | 210 |
| **B** | Pontes (B1 ripas+corda, B2 tecido reforçado) | 2 | 70 |
| **H** | Descanso em tecido (H1 rede parede, H2 cama tensa, H3 cama concha laterais retas) | 3 | 105 |
| **L** | Utilitários (L1 comedouro simples, L2 duplo, L3 estação porta-ração, L4 estação compacta) | 4 | 140 |
| **J1** | Protetor de canto de sofá em sisal (sob medida) | 1 | 35 |

Sugestão de ordem: G → C+D → A → B → H → L → J1 (+ retry E2 quando o usuário
autorizar). Bloqueados por composição (não fazer sem decisão): 016, 018, 020,
021, 030, 042, 043, 044, 046.

## 6. ESTILO DE PROMPT (o que está funcionando — 0 retry no bloco I)

**Regra de ouro:** descrever o móvel INTEIRO no prompt — cada peça, a
quantidade exata, o material, a posição relativa, como as peças se conectam,
e a lista explícita do que a IA NÃO pode inventar. A IA precisa conseguir
imaginar o móvel todo só com o texto. Isso evita desperdício de crédito.

### Prompt de imagem (text-to-image), em inglês, nesta ordem:

1. **Abre:** `Isolated studio product reference render for an AI 3D model of a <nome e função do móvel> for real woodworking.`
2. **Objeto e material:** nome concreto, `light birch plywood`, espessura
   (`about 18 mm`), `visible plywood layers on the edges`.
3. **Enumera cada peça** com contagem (`one`, `exactly two`, `three`), forma
   (`square`, `rectangular`, `straight`, `cylindrical`, `90-degree`), e
   posição relativa (`in the exact center`, `on the left`, `on top of`,
   `joined along one long edge`).
4. **Sisal:** `the whole front face covered with tightly wound natural beige
   sisal rope in straight horizontal rows, no gaps, no bare wood showing`.
5. **Plausibilidade:** `clean simple construction, straight edges, realistic
   proportions, fixed angle` (nada de `organic`/`flowing`/`curved` em móvel reto).
6. **Câmera + cenário:** `three-quarter front view showing <faces que
   importam>, centered, pure white background, soft even studio lighting,
   soft contact shadow`.
7. **Exclusões explícitas:** `no cat, no room, no text, no logo` + o que
   aquele móvel específico tende a ganhar de errado (`no cushion`, `no front
   opening`, `no second post`, `no curved parts`, `no extra holes`, etc.).

### Prompt de reforço (image-to-3D): versão curta

`<nome e função>: <componentes obrigatórios com contagem e posição>, <2–3
exclusões principais>.` A imagem carrega a maior parte; o texto só reforça
forma, contagem e ausência de peça extra.

### Exemplos reais que deram certo (bloco I)

- **Painel de parede:** `one flat rectangular plywood board standing
  vertically, the whole front face covered with tightly wound horizontal
  sisal rope, bare flat plywood back, four small screw holes near the
  corners, no base, no post, no legs, no shelf.`
- **Poste de chão:** `three parts: one square plywood base on the floor, one
  straight vertical central cylindrical post fully wrapped in spiral sisal
  rope, one small round plywood cap disc on top, straight vertical, no
  platform, no shelf, no second post.`
- **Cunha:** `one solid right-triangle plywood wedge on the floor, flat
  bottom, short vertical back face, long sloped top face at about 30 degrees
  covered with sisal rope, bare plywood triangular sides, fixed angle, no
  curve, no legs, no post, no platform.`

### Regra permanente de conteúdo

Ferragem (mão-francesa, cantoneira, flange), sisal e rede: **sempre material
comprado à parte**, aparecem no visual mas nunca em plano de corte. A madeira
(chapa/base/poste/cunha/moldura) é o que seria cortado.

## 7. Parâmetros técnicos fixos

**CLI Tripo:** `tripo.cmd` (Windows/PowerShell — `.cmd`, não `tripo`),
instalado global, autenticado por perfil. Checar saldo: `tripo.cmd doctor --json`.

**Imagem (5 créditos):**
```
tripo.cmd generate text-to-image --model seedream_v5 -o "public/modelos/<slug>/referencia" -p "size=2K" -p "output_format=png" --yes --no-open --json --quiet --timeout 180 "<prompt>"
```

**GLB (30 créditos):**
```
tripo.cmd generate image-to-model "<caminho da generated_image.png>" --model v3.1-20260211 --prompt "<prompt curto>" -o "public/modelos/<slug>/modelo" -p "texture=true" -p "pbr=true" -p "texture_quality=standard" -p "geometry_quality=standard" -p "orientation=align_image" -p "auto_size=false" -p "export_uv=true" --yes --no-open --json --quiet --timeout 360
```
Nunca usar textura HD, quad mesh, smart low-poly, segmentação pela API do Tripo
ou retopologia sem autorização específica (mudam o custo). A segmentação local
do GLB já baixado não consome créditos e é usada pelo visualizador técnico.

**Total por projeto em 1 tentativa por etapa: 35 créditos.**

## 8. Estrutura de arquivos

```
public/modelos/<slug>/
  model.glb              ativo estável (~38–42 MB)
  preview.png            ativo estável
  referencia/tripo-out/  saída original do CLI (imagem)
  modelo/tripo-out/      saída original do CLI (GLB)
  (014-nicho-tunel-janela-redonda existe mas NÃO está publicado — defeito)

app/projetos/
  page.tsx               listagem, uma <section> por família
  <slug>/page.tsx        entrada fina que informa somente o slug
  pagina-projeto.tsx     cabeçalho, resumo e segurança reutilizáveis
  experiencia-tecnica.tsx  modos Visual/Peças/Explodida/Montagem
  visualizador-modelo.tsx  Canvas R3F genérico, reutilizável por prop `src`;
                           knobs opcionais: margem, distMin, distMax

lib/projetos-tecnicos.ts catálogo com 40 medidas sugeridas, peças e custos

app/inicio.css            estilos do card (.ini*) e da página (.proj*)
```

Visualizador: `@react-three/fiber` + `@react-three/drei` (`useGLTF`,
`Bounds fit clip`, `Center`, `OrbitControls`). `<Bounds>` dirige câmera e
alvo — **não** passar `target` fixo ao OrbitControls (quebra o enquadramento
de móvel alto). Único ajuste por projeto: `margem` (1.3 caixa baixa, 1.5+
móvel alto).

Template de página: header com "Voltar aos projetos" + `PROJETO <id>` +
título, dimensões gerais sugeridas, dificuldade, tempo e pessoas. O motor comum
oferece visual realista, peças, explosão, montagem, custos, CSV, impressão e
notas. Não existe mais selo de validação nas páginas.

Card na listagem: `<article class="iniCard">` com `preview.png`, `iniNum`,
`iniTitulo`, `iniFuncao`, `iniDescricao`, dimensões gerais sugeridas, família e
`iniAbrirProjeto`. A listagem não carrega Canvas ou GLB.

## 9. Comandos

```
npm run validar   # tsc --noEmit
npm run build
npm run dev        # http://localhost:3000
```

Bash come crases/escapes — usar Write/Edit para arquivos, não `node -e`.
Não confiar em HTTP 200: tirar screenshot real quando o navegador permitir.
Se o usuário disser que algo está errado, PARAR e perguntar antes de reescrever.

# Catálogo revisado — filtrado pelo que o motor consegue construir de verdade

7 de setembro de 2026, fim do dia. Este documento **filtra** a lista original
de 50 projetos usando os critérios que a sessão de hoje deixou comprovados —
não hipóteses, defeitos vistos na tela e corrigidos (ou não corrigíveis).

⚠️ Este catálogo é sobre **forma e trajeto**. Ele NÃO resolve a decisão de
método registrada em `gpt.md` (abandonar geometria por código, estudar
imagem→3D). Serve para quando essa decisão for tomada: aqui já está separado
o que é fisicamente coerente do que nunca foi.

---

## Critérios de corte aplicados

1. **Forma orgânica** (tronco natural, espiral orgânica, curva "suave" livre)
   → removida. Não nasce de aritmética; é exatamente o tipo de forma que
   travou a sessão de hoje.
2. **Entrada de nicho pela frente** → removida ou reescrita como túnel
   (entra de um lado, sai do outro — nunca pela frente). Contradiz a correção
   feita hoje em `nicho.ts`.
3. **Duplicidade sem variação construtiva real** (mesma peça, altura/contagem
   diferente) → mesclada num projeto paramétrico só.
4. **Móvel utilitário sem trajeto** (comedouro, porta-ração) → mantido como
   categoria separada, à parte dos módulos de percurso (degrau/nicho/ponte).
5. **Peça sem entrada nem saída de percurso, mas com apoio físico real**
   (arranhador de chão, prateleira simples) → mantida; não precisa de
   trajeto de subida para ser um móvel válido.

---

## A. Módulos de subida/passagem (parede) — 6 projetos

Consolida 6 dos antigos (001–006) em módulos parametrizados por contagem e
forma, não por projeto separado.

| # | nome | o que muda do original | por quê |
|---|---|---|---|
| A1 | Degraus Escalonados de Parede | 001+002 fundidos, contagem de 2 a 5 é parâmetro | mesma peça, mesmo módulo — a "versão de 3" e "de 4" eram o mesmo degrau |
| A2 | Escada de Canto | 003, sem alteração de forma | ângulo de 90° é aritmético, direto |
| A3 | Escada em Zigue-Zague de Parede | 004, deslocamento lateral vem de régua física, não de estética | é o mesmo defeito que o Circuito 1 teve — precisa nascer de `avancoLateral`, não de zigue-zague livre |
| A4 | Passarela Reta | 005, sem alteração | tábua contínua, sem recorte — o caso mais simples |
| A5 | Passarela com Recorte Reto (não curva) | 006, **forma alterada**: curva suave vira recorte reto anguloso | curva suave livre não é aritmética; um desvio de 45°/90° é |
| A6 | Rampa de Acesso (gato idoso) | 009, sem alteração | inclinação é ângulo fixo, cálculo direto — já existe `GATO_IDOSO` no motor |

**Removido desta categoria:** nenhum — todos os 6 sobrevivem, com A3 e A5
precisando de correção de método antes de valer, não de remoção.

---

## B. Travessias flexíveis — 2 projetos

| # | nome | observação |
|---|---|---|
| B1 | Ponte Suspensa de Ripas com Corda | 007. Já é o `MODULO_PONTE` de hoje — ripas + correia, nunca tábua única. Validado. |
| B2 | Ponte Flexível de Tecido Reforçado | 008. Tecido é sempre item comprado (regra permanente); a moldura de madeira é o que entra no corte. |

---

## C. Ligação vertical — 1 projeto

| # | nome | o que mudou |
|---|---|---|
| C1 | Poste de Ligação entre Dois Níveis | 010, sem alteração — cilindro reto revestido em sisal, medida direta |

**Removido:** 011 (Coluna de Sisal do Chão ao Teto) — **não removida por
forma**, a coluna reta é aritmética simples. Removida porque é a MESMA peça
que C1, só maior e sem o segundo apoio de prateleira. Vira parâmetro de altura
de C1, não projeto novo.

---

## D. Painel de escalada — 1 projeto

| # | nome | observação |
|---|---|---|
| D1 | Painel Modular de Escalada com Apoios | 012, sem alteração — apoios são blocos retangulares em grade, posição paramétrica |

---

## E. Nichos-túnel (nunca entrada pela frente) — 4 projetos

⚠️ Esta é a categoria mais reescrita. A sessão de hoje corrigiu o modelo
mental: **o nicho é sempre um túnel, entra de um lado e sai do outro; a
frente nunca é entrada, só pode ter janela decorativa.**

| # | nome | o que virou | por quê |
|---|---|---|---|
| E1 | Nicho Túnel Retangular | 013, sem alteração — já era túnel de verdade nas duas pontas | é o módulo `tunel-lateral` de hoje, direto |
| E2 | Nicho Túnel com Janela Frontal Redonda | 014, **reescrito**: o furo redondo deixa de ser a entrada e vira janela na frente; a entrada real continua nas duas pontas laterais | 014 original tinha entrada frontal + saída oposta — é o exato bug corrigido hoje (entrada nunca na frente) |
| E3 | Nicho Túnel com Entrada em Ângulo | 015, sem alteração de princípio — entra por uma face lateral, sai pela oposta em ângulo diferente | já respeita "nunca pela frente"; só precisa de mais um eixo de abertura no módulo |
| E4 | Nicho Túnel com Saída no Topo | não existia nos 50 — é o módulo `tunel-vertical` criado hoje (entra pela lateral, sai por furo no telhado) | prova real, já testada e aprovada nesta sessão |

**Removidos desta categoria:**
- **016 (Nicho de Canto Triangular)** — a "abertura voltada para o centro do
  cômodo" é frontal, mesmo bug do 014. Reescrever como canto-túnel é possível
  mas é projeto novo, não este; fica pendente.
- **017 (Nicho Hexagonal Suspenso)** — forma hexagonal não é um dos eixos que
  `CaixaParametrica` resolve hoje (ela pensa em 6 faces retangulares). Não é
  "impossível", é fora do escopo atual do motor.
- **018 (Nicho Treliçado de Ripas)** — as laterais viram ripas espaçadas, não
  chapa. É outra família de módulo (parecida com a ponte, ripas + vão), não
  o nicho-caixa. Fica pendente de módulo próprio.
- **019 (Nicho Jumbo)** — não é forma nova, é escala; já coberto por
  parâmetro de tamanho em E1, não merece projeto próprio.
- **020/021 (Nichos comunicantes horizontal/vertical)** — interessante e
  real (é o padrão dos vídeos, "nichos interligados por furos"), mas depende
  de **compositor de circuito**, que é justamente a parte que travou hoje.
  Fica pendente até o método de composição estar resolvido.

---

## F. Abrigo com telhado — 1 projeto

| # | nome | observação |
|---|---|---|
| F1 | Casinha Suspensa com Telhado (dois planos) | 022, **entrada precisa virar lateral ou a caixa vira túnel** — telhado de duas águas como plataforma continua válido, só a porta frontal precisa da mesma correção da categoria E |

---

## G. Plataformas de descanso — 3 projetos

| # | nome | observação |
|---|---|---|
| G1 | Prateleira de Descanso Simples | 023, sem alteração — já é `MODULO_PRATELEIRA` variante `descanso` |
| G2 | Prateleira de Descanso com Borda | 024, borda é chapa adicional nas 3 faces, aritmética direta |
| G3 | Mirante de Janela | 025, mesma prateleira ajustada à cota do parapeito — parâmetro de altura, não peça nova |

---

## H. Descanso em tecido — 3 projetos

| # | nome | observação |
|---|---|---|
| H1 | Rede Suspensa de Parede | 026, moldura de madeira entra no corte; tecido é comprado |
| H2 | Cama Suspensa em Tecido Tenso | 027, mesma lógica de H1, tensão diferente — mesmo módulo, parâmetro de tensão/fixação |
| H3 | Cama Concha com Laterais Elevadas | 029, laterais curvas → **substituir por laterais anguladas retas** (a curva livre é o mesmo problema do item A5) |

**Removido:** 028 (Cama Curva tipo Wave) — curva contínua de madeira dobrada
não é aritmética simples; é a mesma classe de forma orgânica removida em
outras categorias. **Removido:** 030 (Beliche Suspenso) — depende de dois
H1/H2 empilhados com acesso lateral, que é composição de circuito (mesmo
problema de 020/021). Fica pendente.

---

## I. Arranhadores retos — 6 projetos

Toda forma aqui é reta ou angular fixa — nenhuma removida.

| # | nome | observação |
|---|---|---|
| I1 | Painel Arranhador de Parede | 031, chapa plana revestida, sem alteração |
| I2 | Painel Arranhador de Canto (90°) | 032, ângulo fixo, aritmético |
| I3 | Poste Arranhador de Chão | 033, cilindro reto sobre base, sem alteração |
| I4 | Poste Arranhador com Plataforma | 034, mesmo poste + prateleira no topo — parâmetro, não peça nova |
| I5 | Arranhador Inclinado tipo Cunha | 035, ângulo fixo de cunha, aritmético |
| I6 | Arranhador Horizontal tipo Banco | 036, bloco retangular baixo, sem alteração |

**Removido:** 037 (Arco Arranhador Curvo) — arco curvado é forma orgânica,
mesmo critério de corte da categoria H.

---

## J. Acessório de mobília existente — 1 projeto

| # | nome | observação |
|---|---|---|
| J1 | Protetor de Canto de Sofá em Sisal | 038, peça em L simples, sem alteração — mas **depende da medida real do sofá do comprador**, então o "plano de corte" aqui é sob medida, não catálogo fixo. Marcar isso na ficha do produto. |

---

## K. Torres/composições multiníveis (parede ou piso) — 3 projetos

Esta era a categoria com mais problema: a maioria dos "43 a 46" originais
depende do compositor de circuito, que reprovou hoje. Só ficam os que são
literalmente uma pilha vertical simples, sem trajeto de percurso decidido
por zigue-zague livre.

| # | nome | observação |
|---|---|---|
| K1 | Árvore Compacta 2 Níveis | 039, poste + 2 plataformas, sem trajeto zigue-zague — é literalmente ligação vertical (C1) mais 2 prateleiras (G1), aritmético direto |
| K2 | Árvore Média 3 Níveis | 040, mesma lógica de K1 com um nível a mais — parâmetro de contagem, não peça nova |
| K3 | Torre Alta Vertical | 041, pilha compacta reta, sem deslocamento lateral livre — mais simples que K1/K2 porque não zigueza-gueia |

**Removidos:**
- **042 (Árvore de Canto)** — depende de recorte de base ajustado a duas
  paredes reais; possível, mas é projeto sob medida como J1, não catálogo
  fixo. Pendente.
- **043 (Torre com Toca e Plataformas)** — a "toca no meio" é o mesmo nicho
  da categoria E; tecnicamente é K2 + E1 combinados, que é composição de
  circuito. Pendente do método de composição.
- **044 (Torre Dupla com Ponte)** — duas torres + ponte é *exatamente* o
  Circuito 1 que travou nesta sessão (múltiplos elementos, arranjo decidido
  pelo motor). Pendente.
- **045 (Árvore em Espiral)** — forma orgânica, removida pelo critério 1.
- **046 (Playground Vertical Multi-Gatos)** — o maior e mais complexo dos
  50, soma de várias torres + toca + rede + ponte. É o problema do dia
  inteiro multiplicado. Pendente até o método de composição funcionar.

---

## L. Móveis utilitários (sem trajeto de gato) — 4 projetos

Mantidos como categoria à parte, por decisão do usuário: são simples de
validar (caixa com recorte circular) e têm demanda real, mesmo sem serem
"módulo de percurso".

| # | nome | observação |
|---|---|---|
| L1 | Comedouro Elevado Simples | 047, sem alteração |
| L2 | Comedouro Elevado Duplo | 048, mesmo módulo de L1, parâmetro de contagem de potes |
| L3 | Estação de Alimentação com Porta-Ração | 049, sem alteração |
| L4 | Estação Compacta com Armazenamento | 050, mesma lógica de L3, formato vertical — parâmetro de proporção, não peça nova |

---

## Resumo da filtragem

| status | quantidade | o que significa |
|---|--:|---|
| **Sobrevive, sem alteração** | 21 | forma já aritmética, nenhum dos defeitos de hoje se aplica |
| **Sobrevive, com correção de método** | 6 | forma válida, mas precisa da correção de trajeto/entrada feita hoje (A3, A5, E2, F1, H3 e o novo E4) |
| **Fundido em parâmetro de projeto existente** | 9 | contagem/altura/tamanho, não peça nova (002→A1, 011→C1, 019→E1, 025→G3, 034→I4, 040→K2, 048→L2, 050→L4, e 041 dentro de K) |
| **Removido — forma orgânica** | 5 | 017, 028, 037, 045, e a curva de 006 virou A5 |
| **Removido/pendente — depende de composição de circuito** | 8 | 020, 021, 030, 042, 043, 044, 046, e o canto-túnel de 016 |
| **Total de projetos únicos na lista nova** | **~27** | 6 categorias de módulo (A–D, I) + nichos (E, F) + descanso (G, H) + acessório (J) + torres simples (K) + utilitários (L) |

Os 8 "pendentes por composição de circuito" (020, 021, 030, 042, 043, 044,
046, 016-canto) **não estão descartados** — estão bloqueados pela mesma
decisão de método registrada em `gpt.md`: o compositor que decide arranjo de
múltiplos elementos é exatamente o que não funcionou hoje. Quando essa parte
for resolvida (seja por código, seja pela nova direção de imagem→3D), esses
8 voltam à lista ativa primeiro — já têm forma e vídeo de referência
identificados.

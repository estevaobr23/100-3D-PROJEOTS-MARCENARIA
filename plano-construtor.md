# O Construtor — projetos gerados por física, não por desenho

## O diagnóstico

Os 36 modelos atuais são aprovados pelo validador e mesmo assim inúteis. Isso
não é contradição: o validador de hoje pergunta *"as peças fecham o envelope
e não se atravessam?"*. Ele nunca pergunta *"um gato consegue usar isso?"*.

Uma escada com degraus a 80 cm um do outro passa em todas as checagens atuais
— matematicamente perfeita, fisicamente inútil. É exatamente isso que produz
a sensação de "projeto irreal".

A causa raiz é a ordem do fluxo. Hoje:

```text
alguém escolhe um envelope  →  monta peças dentro dele  →  valida geometria
```

O envelope é chute. Tudo depois herda o chute.

## A inversão

```text
nome do projeto  →  arquétipo  →  regras do gato + ambiente  →  peças derivadas  →  rota validada
```

A máquina recebe **apenas o nome**. "Escada de Canto" já diz tudo que ela
precisa: níveis que alternam entre duas paredes de um canto. Quantos níveis,
a que altura, com que espaçamento, de que tamanho — nada disso é digitado.
Tudo sai das regras físicas do gato e do espaço disponível.

Nenhuma medida é escolhida por gosto. Toda medida tem uma razão citável.

## As 4 camadas

### 1. Regras do gato (`lib/construtor/gato.ts`)

Os números que governam tudo. Não são preferências — são as restrições que
transformam um arranjo qualquer num arranjo utilizável.

```text
salto vertical confortável       ~40 cm entre níveis (subida repetida, sem esforço)
salto vertical máximo            ~60 cm (usa, mas evita na rotina)
salto horizontal confortável     ~60 cm
salto horizontal máximo          ~120 cm
área mínima de pouso             30 × 25 cm (pousar e girar)
largura mínima de passagem       18 cm
altura livre sobre a cabeça      28 cm
inclinação máxima sem escorregar 35° (acima disso exige ripa antiderrapante)
carga de projeto                 6 kg (gato adulto grande) + fator de impacto no salto
```

⚠️ Estes valores são referência de projeto para gato doméstico adulto, e
ficam num arquivo só — mudar o público (gato idoso, filhote, gato gigante)
é mudar uma tabela, nunca 50 projetos.

### 2. Ambiente (`lib/construtor/ambiente.ts`)

Nenhuma peça flutua no vazio. O projeto nasce dentro de um cômodo declarado:

```text
parede de fundo    largura × altura reais
parede lateral     quando o projeto é de canto
piso               referência do chão, origem de toda rota
altura útil        até onde faz sentido instalar (teto, moldura, cortina)
```

Isso mata de raiz o defeito "prateleira flutuando sem parede de referência":
o construtor não sabe criar peça sem superfície de fixação.

### 3. Peça-primitiva com pontos de conexão (`lib/construtor/primitivas.ts`)

A mudança conceitual mais importante. Peça deixa de ser bloco e vira
**componente com interface declarada** — como peça de Lego, que só encaixa
onde faz sentido.

Cada primitiva declara:

```text
superfícies de pouso     onde o gato pode ficar em pé (altura, área, orientação)
pontos de fixação        onde ela prende (parede, piso, outra peça)
pontos de partida        de onde o gato salta pra próxima
obstrução                o volume que ela ocupa (pra não colidir com outra)
ferragem exigida         mão-francesa, flange, cantoneira — derivada do vão e da carga
```

Uma prateleira não é "50×30 cm". É "uma superfície de pouso de 50×30 a tal
altura, fixada na parede de fundo por 2 mãos-francesas dimensionadas pelo
balanço".

### 4. Verificador de rota (`lib/construtor/rota.ts`) — o coração

Grafo de alcance. Cada superfície de pouso é um nó (o chão é o nó de
origem). Existe aresta entre dois nós quando o salto entre eles cabe nos
limites do gato.

O laudo responde perguntas que hoje ninguém faz:

```text
· todo nível é alcançável a partir do chão?
· qual o caminho mais curto até o ponto mais alto?
· algum salto está na faixa "possível mas desconfortável"?
· existe rota de descida? (subir é mais fácil que descer — gato desce de ré
  ou pula; nível alto sem rota de descida confortável é armadilha)
· dois níveis brigam pelo mesmo espaço aéreo?
```

Projeto com nível isolado é **reprovado com o motivo exato**: "o nível 4 está
a 68 cm do anterior — acima do salto confortável de 40 cm".

## Como o nome vira móvel

Um interpretador determinístico (código, não IA) lê o nome e extrai:

```text
"Conjunto de 4 Degraus Escalonados"
  arquétipo:   niveis-de-subida
  quantidade:  4          (do numeral no nome)
  contexto:    parede de fundo
  modificador: escalonado (desloca lateralmente a cada nível)

"Escada de Canto"
  arquétipo:   niveis-de-subida
  quantidade:  derivada   (quantos cabem na altura útil com passo confortável)
  contexto:    canto (duas paredes)
  modificador: alterna a parede a cada nível

"Poste Arranhador com Plataforma Superior"
  arquétipo:   coluna-vertical
  contexto:    piso
  modificador: + plataforma no topo, + revestimento de sisal
```

Os 50 nomes atuais caem em **8 arquétipos**: níveis de subida, travessia
horizontal, caixa-abrigo, plataforma de descanso, coluna vertical, superfície
arranhável, composição multinível, móvel de serviço.

⚠️ São 8 coisas a construir bem, não 50. Cada arquétipo acertado se
multiplica por todos os projetos que o usam — a mesma lógica que fez 1
montador de painel destravar 13 projetos antes.

## Ordem de construção

1. **Regras do gato + ambiente** — a base de tudo, arquivo pequeno.
2. **Verificador de rota** — construído ANTES das primitivas, porque é ele
   que define o que uma primitiva precisa expor.
3. **Teste de regressão do problema atual**: alimentar o verificador com a
   Escada de Canto de hoje (níveis a 24,55 cm, mas sem contexto de alcance) e
   com um caso propositalmente ruim (níveis a 80 cm) — o segundo tem que
   reprovar. Sem esse teste, não sabemos se a régua nova mede alguma coisa.
4. **Arquétipo `niveis-de-subida`** — o mais visual, cobre degraus/escadas, e
   é onde a rota importa mais. Prova a máquina inteira ponta a ponta.
5. Demais arquétipos, um por vez, do que destrava mais projetos.

## O que muda no que já existe

- Os montadores de corte (`caixa.ts`, `painel.ts`, `poste.ts`) **continuam
  úteis**: eles sabem transformar "uma prateleira de tal tamanho" em peças com
  desconto de espessura correto. O construtor os usa como camada de baixo.
- O validador geométrico atual **continua**: ele garante que a peça é
  cortável. O verificador de rota é uma camada NOVA acima, não substituta.
- As receitas manuais em `receitas.ts` são **descartadas**: elas são o chute
  que estamos removendo. O construtor gera o que elas tentavam declarar.
- O mapa `projetos.ts` perde o campo `envelope` digitado — o envelope passa a
  ser resultado do construtor, não entrada dele.

## O que isso ainda NÃO é

- Não é engenharia estrutural certificada. Continua exigindo protótipo físico
  antes de qualquer projeto virar `pronto`.
- Não é simulação física com peso, atrito e tombamento. É verificação de
  alcance geométrico com margens de segurança declaradas.
- Não substitui julgamento humano sobre estética.

# Plano — 15 circuitos, e as peças derivadas deles

7 de setembro de 2026. Decisão tomada: o produto passa a ser construído como
**circuitos**, e as peças avulsas são **derivadas** deles, não construídas
separadamente.

---

## 1. Por que circuito é o caminho mais curto (não o mais longo)

A intuição diz que circuito é mais difícil que peça isolada. No nosso motor é o
contrário, e vale entender por quê antes de começar.

O motor de trajeto planeja **a sequência de pontos que o gato percorre** e só
depois posiciona as peças. Isso é o que ele sabe fazer, e é por isso que os 14
projetos que são circuitos funcionam.

Uma peça isolada não dá a ele nada para planejar. Um nicho sozinho é uma caixa:
sem entrada, sem saída, sem salto a verificar. Por isso os 36 projetos de peça
avulsa caem na receita antiga — a que empilha blocos sem verificar nada, e que
produz os móveis sem lógica.

**O mesmo nicho dentro de um circuito tem tudo que o motor precisa:** chega-se
nele a partir do degrau anterior, sai-se dele para a plataforma seguinte, o
telhado é pisável a uma altura conhecida.

Conclusão: não estamos aumentando a ambição. Estamos parando de pedir ao motor
a única coisa que ele não sabe fazer.

## 2. A aritmética do produto

Média medida nos 17 vídeos: **7,2 elementos por circuito real.**

```text
15 circuitos x 7,2 elementos = ~109 peças derivadas
```

Contra os 50 projetos atuais, dos quais 36 não passam por verificação física.

O comprador recebe **15 circuitos completos + as peças que os compõem**, todas
nascidas do mesmo percurso verificado. A contagem sobe, e a qualidade deixa de
ser desigual.

## 3. A regra que evita o erro de sempre

**Uma fonte de verdade.** O circuito é construído e validado; a peça avulsa é
uma *vista filtrada* dele, nunca uma construção paralela.

```text
Circuito 3 (parede, 8 elementos)
  └─ motor de trajeto valida o percurso inteiro
       │
       ├─ Degrau A   → projeto avulso (posição já verificada)
       ├─ Nicho B    → projeto avulso (função no trajeto declarada)
       ├─ Ponte C    → projeto avulso (vão já dimensionado)
       └─ Plataforma D → projeto avulso
```

Consequência prática: corrigir o circuito corrige todas as peças dele. Não
existe "a mesma prateleira com medida diferente em dois lugares".

---

## 4. O que já existe e será reaproveitado

| componente | estado | onde |
|---|---|---|
| régua física do gato | pronta, com regressão | `lib/construtor/gato.ts` |
| planejamento de subida (linear/orbital) | pronto | `lib/construtor/trajeto.ts` |
| travessia horizontal (ponte) | pronto | `trajeto.ts:planejarTravessia` |
| verificador de rota em grafo | pronto | `lib/construtor/rota.ts` |
| papéis de ponto do circuito | **já existem no tipo** | `PontoTrajeto.papel` |
| ferragem por carga | pronta | `lib/construtor/ferragem.ts` |
| filtro de ferragem incoerente | pronto | `coerencia-ferragem.ts` |
| validador geométrico | pronto | `lib/3d/validador.ts` |
| ponte de ripas + correia | pronta | `arquetipos/torre-circuito.ts` |
| parâmetros reais de vídeo | 17 vídeos consolidados | `analise-videos/conhecimento/` |

Os seis papéis que um circuito precisa **já estão declarados** no tipo:

```ts
papel: "entrada" | "passagem" | "descanso" | "abrigo" | "travessia" | "topo"
```

Isso significa que a estrutura de dados do circuito existe. Falta o construtor
que **compõe vários trechos** num percurso só.

## 5. O que falta construir

### 5.1 Compositor de circuito (o núcleo novo)

`lib/construtor/circuito.ts` — recebe uma topologia (que trechos, em que
ordem, com que elementos) e devolve um percurso único e verificado.

Precisa saber encadear:

- **subida** (já existe: `planejarSubida`)
- **travessia** (já existe: `planejarTravessia`)
- **abrigo** — nicho/casinha cujo telhado é degrau do percurso (novo)
- **descanso** — plataforma larga, destino e não passagem (novo)
- **descida** — caminho de volta ao chão, que hoje ninguém verifica (novo)

A regra de ouro: a saída de um trecho é a entrada do seguinte. O verificador
confere o percurso **inteiro**, não trecho por trecho.

### 5.2 Derivador de peça

`lib/construtor/derivar-peca.ts` — extrai um elemento do circuito como projeto
autônomo, carregando junto:

- posição e medidas já verificadas;
- função no trajeto ("é o 3º ponto, recebe o gato do degrau a 58 cm e entrega
  para a plataforma a 92 cm");
- ferragem já dimensionada para a carga daquele ponto;
- de qual circuito veio (para o comprador poder montar o conjunto depois).

### 5.3 Cotas de medida no 3D — **isto não existe hoje**

Você pediu: o cliente dá zoom, vê a isometria e **vê as medidas**. Verifiquei:
a tela hoje não desenha cota nenhuma. É trabalho novo, e é o que transforma o
3D de ilustração em desenho técnico.

Mínimo necessário:

- cota de altura de cada nível (do chão);
- cota de largura e profundidade de cada peça;
- cota de vão entre elementos (o número que o marceneiro confere ao instalar);
- as cotas aparecem na isometria e nas vistas ortográficas, sem poluir.

---

## 6. Ordem de execução

### Etapa 1 — Um circuito de prova, ponta a ponta

Antes de escalar para 15, um circuito precisa atravessar **todo** o caminho:

```text
topologia (de um vídeo real)
  → compositor monta o percurso
  → verificador aprova a rota inteira (ida e volta)
  → 3D navegável com zoom e isometria
  → cotas de medida na tela
  → lista de corte + plano de chapa + montagem
  → deriva as ~8 peças avulsas
```

Se travar, travamos com 1 e não com 15. Se passar, os outros 14 são repetição
de um caminho já provado.

**Escolha do primeiro:** circuito de parede, que é o caso com mais vídeo (9 dos
17) e o que o motor já cobre melhor.

### Etapa 2 — Os 14 restantes

Cada um sai de um vídeo real como referência de topologia (quantos níveis, onde
entra o nicho, onde fica a ponte). O motor calcula todas as medidas; o vídeo dá
só o arranjo.

Distribuição pelos vídeos que temos:

| instalação | vídeos disponíveis | circuitos previstos |
|---|--:|--:|
| parede | 9 | 7 |
| canto | 3 | 3 |
| piso (torre/árvore) | 5 | 5 |

### Etapa 3 — Derivação das peças

Só depois dos circuitos validados. É filtragem, não construção — deve ser a
etapa mais barata das três.

---

## 7. Limites honestos deste plano

- **O viés dos vídeos.** Dos 17, 16 são torres ou circuitos de parede. Nicho e
  arranhador aparecem *dentro* dos circuitos, mas não temos vídeo dedicado a
  eles. Os circuitos vão refletir esse viés.
- **Descida não é verificada hoje.** O verificador confere se o gato **sobe**.
  Um circuito completo precisa garantir que ele **desce** — e gato desce por
  caminho diferente do que sobe. Isso é regra nova a escrever.
- **Cotas no 3D são trabalho novo**, não ajuste. É a parte que menos podemos
  estimar por analogia com o que já foi feito.
- **Nada vira "pronto" sem protótipo físico.** Continua valendo.

## 8. O que muda para o comprador

Antes: 50 projetos de peça avulsa, dos quais 36 sem verificação física.

Depois: 15 circuitos completos (cada um com 5 a 12 elementos) mais as peças que
os compõem, todas com percurso verificado, medida justificada e ferragem
dimensionada. O marceneiro vê o conjunto montado, entende como o gato usa, e
pode construir o circuito inteiro ou só uma peça dele.

# Catálogo novo — 15 circuitos derivados de instalações reais

7 de setembro de 2026. Este catálogo **substitui** os 50 projetos anteriores.
"Torre Dupla com Ponte de Ligação", "Escada em Zigue-Zague de Parede" e os
outros 48 deixam de existir como projetos.

Cada circuito abaixo nasce de um vídeo real analisado, não de invenção. A
coluna "fonte" aponta o vídeo que serviu de referência de **topologia** — o
arranjo dos elementos. Todas as **medidas** continuam saindo da aritmética do
motor, nunca do vídeo.

---

## 1. O vocabulário de elementos

Analisando as 17 instalações reais, os mesmos poucos elementos se recombinam.
Este é o vocabulário completo que o motor precisa saber construir:

| elemento | papel no trajeto | o que é | visto em |
|---|---|---|---|
| **degrau** | passagem | tábua pequena (~20x18cm), fixa na parede | 14 de 17 |
| **plataforma** | descanso | tábua grande (~50x35cm), o gato deita | 15 de 17 |
| **nicho** | abrigo | caixa fechada; o telhado é degrau | 8 de 17 |
| **ponte** | travessia | ripas sobre correia, liga dois patamares | 5 de 17 |
| **poste** | atalho vertical | sisal; sobe direto sem degraus | 9 de 17 |
| **rede** | descanso | tecido tenso entre dois apoios | 4 de 17 |
| **rampa** | passagem contínua | sobe andando, não salta | 3 de 17 |

Materiais recorrentes: **corda de sisal (8x)**, pinus (4x), compensado ou MDF
(5x), lona/tecido para rede e ponte.

Ferragem recorrente: mão-francesa (metal e madeira), parafuso passante com
bucha, cantoneira oculta sob forração, parafuso prisioneiro para poste.

## 2. O padrão que se repete

Em praticamente todas as instalações de parede o percurso é o mesmo:

```text
chão → degraus de acesso → plataforma intermediária
     → nicho ou rede no meio do caminho
     → travessia (ponte) entre patamares
     → plataforma alta de observação (o destino)
     → descida por caminho alternativo
```

O poste de sisal, quando existe, é **atalho**: sobe direto do chão a um
patamar, encurtando o percurso para o gato que tem pressa.

---

## 3. Os 15 circuitos

### Parede (7 circuitos)

| # | nome | elementos | fonte |
|---|---|--:|---|
| 1 | Circuito de Parede Essencial | 6 | vídeo 5 — prateleiras escalonadas + poste + nicho |
| 2 | Circuito de Parede com Ponte de Ripas | 8 | vídeo 1 — degraus + ponte articulada + descanso |
| 3 | Circuito de Parede com Rede de Descanso | 8 | vídeo 17 — nichos + rede suspensa + zigue-zague |
| 4 | Circuito de Parede com Duplo Nicho | 9 | vídeo 4 — nichos no topo + arranhador inclinado |
| 5 | Circuito de Parede sobre o Sofá | 7 | vídeo 2 — suspenso, corda com nós, ponte curva |
| 6 | Passarela de Observação Alta | 7 | vídeo 6 — prateleiras em linha contínua no alto |
| 7 | Circuito de Vão de Escada | 6 | vídeo 14 — aproveita pé-direito duplo |

### Canto (3 circuitos)

| # | nome | elementos | fonte |
|---|---|--:|---|
| 8 | Circuito de Canto Compacto | 6 | vídeo 10 — escada alternada + casinha + cama |
| 9 | Circuito de Canto com Nichos | 12 | vídeo 12 — duas paredes, nichos vazados, pontes |
| 10 | Torre de Canto em Espiral | 5 | vídeo 11 — plataformas em espiral orgânica |

### Piso (5 circuitos)

| # | nome | elementos | fonte |
|---|---|--:|---|
| 11 | Torre de Piso com Casinha | 5 | vídeo 7 — rampa removível + casinha + cestos |
| 12 | Árvore de Piso com Abrigo em Arco | 4 | vídeo 8 — pilares + nicho em arco + topo côncavo |
| 13 | Torre Estante com Nichos Passantes | 5 | vídeo 15 — nichos ligados por furos + poste lateral |
| 14 | Árvore Rústica com Rede | 6 | vídeo 13 — caixotes na base + rede + cestos |
| 15 | Gabinete de Higiene com Arranhador | 3 | vídeo 9 — antecâmara + passagem circular + tampo |

**Total: ~104 elementos derivados** dos 15 circuitos.

---

## 4. O que cada circuito entrega

Para o comprador, cada circuito é um projeto completo:

- modelo 3D navegável, com zoom e vistas isométrica/ortográficas;
- **cotas de medida na tela** (altura de cada nível, tamanho de cada peça, vão
  entre elementos);
- percurso do gato desenhado, com setas numeradas na ordem de uso;
- lista de corte e plano de chapa do circuito inteiro;
- lista de compras separada (ferragem, sisal, tecido — nunca no plano de corte);
- passo a passo de montagem na ordem de instalação;
- **as peças individuais** que compõem o circuito, cada uma como projeto
  autônomo derivado.

## 5. Como as peças são derivadas

Cada elemento do circuito vira um projeto avulso carregando o contexto que o
torna construível:

```text
"Nicho de Abrigo (do Circuito 3)"
  posição verificada: 4º ponto do percurso, a 118 cm do chão
  entrada:  recebe o gato do degrau a 92 cm
  saída:    entrega para a plataforma a 148 cm (o telhado é degrau)
  medidas:  calculadas pelo motor, justificadas
  ferragem: dimensionada para a carga daquele ponto
```

Uma peça isolada nunca é construída do zero. Ela é sempre uma **vista filtrada**
de um circuito validado — é isso que garante que a mesma prateleira não tenha
medida diferente em dois lugares.

## 6. O que precisa ser construído no motor

Ordem de dependência (o de cima destrava os de baixo):

1. **Compositor de circuito** — encadeia trechos num percurso único e
   verificado ponta a ponta. Já existem: subida, travessia. Faltam: abrigo
   (nicho cujo telhado é degrau), descanso, descida.
2. **Regra de descida** — hoje o verificador só confere se o gato sobe. Gato
   desce por caminho diferente do que sobe; um circuito precisa garantir os
   dois.
3. **Cotas no 3D** — não existem hoje. É o que transforma o modelo de
   ilustração em desenho técnico.
4. **Derivador de peça** — extrai elemento do circuito como projeto autônomo.

## 7. O que fica para trás

Os 50 projetos antigos deixam de existir, incluindo os 14 que passavam pelo
motor físico. "Torre Dupla com Ponte de Ligação" e "Escada de Canto" foram
úteis como prova de que a inversão trajeto-primeiro funciona — mas eram peças
avulsas de um catálogo que não correspondia à realidade.

O que **não** se joga fora: as réguas (`gato.ts`), o planejamento de trajeto
(`trajeto.ts`), o verificador de rota, o dimensionamento de ferragem, o
validador geométrico, a ponte de ripas e toda a calibração de vídeo. Essas
peças de motor foram construídas e testadas, e são a base dos 15 circuitos.

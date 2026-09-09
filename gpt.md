# Contexto do projeto — Móveis 3D para gatos

Atualizado em **8 de setembro de 2026**.

## Objetivo do produto

Esta é uma área de membros para projetos de móveis para gatos. O objetivo da
fase atual é criar um acervo novo com:

- uma imagem de referência clara para cada móvel;
- um modelo 3D em GLB que possa ser girado e ampliado dentro da área;
- uma página individual para cada projeto;
- revisão humana no fim de cada bloco, antes de avançar para o bloco seguinte.

O modelo gerado por IA é uma **representação visual**. Ele não substitui
engenharia, protótipo físico, medidas, lista de corte, ferragens ou validação de
segurança para marcenaria.

## Estado atual

O catálogo e o motor paramétrico antigos foram removidos para reiniciar o
projeto do zero. O design geral da área de membros foi preservado.

O fluxo imagem → 3D foi validado e os 40 projetos publicados usam agora o
mesmo motor técnico interativo:

- **Projeto:** 039 — Árvore Compacta de 2 Níveis;
- **categoria:** Torres/composições multiníveis;
- **estado na interface:** disponível com medidas sugeridas e adaptáveis;
- **resultado:** imagem de referência e GLB gerados, salvos e carregados na área;
- **aprovação:** o usuário abriu o resultado e o aprovou visualmente como
  “incrível”;
- **limite atual:** a textura do sisal foi simplificada pelo Tripo e ficou
  parecida com madeira clara. A forma geral ficou coerente.

Portanto, o “motor” validado nesta fase não é mais um gerador geométrico por
código. É este pipeline:

**especificação → imagem limpa de produto → Tripo image-to-3D → GLB →
visualizador React Three Fiber → página individual na área**

## Por que o Projeto 039 foi escolhido

A Árvore Compacta de 2 Níveis foi escolhida no `catalogo-revisado.md` porque é
um teste de baixo risco:

- base quadrada;
- um único poste vertical;
- exatamente duas plataformas;
- peças retas e fáceis de reconhecer;
- sem curva orgânica;
- sem nicho;
- sem ponte;
- sem composição de circuito;
- sem necessidade de inventar um trajeto complexo.

Isso permitiu testar a fidelidade do fluxo sem misturar o problema de geração
3D com problemas de composição ou engenharia.

## Tripo: conta, saldo e custo do piloto

O CLI oficial do Tripo está instalado globalmente e autenticado pelo navegador.
A carteira da API recebeu **2.000 créditos**.

O plano Tripo Studio e a carteira da API/CLI são produtos separados. Este
piloto usou diretamente a carteira da API.

Consumo real:

| etapa | modelo/operação | créditos |
|---|---|---:|
| Imagem de referência | `seedream_v5`, 2K | 5 |
| Imagem para modelo 3D | `v3.1-20260211`, textura padrão + PBR | 30 |
| **Total** | um projeto em 1 shot | **35** |

Saldo confirmado depois do piloto: **1.965 créditos**, sem créditos congelados.

Não foram usados textura HD, geometria detalhada, quad mesh, smart low-poly,
segmentação, retopologia ou tentativa adicional.

## Processo exato que funcionou

### 1. Definição visual

Antes da geração, o móvel foi reduzido aos componentes que precisavam aparecer:

1. uma base quadrada de compensado claro;
2. um poste cilíndrico reto, central, revestido em sisal;
3. exatamente duas plataformas quadradas;
4. plataforma inferior para um lado e superior para o lado oposto;
5. estrutura fisicamente plausível e isolada de qualquer ambiente.

### 2. Estilo do prompt da imagem

O prompt foi escrito em inglês, pois os modelos visuais geralmente seguem com
mais precisão descrições técnicas nesse idioma.

O padrão adotado foi:

1. começar dizendo que é uma referência de produto para gerar um modelo 3D;
2. enumerar a quantidade exata de componentes;
3. nomear materiais e cores;
4. definir a vista como três-quartos frontal;
5. pedir fundo branco e iluminação de estúdio;
6. exigir construção simples e proporções realistas;
7. terminar com exclusões explícitas para evitar invenções.

Prompt integral usado na imagem:

~~~text
Isolated studio product reference render for an AI 3D model: a compact two-level cat tree designed for real woodworking. One square light birch plywood base, one central straight cylindrical scratching post wrapped in natural beige sisal rope, exactly two square light birch plywood platforms attached at different heights, the lower platform on the left and the upper platform on the right. Clean simple construction, visible wooden supports, realistic proportions, three-quarter front view, centered, pure white background, soft studio shadows, no cat, no room, no text, no logo, no basket, no fabric hammock, no extra levels, no organic tree trunk.
~~~

Parâmetros:

- endpoint: `text-to-image`;
- modelo: `seedream_v5`;
- tamanho: `2K`;
- formato: `png`;
- uma única tentativa;
- custo confirmado: 5 créditos.

ID da tarefa: `3cd95a66-f653-475b-a9d4-92db06739e18`.

### 3. Revisão da referência

A imagem foi inspecionada antes de gastar créditos com o GLB. Ela mostrava
claramente:

- base quadrada;
- poste central revestido;
- duas plataformas;
- vista sem oclusão;
- fundo limpo;
- ausência de gato, ambiente e elementos decorativos.

Somente depois dessa conferência foi iniciada a conversão 3D.

### 4. Prompt e parâmetros do modelo 3D

Na etapa image-to-3D foi usado um prompt curto. A imagem já carregava a maior
parte da informação visual; o texto serviu para reforçar os componentes
obrigatórios e evitar peças extras.

Prompt integral:

~~~text
Compact two-level cat tree for real woodworking: square plywood base, one straight sisal-wrapped central post, exactly two plywood platforms at different heights, no extra parts.
~~~

Parâmetros:

- endpoint: `image-to-model`;
- modelo: `v3.1-20260211`;
- `texture=true`;
- `pbr=true`;
- `texture_quality=standard`;
- `geometry_quality=standard`;
- `orientation=align_image`;
- `auto_size=false`;
- `export_uv=true`;
- uma única tentativa;
- custo confirmado: 30 créditos.

ID da tarefa: `2dd374d8-e604-42f7-9702-315d4473aca8`.

### 5. Resultado do Tripo

O Tripo devolveu:

- `model.glb`;
- `rendered_image.webp`;
- `preview.png`.

O GLB final publicado tem aproximadamente **41,2 MB**. É adequado para validar
o visual, mas deverá ser otimizado no futuro se o peso prejudicar o carregamento
em celulares. Não gastar créditos com otimização sem aprovação.

Resultado observado:

- silhueta geral correta;
- base, poste e duas plataformas preservados;
- volumes legíveis em vários ângulos;
- material claro coerente;
- sisal não ficou visualmente distinto como na referência;
- ainda não há informação construtiva confiável.

## Arquivos oficiais do piloto

Ativos estáveis usados pela aplicação:

- `public/modelos/039-arvore-compacta-2-niveis/model.glb`;
- `public/modelos/039-arvore-compacta-2-niveis/preview.png`.

As saídas originais do CLI foram preservadas dentro de:

- `public/modelos/039-arvore-compacta-2-niveis/referencia/tripo-out/`;
- `public/modelos/039-arvore-compacta-2-niveis/modelo/tripo-out/`.

Não mover ou apagar o `model.glb` estável sem também atualizar o caminho no
visualizador.

## Integração na área de membros

### Regra de desempenho da listagem

Em 8 de setembro de 2026 foi identificado que `/projetos` importava e montava
todos os visualizadores React Three Fiber ao mesmo tempo. Isso criava dezenas
de `Canvas` WebGL e iniciava o carregamento simultâneo dos GLBs, travando a
interface.

A arquitetura correta e obrigatória passou a ser:

- `/projetos` renderiza somente cards com `preview.png`;
- as imagens dos cards usam carregamento preguiçoso do `next/image`;
- a listagem não importa nenhum `Visualizador*`, `Canvas` ou `useGLTF`;
- cada card aponta para sua própria rota `/projetos/<slug>`;
- somente a página individual importa o visualizador e carrega um único GLB;
- nunca colocar o componente 3D diretamente na grade de cards novamente.

Fluxo de carregamento:

**card leve com PNG → clique em “Entrar no projeto” → página individual →
um Canvas → um GLB**

O Projeto 039 aparece na listagem:

- rota: `/projetos`;
- estado: disponível, sem badge de validação;
- botão: `Entrar no projeto`.

O botão abre a página individual:

- rota: `/projetos/arvore-compacta-2-niveis`;
- visualizador grande e interativo;
- rotação por arraste;
- zoom por roda do mouse ou gesto de pinça;
- ficha resumida dos elementos;
- aviso explícito de que ainda é um protótipo visual.

Arquivos da integração:

- `app/projetos/page.tsx` — listagem leve com capas PNG e botões de entrada;
- `app/projetos/arvore-compacta-2-niveis/page.tsx` — página individual;
- `app/projetos/visualizador-039.tsx` — Canvas, luzes, GLB e controles;
- `app/inicio.css` — estilos do card e da página do projeto.

O visualizador usa:

- `@react-three/fiber` para o Canvas;
- `@react-three/drei` para `useGLTF`, `Bounds`, `Center` e `OrbitControls`;
- enquadramento automático;
- luz ambiente e duas luzes direcionais;
- limite de densidade de pixels para controlar custo de renderização.

## Validação técnica executada

Depois da integração:

- `npm run validar` passou;
- `npm run build` passou;
- `/projetos` respondeu HTTP 200;
- o botão `Entrar no projeto` apareceu no HTML;
- `/projetos/arvore-compacta-2-niveis` respondeu HTTP 200;
- título e aviso de protótipo apareceram no HTML.

O navegador controlado pelo Codex não estava disponível para medir a página
visualmente. O usuário abriu a interface e aprovou o resultado.

## Receita oficial para os próximos projetos

**Atualizado em 7 de setembro de 2026.** A regra "um projeto por vez, parar a
cada projeto" foi trocada, a pedido do usuário, por **produção por bloco com
um checkpoint humano no fim de cada bloco** — depois que o fluxo se provou no
039 e no 041. Um "bloco" é um grupo do `catalogo-revisado.md`, em geral uma
categoria (A–L).

Para cada projeto do bloco, sem parar entre eles:

1. reduzir o móvel a componentes contáveis e visualmente inequívocos;
2. escrever prompt de referência no estilo “produto isolado”;
3. usar uma vista três-quartos com fundo branco;
4. proibir explicitamente elementos que o modelo tende a inventar;
5. gerar somente uma imagem (sem retry automático);
6. inspecionar a imagem e registrar o que se vê;
7. converter a mesma imagem em GLB com textura padrão;
8. inspecionar a prévia e registrar;
9. copiar o GLB para um caminho estável;
10. criar o card e a página individual;
11. validar TypeScript e build.

No fim do bloco:

12. checar as rotas de todos os projetos do bloco (HTTP + screenshot real
    quando houver navegador);
13. entregar um relatório único do bloco e **parar para revisão humana antes
    do próximo bloco**.

Estimativa padrão para 1 shot:

- 5 créditos pela referência 2K;
- 30 créditos pelo GLB texturizado;
- 35 créditos por projeto — informar o teto do **bloco inteiro** (35 × nº de
  projetos) antes de começar.

## Lista completa do catálogo revisado

### Como interpretar a contagem

O `catalogo-revisado.md` contém **35 entradas nomeadas** nas tabelas A–L.
Entretanto, o próprio resumo do catálogo estima **cerca de 27 projetos únicos**
porque algumas entradas são apenas variações de quantidade, altura ou tamanho
do mesmo módulo.

Essa diferença não deve ser “corrigida” silenciosamente:

- **35** é a quantidade de nomes atualmente presentes nas tabelas;
- **~27** é a estimativa de famílias realmente únicas depois das fusões;
- **50** era a quantidade do catálogo original, que foi removido;
- antes de gerar todo o acervo, o usuário deve decidir quais variações terão
  página e GLB próprios;
- a geração é **por bloco autorizado** (uma categoria por vez), com checkpoint
  humano no fim de cada bloco.

### Entradas nomeadas atualmente ativas — 35

#### A. Módulos de subida/passagem

1. **A1 — Degraus Escalonados de Parede** — reúne os antigos 001 e 002.
2. **A2 — Escada de Canto** — antigo 003.
3. **A3 — Escada em Zigue-Zague de Parede** — antigo 004.
4. **A4 — Passarela Reta** — antigo 005.
5. **A5 — Passarela com Recorte Reto (não curva)** — revisão do antigo 006.
6. **A6 — Rampa de Acesso para Gato Idoso** — antigo 009.

#### B. Travessias flexíveis

7. **B1 — Ponte Suspensa de Ripas com Corda** — antigo 007.
8. **B2 — Ponte Flexível de Tecido Reforçado** — antigo 008.

#### C. Ligação vertical

9. **C1 — Poste de Ligação entre Dois Níveis** — reúne os antigos 010 e 011
   por parâmetro de altura.

#### D. Painel de escalada

10. **D1 — Painel Modular de Escalada com Apoios** — antigo 012.

#### E. Nichos-túnel

11. **E1 — Nicho Túnel Retangular** — reúne o antigo 013 e a escala do 019.
12. **E2 — Nicho Túnel com Janela Frontal Redonda** — revisão do antigo 014;
    a janela frontal não é entrada.
13. **E3 — Nicho Túnel com Entrada em Ângulo** — antigo 015.
14. **E4 — Nicho Túnel com Saída no Topo** — projeto novo, sem número antigo.

Regra obrigatória para E1–E4: a entrada funcional nunca fica na frente. O gato
entra por uma lateral e sai pela outra lateral ou pelo topo.

#### F. Abrigo com telhado

15. **F1 — Casinha Suspensa com Telhado de Dois Planos** — revisão do antigo
    022; precisa respeitar a regra de entrada lateral/túnel.

#### G. Plataformas de descanso

16. **G1 — Prateleira de Descanso Simples** — antigo 023.
17. **G2 — Prateleira de Descanso com Borda** — antigo 024.
18. **G3 — Mirante de Janela** — antigo 025; pode ser tratado como variação de
    altura de prateleira.

#### H. Descanso em tecido

19. **H1 — Rede Suspensa de Parede** — antigo 026.
20. **H2 — Cama Suspensa em Tecido Tenso** — antigo 027.
21. **H3 — Cama Concha com Laterais Elevadas Retas** — revisão do antigo 029,
    substituindo curvas por faces anguladas.

#### I. Arranhadores retos

22. **I1 — Painel Arranhador de Parede** — antigo 031.
23. **I2 — Painel Arranhador de Canto (90°)** — antigo 032.
24. **I3 — Poste Arranhador de Chão** — antigo 033.
25. **I4 — Poste Arranhador com Plataforma** — antigo 034; pode ser uma
    variação do I3.
26. **I5 — Arranhador Inclinado tipo Cunha** — antigo 035.
27. **I6 — Arranhador Horizontal tipo Banco** — antigo 036.

#### J. Acessório de mobília existente

28. **J1 — Protetor de Canto de Sofá em Sisal** — antigo 038; é sob medida e
    depende das dimensões reais do sofá.

#### K. Torres/composições multiníveis

29. **K1 — Árvore Compacta de 2 Níveis** — antigo 039; **piloto concluído**.
30. **K2 — Árvore Média de 3 Níveis** — antigo 040; pode ser variação de
    contagem da K1.
31. **K3 — Torre Alta Vertical** — antigo 041; pode pertencer à mesma família
    parametrizada de K1/K2.

#### L. Móveis utilitários

32. **L1 — Comedouro Elevado Simples** — antigo 047.
33. **L2 — Comedouro Elevado Duplo** — antigo 048; pode ser variação do L1.
34. **L3 — Estação de Alimentação com Porta-Ração** — antigo 049.
35. **L4 — Estação Compacta com Armazenamento** — antigo 050; pode ser
    variação de proporção do L3.

### Projetos pendentes — não gerar sem nova decisão

- **016 — Nicho de Canto Triangular:** precisa ser redesenhado como túnel.
- **018 — Nicho Treliçado de Ripas:** requer uma família própria de módulo.
- **020 — Nichos Comunicantes Horizontais:** depende de composição.
- **021 — Nichos Comunicantes Verticais:** depende de composição.
- **030 — Beliche Suspenso:** depende de composição e acesso entre níveis.
- **042 — Árvore de Canto:** depende das medidas reais de duas paredes.
- **043 — Torre com Toca e Plataformas:** combina torre e nicho.
- **044 — Torre Dupla com Ponte:** combina duas torres e ponte.
- **046 — Playground Vertical Multi-Gatos:** composição complexa de vários
  módulos.

### Projetos removidos como forma independente

- **017 — Nicho Hexagonal Suspenso:** fora do escopo atual.
- **028 — Cama Curva tipo Wave:** curva contínua de madeira dobrada.
- **037 — Arco Arranhador Curvo:** forma orgânica.
- **045 — Árvore em Espiral:** forma orgânica.

### Números antigos absorvidos por outros projetos

- **002** foi absorvido pelo A1.
- **011** foi absorvido pelo C1.
- **019** foi absorvido pelo E1.
- **025** é uma variação de altura de plataforma, embora G3 continue nomeado.
- **034** é uma variação do poste I3, embora I4 continue nomeado.
- **040** é uma variação de níveis da K1, embora K2 continue nomeado.
- **041** pertence à mesma família vertical, embora K3 continue nomeado.
- **048** é uma variação de quantidade de potes do L1, embora L2 continue nomeado.
- **050** é uma variação de proporção do L3, embora L4 continue nomeado.

## Manual operacional para o Claude reproduzir o fluxo

### Ordem de leitura obrigatória

Antes de qualquer ação, o Claude deve:

1. ler este `gpt.md` inteiro;
2. ler `catalogo-revisado.md`;
3. ler `AGENTS.md`;
4. antes de editar Next.js, ler a documentação relevante em
   `node_modules/next/dist/docs/`;
5. inspecionar o projeto existente e preservar o design aprovado;
6. consultar o saldo com `tripo.cmd doctor --json`.

Nunca pedir, imprimir ou salvar a API key. O CLI já está autenticado por perfil.

### Regra de autorização e orçamento

O Claude só pode começar a gerar quando o usuário autorizar explicitamente o
**bloco**. Antes da primeira chamada paga do bloco, deve informar:

- qual bloco e quais projetos (nome + código de cada um);
- etapas que serão cobradas por projeto;
- **teto do bloco inteiro** (35 × nº de projetos);
- quantidade de tentativas (uma por etapa);
- parâmetros adicionais, se houver.

Fluxo padrão autorizado, por projeto do bloco:

- uma imagem 2K: 5 créditos;
- um GLB com textura padrão/PBR: 30 créditos;
- 35 créditos por projeto;
- exatamente um shot em cada etapa.

Dentro do bloco, os projetos correm em sequência sem parar. Não iniciar duas
tarefas pagas em paralelo. Não refazer automaticamente uma imagem ou um GLB:
se um resultado ficar ruim, registrar o defeito, seguir para o próximo
projeto e pedir autorização de retry no relatório de fim de bloco.

### Fórmula do prompt da primeira imagem

O prompt que funcionou não é um prompt artístico livre. É uma **especificação
visual de produto isolado**, escrita em inglês e nesta ordem:

~~~text
Isolated studio product reference render for an AI 3D model:
[nome simples e função do móvel].
[quantidade exata, forma, posição e material de cada componente].
Clean simple construction, visible supports, realistic proportions,
three-quarter front view, centered, pure white background, soft studio shadows,
[lista explícita do que não pode aparecer].
~~~

Blocos do prompt:

1. **Finalidade:** “product reference render for an AI 3D model”.
2. **Objeto:** nome concreto, sem linguagem publicitária.
3. **Contagem:** usar “one”, “exactly two”, “three” etc.
4. **Geometria:** square, rectangular, straight, cylindrical, 90-degree.
5. **Materiais:** light birch plywood, natural beige sisal rope, reinforced
   fabric, conforme o móvel.
6. **Posição relativa:** left/right, lower/upper, centered, attached.
7. **Plausibilidade:** simple construction, visible supports, realistic
   proportions.
8. **Câmera:** three-quarter front view.
9. **Cenário:** centered, pure white background, soft studio shadows.
10. **Restrições:** no cat, no room, no text, no logo e exclusões específicas
    do projeto.

Evitar:

- adjetivos vagos como “amazing”, “beautiful” ou “luxury”;
- ambientes decorados;
- gato cobrindo peças;
- múltiplas vistas na mesma imagem;
- texto, cotas e legendas geradas por IA;
- “organic”, “flowing” ou “sculptural” em móveis retos;
- instruções contraditórias;
- deixar a quantidade de níveis implícita.

### Prompt original que produziu a referência aprovada

~~~text
Isolated studio product reference render for an AI 3D model: a compact two-level cat tree designed for real woodworking. One square light birch plywood base, one central straight cylindrical scratching post wrapped in natural beige sisal rope, exactly two square light birch plywood platforms attached at different heights, the lower platform on the left and the upper platform on the right. Clean simple construction, visible wooden supports, realistic proportions, three-quarter front view, centered, pure white background, soft studio shadows, no cat, no room, no text, no logo, no basket, no fabric hammock, no extra levels, no organic tree trunk.
~~~

Este prompt deve servir como **estrutura**, não ser copiado literalmente para
todos os móveis. O Claude deve trocar objeto, componentes, contagens, materiais,
posições e exclusões conforme o projeto escolhido.

### Comando da imagem de referência

No Windows/PowerShell, usar `tripo.cmd`, não `tripo`, porque scripts PowerShell
podem ser bloqueados pela política de execução.

Modelo do comando:

~~~powershell
tripo.cmd generate text-to-image --model seedream_v5 -o "public/modelos/<slug>/referencia" -p "size=2K" -p "output_format=png" --yes --no-open --json --quiet --timeout 150 "<prompt completo>"
~~~

Guardar o JSON retornado. Ele informa:

- `task_id`;
- `status`;
- `credits_consumed`;
- `output_dir`;
- nomes dos arquivos;
- caminho da prévia.

Se o status não for `success`, parar. Não iniciar a conversão 3D.

### Portão obrigatório entre imagem e GLB

Abrir a `preview.png` ou `generated_image.png` e conferir:

- todos os componentes obrigatórios aparecem;
- as quantidades estão corretas;
- nenhuma peça importante está ocultada;
- a estrutura não possui elementos impossíveis;
- a vista mostra frente, lado e profundidade;
- o fundo está limpo;
- não há gato, texto, marca, ambiente ou decoração;
- não há peça extra proibida.

Se qualquer item crítico falhar, informar o usuário e pedir autorização para
refazer. Não gastar os 30 créditos do GLB usando uma referência rejeitada.

### Prompt de reforço para image-to-3D

Usar uma versão curta da especificação:

~~~text
[nome e função]: [componentes obrigatórios com contagem], no extra parts.
~~~

Prompt usado no piloto:

~~~text
Compact two-level cat tree for real woodworking: square plywood base, one straight sisal-wrapped central post, exactly two plywood platforms at different heights, no extra parts.
~~~

A imagem é a principal fonte visual. O prompt curto serve para reforçar forma,
contagem e ausência de peças extras.

### Comando da conversão para GLB

~~~powershell
tripo.cmd generate image-to-model "<caminho-da-generated_image.png>" --model v3.1-20260211 --prompt "<prompt curto>" -o "public/modelos/<slug>/modelo" -p "texture=true" -p "pbr=true" -p "texture_quality=standard" -p "geometry_quality=standard" -p "orientation=align_image" -p "auto_size=false" -p "export_uv=true" --yes --no-open --json --quiet --timeout 300
~~~

Não adicionar por padrão:

- `texture_quality=detailed`;
- `geometry_quality=detailed`;
- `quad=true`;
- `smart_low_poly=true`;
- `generate_parts=true`;
- segmentação;
- retopologia;
- conversão avançada.

Esses recursos mudam o custo e exigem autorização específica.

### Revisão do resultado 3D

Depois de `status=success`:

1. registrar `task_id` e `credits_consumed`;
2. abrir a `preview.png` do modelo;
3. conferir silhueta, contagem, apoios, materiais e peças extras;
4. relatar qualquer simplificação ou erro visual;
5. não confundir coerência visual com viabilidade de fabricação;
6. copiar `model.glb` e `preview.png` para caminhos estáveis:

~~~text
public/modelos/<slug>/model.glb
public/modelos/<slug>/preview.png
~~~

Preservar também a saída original do CLI para auditoria.

### Integração na área de membros

Para cada projeto aprovado:

1. adicionar um card na listagem `/projetos`;
2. usar a prévia ou o GLB verdadeiro, nunca uma imagem de outro móvel;
3. adicionar o botão `Entrar no projeto`;
4. criar uma rota individual estável em `/projetos/<slug>`;
5. carregar `/modelos/<slug>/model.glb` no visualizador;
6. permitir rotação e zoom;
7. mostrar medidas como `sugeridas` e deixar explícito que são adaptáveis;
8. mostrar aviso de segurança, material, ambiente e sistema de fixação;
9. preservar a navegação de retorno para `/projetos`;
10. não anunciar as sugestões como cálculo estrutural ou garantia de fabricação.

Usar o Projeto 039 como implementação de referência:

- `app/projetos/page.tsx`;
- `app/projetos/arvore-compacta-2-niveis/page.tsx`;
- `app/projetos/visualizador-039.tsx`;
- `app/inicio.css`.

Ao entrar o segundo projeto, avaliar a extração de um visualizador reutilizável
por `slug` para evitar duplicar um componente por móvel. Não fazer essa
refatoração antes de ela ser necessária.

### Validação obrigatória

Após a integração:

~~~powershell
npm.cmd run validar
npm.cmd run build
~~~

Confirmar:

- a listagem compila;
- o botão aponta para a rota correta;
- a rota individual responde;
- o título do projeto aparece;
- o GLB existe no caminho público;
- o aviso de protótipo visual aparece;
- desktop e celular não apresentam rolagem ou corte indevidos, quando houver
  navegador disponível.

Se o navegador controlado não estiver disponível, declarar isso com clareza e
não fingir que houve inspeção visual.

### Relatório de fim de bloco que o Claude deve entregar

Um único relatório cobrindo todos os projetos do bloco. Para cada projeto:

- projeto criado (nome + código);
- créditos usados em cada etapa;
- resultado visual observado;
- defeitos ou limitações (e se pede retry);
- caminho do GLB e rota da página individual.

E para o bloco:

- saldo Tripo restante confirmado;
- resultado de TypeScript e build;
- resultado da checagem de rotas (HTTP + screenshot, ou declaração de que o
  navegador não estava disponível);
- confirmação de que o próximo bloco NÃO foi iniciado.

Depois disso, parar e aguardar a revisão do usuário.

## Motor técnico interativo — todos os 40 projetos (08/09/2026)

Todos os projetos possuem dois modos de representação:

- **modelo visual:** GLB texturizado, usado para aparência;
- **gêmeo técnico:** peças separadas, medidas, seleção, explosão e montagem.

Arquivos principais:

- `lib/projetos-tecnicos.ts`: catálogo central, 40 conjuntos de medidas sugeridas,
  geradores de peças, montagem, segurança e motor de custos;
- `app/projetos/experiencia-tecnica.tsx`: motor visual comum;
- `app/projetos/pagina-projeto.tsx`: template comum das páginas individuais;
- `scripts/gerar-paginas-projetos.mjs`: conecta mecanicamente todas as rotas ao template;
- `scripts/validar-projetos-tecnicos.mjs`: confere catálogo, rotas, GLBs, previews,
  medidas, badges e recursos obrigatórios;
- `app/inicio.css`: estilos desktop, celular, tela cheia e impressão.

Recursos presentes em todas as páginas: **Visual**, **Peças**, **Explodida**,
**Montagem**, seleção, destaque, ocultar, isolar, transparência, etiquetas de
medida, milímetros/centímetros, reset de câmera, tela cheia interna, sequência,
calculadora persistente, custo por peça, lista de materiais, ferragens,
exportação CSV, impressão, observações pessoais, dificuldade, tempo, pessoas e
avisos de segurança.

As dimensões são referências proporcionais baseadas na aparência e na função de
cada móvel. O estado é `sugerida`, não `revisada`. A interface diz que cada
cliente pode adaptar largura, altura e profundidade conforme ambiente, material,
porte/peso/quantidade de gatos e sistema de fixação. Essas sugestões não são
cálculo estrutural nem garantia de fabricação.

A listagem `/projetos` continua PNG-only: não importa Canvas, GLB ou visualizador.
O GLB e o motor técnico são carregados somente depois de entrar numa rota
individual. Os cards não possuem mais `Em validação 3D` e exibem as dimensões
gerais sugeridas.

Validação desta expansão: TypeScript e build passaram; 40/40 rotas responderam
HTTP 200; 40/40 projetos têm GLB, preview, medidas e template técnico comum; a
listagem continuou sem `<canvas>` e sem `.glb`. O navegador controlado não estava
conectado, então não houve inspeção visual automatizada dos quatro viewports.

### Correção de tela cheia e tela visual de login (08/09/2026)

O `requestFullscreen()` nativo foi removido do visualizador porque o iframe do
Antigravity o bloqueia por Permissions Policy. A tela cheia agora é interna:
o estado React aplica `data-tela-cheia`, o painel usa `position: fixed` sobre a
janela, o scroll do corpo é bloqueado e a tecla Esc fecha o modo. Não voltar a
usar a Fullscreen API nesse componente.

Foi criada a rota `/login` como prévia exclusivamente visual, usando a paleta
de madeira, papel e grafite da área. Ela contém campo de e-mail, botão de acesso
e versão responsiva, mas não consulta Supabase, não cria sessão e não protege
rotas. Ao enviar, informa honestamente que a validação será conectada em outra
etapa. Arquivos: `app/login/page.tsx`, `app/login/formulario-login.tsx` e
`app/login/login.module.css`.

### Segmentação local dos GLBs nos modos técnicos (09/09/2026)

O antigo gêmeo técnico por caixas e cilindros foi retirado da renderização. Ele
não preservava recortes e formas do móvel real — por exemplo, o Projeto 015
virava uma caixa simples ao abrir Peças ou Explodida.

O classificador que percorria cerca de 1,4 milhão de triângulos no navegador
também foi removido. Ele era pesado, reclassificava faces durante o uso e podia
quebrar uma mesma peça em regiões arbitrárias.

Agora a segmentação acontece previamente, fora da aplicação, pelo script
`scripts/gerar-segmentacoes-locais.mjs`. O processo encontra os componentes
conectados do GLB e atribui cada componente inteiro a uma peça técnica. Para
cada projeto são gravados, ao lado de `model.glb`:

- `pecas.bin`: um byte por triângulo, indicando a peça à qual ele pertence;
- `pecas.json`: manifesto com SHA-256 do GLB, contagens, nomes, aliases, centros
  e vetores estáveis da explosão.

`app/projetos/modelo-segmentado.tsx` carrega exatamente o mesmo
`projeto.modeloVisual` usado no modo Visual e apenas aplica o mapa pronto. A
geometria, os recortes, as texturas e as proporções originais são preservados.
Em 0% de explosão, todos os triângulos mantêm a transformação exata do GLB;
Peças, Explodida e Montagem trabalham sobre esses mesmos fragmentos reais.

A câmera deixou de usar enquadramento reativo às peças em movimento. O modelo é
centralizado e normalizado uma vez pelas dimensões fixas do manifesto. Por isso,
mudar o nível da explosão não reposiciona a câmera. A seleção usa
`three-mesh-bvh` e `firstHitOnly`, sem raycast contínuo por hover.

Os 40 mapas cobrem 57.468.870 triângulos e ocupam 54,8 MB antes da compressão
HTTP. `npm run auditar:segmentacoes` confere os 40 SHA-256, um rótulo por
triângulo, contagens, IDs e cobertura de todas as peças. Para refazer um único
projeto use `npm run gerar:segmentacoes -- --slug <slug-ou-código>` e, para
refazer todos, `npm run gerar:segmentacoes`.

Nenhum segundo GLB é baixado, o catálogo `/projetos` continua PNG-only e nenhum
crédito do Tripo é consumido. `lib/projetos-tecnicos.ts` continua sendo a fonte
das medidas sugeridas, nomes e custos — as medidas não são inferidas da malha de
IA. Quando duas peças técnicas pertencem à mesma ilha física do GLB, o manifesto
registra uma delas como alias; selecionar qualquer uma destaca o mesmo conjunto
real sem inventar cortes na geometria.

Contrato obrigatório daqui em diante:

- Visual e Peças devem carregar o mesmo `modeloVisual`;
- não reintroduzir `boxGeometry`/`cylinderGeometry` como representação do móvel;
- a explosão 0% deve recompor 100% dos triângulos do GLB original;
- cada triângulo deve pertencer a exatamente uma peça;
- ajustes de classificação são locais e não usam a API de segmentação do Tripo;
- não voltar a classificar triângulos durante a renderização no navegador;
- qualquer troca de `model.glb` exige regenerar e auditar seu mapa local;
- `scripts/validar-projetos-tecnicos.mjs` deve impedir o retorno do motor genérico.

## Regras permanentes

- Trabalhar por bloco. Não emendar um bloco no seguinte sem checkpoint humano.
- Não fazer nova tentativa de geração sem autorização.
- Informar o teto de créditos do bloco inteiro antes de iniciá-lo.
- Conferir a imagem antes da etapa 3D de cada projeto.
- Não usar imagem ou GLB de IA como fonte de medidas de corte.
- Não afirmar que o modelo está pronto para fabricação.
- Não expor API keys em arquivos, código, logs ou conversas.
- Não usar textura HD, geometria detalhada ou processamento adicional por padrão.
- Manter uma pasta e uma rota estáveis para cada projeto aprovado.
- Cada bloco só entra na área depois de uma revisão humana.

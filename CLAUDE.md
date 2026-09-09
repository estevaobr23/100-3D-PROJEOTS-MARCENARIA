@AGENTS.md

# Projeto: móveis 3D para gatos

Infoproduto/área de membros com projetos de marcenaria para gatos. O
comprador é marceneiro/maker. Cada projeto deve entregar modelo 3D navegável,
lista de corte, plano de chapa, lista de compras e passo a passo de
montagem — **mas essa parte técnica ainda não foi reconstruída** (ver abaixo).

**Leia `contexto.md` antes de mexer em qualquer coisa.** Ele tem o estado
real, o fluxo validado e como retomar.

## O que mudou em 7 de setembro de 2026 (fim do dia)

O motor geométrico por código (`lib/construtor/`, `lib/3d/`,
`CaixaParametrica`, compositor de circuito) foi **abandonado pelo usuário**
depois de repetidas correções que nunca convergiram para um resultado
aceitável. Esses diretórios, os validadores de motor e as rotas
`/circuito/[slug]` e `/movel/[slug]` foram removidos. `lib/` hoje só tem
`config/`. As duas pastas de rota citadas ainda existem no disco mas estão
vazias — não são código morto para reativar.

**O que substitui isso, e já foi validado:** um fluxo imagem → 3D via Tripo
(geração de imagem de referência + conversão image-to-3D em GLB), integrado
a uma página própria por projeto. Detalhes completos, prompts exatos e custo
em créditos: `contexto.md`.

## O princípio que NÃO mudou

**Imagem/GLB de IA nunca é fonte de medida de corte.** Isso continua valendo
integralmente — o que mudou é só onde a imagem entra: hoje ela é insumo de
geração visual (aprovação de forma), nunca referência para calcular
dimensão. Medida de corte, lista de material e aprovação de fabricação
dependem de uma etapa própria de engenharia e protótipo físico, **ainda não
iniciada**. Nenhum projeto deve ser chamado de "pronto para fabricação" sem
isso.

Dado de vídeo (em `analise-videos/`, se ainda usado) segue a mesma regra de
sempre: serve para calibrar constante e desmentir modelo mental errado,
nunca para copiar forma diretamente em código.

## O padrão de trabalho agora: produção por bloco, um checkpoint no fim do bloco

Mudou em 7 de setembro de 2026: a regra antiga "um projeto por vez, parar a
cada projeto" foi substituída, a pedido do usuário, depois que o fluxo se
provou confiável no piloto 039 e no 041. Agora se trabalha por **bloco**
(um grupo do `catalogo-revisado.md`, normalmente uma categoria A–L).

Dentro de um bloco autorizado, para cada projeto, **sem parar entre eles**:

1. reduzir o móvel a componentes contáveis e inequívocos;
2. prompt de referência em inglês, estilo "produto isolado", vista
   três-quartos, fundo branco, exclusões explícitas do que a IA tende a
   inventar;
3. gerar **uma única imagem** por projeto — nunca lote de retries, nunca
   retry automático (imagem ou GLB ruim: registrar o defeito, seguir, e
   pedir autorização de retry no checkout do bloco);
4. inspecionar a imagem (é o ponto mais barato para pegar erro) e registrar;
5. converter em GLB com textura padrão + PBR;
6. inspecionar a prévia do GLB e registrar;
7. copiar para caminho estável em `public/modelos/`;
8. criar card + página individual (visualizador genérico `visualizador-modelo.tsx`);
9. `npm run validar` (hoje é só `tsc --noEmit`) + `npm run build`.

No **fim do bloco** (não antes):

10. checar as rotas de todos os projetos do bloco — por HTTP e por
    screenshot real quando o navegador controlado estiver disponível;
11. entregar um relatório único do bloco: projetos criados, créditos por
    etapa, saldo, defeitos vistos, rotas, resultado de tsc/build;
12. **parar e esperar aprovação humana antes do próximo bloco.**

Custo por projeto em 1 tentativa por etapa: **35 créditos Tripo** (5 imagem +
30 GLB). Informar o **teto do bloco inteiro** (35 × nº de projetos) antes de
começar o bloco. Nunca expor chave de API em arquivo, código, log ou conversa.

Ordem de blocos acordada (menor risco primeiro): 1 (K, torres — feito) →
2 (I, arranhadores) → 3 (G, plataformas) → 4 (C+D) → 5 (A, parede) →
6 (B, pontes) → 7 (H, tecido) → 8 (E+F, nichos) → 9 (L, utilitários) → J1.

## Restrições permanentes do usuário

- Ferragem (mão-francesa, cantoneira, flange): **sempre** material comprado
  separado, **nunca** entra em plano de corte — quando plano de corte voltar
  a existir.
- Sisal e rede aparecem no visual como complemento, mas continuam comprados.
- Sem bônus, sem material extra — foco só nos projetos.
- Trabalhar por bloco, com checkpoint humano no fim de cada bloco (ver acima).
  Não emendar um bloco no seguinte sem esse OK. Não fazer retry de geração
  sem autorização.
- Não afirmar que um modelo de IA está pronto para fabricação.
- Não expor credenciais no cliente ou no repositório.

## Comandos

```bash
npm run validar   # hoje é só tsc --noEmit
npm run build
npm run dev       # servidor em http://localhost:3210
```

O CLI do Tripo está instalado globalmente e autenticado. Ver `contexto.md`
para os parâmetros exatos de cada endpoint usado no piloto.

## Ao trabalhar aqui

- Escreva o **porquê** nos comentários, especialmente quando o número vier de
  uma régua física, dado de vídeo, ou decisão do pipeline Tripo.
- Bash come crases e escapes: prefira Write/Edit ou script em arquivo a
  `node -e` com regex.
- Não confie em "HTTP 200" como prova de que a tela funciona. Tire
  screenshot sempre que o ambiente permitir.
- Quando o usuário disser que algo não está funcionando, **pare e pergunte**
  antes de reescrever. Uma refatoração grande não solicitada já foi
  interrompida no meio e deixou a página quebrada — foi um dos motivos que
  levou ao abandono do motor antigo.

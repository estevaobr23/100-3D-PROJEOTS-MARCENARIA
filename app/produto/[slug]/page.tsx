import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCustomer } from "@/lib/auth/session";
import { idsProdutosLiberados } from "@/lib/data/acesso";
import { acharProduto, CATALOGO } from "@/lib/config/catalogo";
import "../../inicio.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CATALOGO.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = acharProduto(slug);
  return {
    title: produto
      ? `${produto.titulo} · Móveis para Gatos`
      : "Produto · Móveis para Gatos",
  };
}

export default async function PaginaProduto({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cliente = await requireCustomer();

  const produto = acharProduto(slug);
  if (!produto) notFound();

  // Acesso é entitlement. Sem entitlement ativo para este produto => 404
  // (mesma regra do resto da área: não revelar que o produto existe).
  const liberados = await idsProdutosLiberados(cliente.id);
  const temAcesso =
    produto.caktoProductId !== null && liberados.has(produto.caktoProductId);
  if (!temAcesso) notFound();

  const principal = produto.itens.filter((i) => i.tipo === "principal");
  const bonus = produto.itens.filter((i) => i.tipo === "bonus");

  return (
    <main className="envolucro">
      <div className="pagTopo">
        <Link className="prodVoltar" href="/">
          <span aria-hidden>←</span> Voltar para Início
        </Link>
        <h1 className="pagTitulo">{produto.titulo}</h1>
        <p className="pagSub">{produto.subtitulo}</p>
      </div>

      {principal.length > 0 && (
        <section className="prodSecao" aria-labelledby="prod-principal">
          <h2 id="prod-principal" className="prodRotulo">
            Conteúdo principal
          </h2>
          <div className="prodGrade">
            {principal.map((item) => (
              <CardItem key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {bonus.length > 0 && (
        <section className="prodSecao" aria-labelledby="prod-bonus">
          <h2 id="prod-bonus" className="prodRotulo">
            {bonus.length === 1 ? "Bônus" : `Bônus (${bonus.length})`}
          </h2>
          <div className="prodGrade">
            {bonus.map((item) => (
              <CardItem key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function CardItem({
  item,
}: {
  item: (typeof CATALOGO)[number]["itens"][number];
}) {
  return (
    <Link className="prodCard" href={item.href}>
      <div className="prodCardCapa">
        <Image
          src={item.capa}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, 300px"
        />
        <span
          className="prodCardTag"
          data-tipo={item.tipo}
        >
          {item.tipo === "principal" ? "Principal" : "Bônus"}
        </span>
      </div>
      <div className="prodCardCorpo">
        <span className="prodCardTitulo">{item.titulo}</span>
        <p className="prodCardDescricao">{item.descricao}</p>
        <span className="prodCardAcao">
          Acessar <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

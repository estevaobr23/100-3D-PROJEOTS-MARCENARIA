import Image from "next/image";
import Link from "next/link";
import { requireCustomer } from "@/lib/auth/session";
import { idsProdutosLiberados } from "@/lib/data/acesso";
import { CATALOGO } from "@/lib/config/catalogo";
import { precoBRL } from "@/lib/config/ofertas";
import "./inicio.css";

export default async function Inicio() {
  // Além do gate otimista do proxy (só olha o cookie), aqui a sessão é
  // validada de verdade contra o banco. Cookie órfão (sessão expirada/
  // revogada) cai em /api/sessao-encerrada, que o limpa sem laço.
  const cliente = await requireCustomer();
  const primeiroNome = cliente.name?.split(" ")[0];

  const liberados = await idsProdutosLiberados(cliente.id);

  // Um produto entra na vitrine se o cliente tem acesso OU se é uma oferta
  // (`aVenda`). Sem acesso e sem oferta => não aparece.
  const cards = CATALOGO.map((produto) => {
    const temAcesso =
      produto.caktoProductId !== null && liberados.has(produto.caktoProductId);
    return { produto, temAcesso };
  }).filter(({ produto, temAcesso }) => temAcesso || produto.aVenda);

  return (
    <main className="envolucro">
      <div className="pagTopo">
        <h1 className="pagTitulo">
          {primeiroNome ? `Olá, ${primeiroNome}` : "Seus produtos"}
        </h1>
        <p className="pagSub">
          Escolha um produto para ver o conteúdo principal e os bônus incluídos.
        </p>
      </div>

      {cards.length === 0 ? (
        <p className="vitVazio">
          Ainda não há produtos liberados nesta conta. Se você acabou de comprar,
          aguarde alguns minutos e recarregue a página.
        </p>
      ) : (
        <div className="vitGrade">
          {cards.map(({ produto, temAcesso }) =>
            temAcesso ? (
              <Link
                key={produto.slug}
                className="vitCard"
                href={`/produto/${produto.slug}`}
              >
                <div className="vitCapa">
                  <Image
                    src={produto.capa}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 340px"
                  />
                </div>
                <div className="vitCorpo">
                  <span className="vitTitulo">{produto.titulo}</span>
                  <p className="vitSub">{produto.subtitulo}</p>
                  <span className="vitAcao">
                    Abrir produto <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ) : (
              <a
                key={produto.slug}
                className="vitCard vitCard--oferta"
                href={produto.aVenda!.url}
              >
                <div className="vitCapa">
                  <Image
                    src={produto.capa}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 340px"
                  />
                  <span className="vitSelo">Adquira</span>
                </div>
                <div className="vitCorpo">
                  <span className="vitTitulo">{produto.titulo}</span>
                  <p className="vitSub">{produto.subtitulo}</p>
                  <span className="vitAcao">
                    {precoBRL(produto.aVenda!.precoBRL)}{" "}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </a>
            )
          )}
        </div>
      )}

      <div className="iniAviso">
        <span aria-hidden>🛠️</span>
        <span>
          As medidas dos projetos servem como ponto de partida e podem ser
          adaptadas ao seu ambiente, aos materiais escolhidos e às necessidades
          de cada gato.
        </span>
      </div>
    </main>
  );
}

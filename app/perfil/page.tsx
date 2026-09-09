import { SUPORTE } from "@/lib/config/ofertas";
import { getCurrentCustomer } from "@/lib/auth/session";
import { sair } from "./actions";

export const metadata = { title: "Perfil · Móveis para Gatos" };

export default async function Perfil() {
  const cliente = await getCurrentCustomer();

  return (
    <main className="envolucro">
      <div className="pagTopo">
        <h1 className="pagTitulo">Sua conta</h1>
        <p className="pagSub">Acesso, ajuda e suporte.</p>
      </div>

      <div className="perBloco">
        <h2 className="perTitulo">Conta</h2>
        {cliente ? (
          <p className="perTexto">
            Você está conectado como{" "}
            <strong>{cliente.name || cliente.email}</strong>
            {cliente.name && <> ({cliente.email})</>}.
          </p>
        ) : (
          <p className="perTexto">Você não está conectado.</p>
        )}
        <form action={sair} className="perSairForm">
          <button type="submit" className="perSair">
            Sair da conta
          </button>
        </form>
      </div>

      <div className="perBloco">
        <h2 className="perTitulo">Novo acervo</h2>
        <p className="perTexto">
          A coleção anterior foi retirada para uma reconstrução completa. Os novos
          projetos serão publicados aqui conforme cada imagem e modelo 3D for aprovado.
        </p>
      </div>

      {(SUPORTE.email || SUPORTE.whatsapp) && (
        <div className="perBloco">
          <h2 className="perTitulo">Suporte</h2>
          <p className="perTexto">
            Algum problema com o acesso? Fale com a gente
            {SUPORTE.email && <> em <a href={`mailto:${SUPORTE.email}`}>{SUPORTE.email}</a></>}
            {SUPORTE.whatsapp && <> ou no WhatsApp {SUPORTE.whatsapp}</>}.
          </p>
        </div>
      )}
    </main>
  );
}

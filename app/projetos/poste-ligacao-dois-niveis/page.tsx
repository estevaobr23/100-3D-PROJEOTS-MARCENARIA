import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "poste-ligacao-dois-niveis";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

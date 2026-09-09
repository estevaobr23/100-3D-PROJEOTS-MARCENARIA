import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "comedouro-duplo";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

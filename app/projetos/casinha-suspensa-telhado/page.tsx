import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "casinha-suspensa-telhado";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

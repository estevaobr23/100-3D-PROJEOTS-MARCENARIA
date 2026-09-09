import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "torre-alta-vertical";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

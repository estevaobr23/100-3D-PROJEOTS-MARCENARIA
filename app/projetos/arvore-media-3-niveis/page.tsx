import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "arvore-media-3-niveis";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

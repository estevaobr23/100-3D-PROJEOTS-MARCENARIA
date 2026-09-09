import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "protetor-canto-sofa";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "escada-zigue-zague";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "playground-circuito-com-nicho";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

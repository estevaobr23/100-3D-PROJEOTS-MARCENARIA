import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "arranhador-banco";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

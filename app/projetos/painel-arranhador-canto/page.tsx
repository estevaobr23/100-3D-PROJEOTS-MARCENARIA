import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "painel-arranhador-canto";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

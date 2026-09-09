import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "mirante-de-janela";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

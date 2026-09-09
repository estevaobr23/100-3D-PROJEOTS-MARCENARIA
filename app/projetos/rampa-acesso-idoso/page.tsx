import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "rampa-acesso-idoso";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

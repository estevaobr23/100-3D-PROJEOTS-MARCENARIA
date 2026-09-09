import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "passarela-recorte-reto";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

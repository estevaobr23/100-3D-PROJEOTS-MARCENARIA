import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "cama-tecido-tenso";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

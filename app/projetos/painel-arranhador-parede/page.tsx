import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "painel-arranhador-parede";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

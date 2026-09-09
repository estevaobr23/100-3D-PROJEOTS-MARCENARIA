import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "poste-arranhador-plataforma";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

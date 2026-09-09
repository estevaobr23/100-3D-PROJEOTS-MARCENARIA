import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "plataforma-descanso-simples";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

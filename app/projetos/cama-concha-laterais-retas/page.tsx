import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "cama-concha-laterais-retas";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

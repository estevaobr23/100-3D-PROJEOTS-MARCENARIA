import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "ponte-ripas-corda";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

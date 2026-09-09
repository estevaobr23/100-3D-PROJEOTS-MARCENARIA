import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "nicho-tunel-retangular";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

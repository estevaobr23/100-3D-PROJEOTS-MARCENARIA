import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "nicho-tunel-entrada-angulo";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

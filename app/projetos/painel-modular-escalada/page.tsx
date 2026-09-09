import { criarMetadataProjeto, PaginaProjeto } from "../pagina-projeto";

const slug = "painel-modular-escalada";
export const metadata = criarMetadataProjeto(slug);

export default function Projeto() {
  return <PaginaProjeto slug={slug} />;
}

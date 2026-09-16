import type { Metadata, Viewport } from "next";
import { Navegacao } from "./navegacao";
import { Cabecalho } from "./cabecalho";
import "./globals.css";
import "./inicio.css";

export const metadata: Metadata = {
  title: "Móveis para Gatos",
  description: "Novo acervo de móveis para gatos em criação.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Cabecalho>
          <div className="envolucro iniTopoInterno">
            <a className="iniMarca" href="/">
              <span className="iniMarcaIcone" aria-hidden>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1.4 14.2 5v6L8 14.6 1.8 11V5L8 1.4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M1.8 5 8 8.5 14.2 5M8 8.5v6.1" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="iniMarcaTexto">
                <span>Móveis para Gatos</span>
                <span className="iniMarcaSub">FICHAS VISUAIS</span>
              </span>
            </a>
          </div>
        </Cabecalho>

        <Navegacao />
        {children}

        <footer className="iniRodape">
          <div className="envolucro">
            Novo acervo em criação. Cada projeto será publicado somente após a
            revisão visual e técnica da nova coleção.
          </div>
        </footer>
      </body>
    </html>
  );
}

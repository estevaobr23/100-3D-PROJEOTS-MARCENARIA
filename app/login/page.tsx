import type { Metadata } from "next";
import { FormularioLogin } from "./formulario-login";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Entrar · Móveis para Gatos",
  description: "Acesse suas fichas técnicas e projetos 3D de móveis para gatos.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const temErro = error === "invalid_email" || error === "not_found";

  return (
    <main className={`${styles.tela} loginPagina`}>
      <section className={styles.conteudo} aria-labelledby="login-titulo">
        <div className={styles.marca}>
          <span className={styles.marcaIcone} aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m12 3 8 4.7v8.6L12 21l-8-4.7V7.7L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="m4 7.7 8 4.6 8-4.6M12 12.3V21" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            <strong>Móveis para Gatos</strong>
            <small>PROJETOS 3D</small>
          </span>
        </div>

        <header className={styles.cabecalho}>
          <h1 id="login-titulo">Seus projetos estão prontos.</h1>
          <p>Entre com o e-mail usado na compra para acessar seu material.</p>
        </header>

        <img
          className={styles.mockup}
          src="/mockups/login-produto-v1.webp"
          width="1200"
          height="900"
          alt="Fichas técnicas, área de membros e projetos de móveis para gatos"
        />

        <div className={styles.acesso}>
          <FormularioLogin erro={temErro} />
          <div className={styles.seguranca}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v10H6V10Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span>Acesso seguro e exclusivo para compradores.</span>
          </div>
        </div>
      </section>

      <p className={styles.rodape}>© 2026 Móveis para Gatos</p>
    </main>
  );
}

import type { Metadata } from "next";
import { FormularioLogin } from "./formulario-login";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Entrar · Móveis para Gatos",
  description: "Acesse sua biblioteca de projetos 3D de móveis para gatos.",
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
      <section className={styles.apresentacao} aria-labelledby="login-titulo">
        <div className={styles.marca}>
          <span className={styles.marcaIcone} aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m12 3 8 4.7v8.6L12 21l-8-4.7V7.7L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="m4 7.7 8 4.6 8-4.6M12 12.3V21" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </span>
          <span><strong>Móveis para Gatos</strong><small>PROJETOS 3D</small></span>
        </div>

        <div className={styles.textoPrincipal}>
          <span className={styles.sobretitulo}>SUA OFICINA DIGITAL</span>
          <h1 id="login-titulo">Projetos claros.<br />Construção possível.</h1>
          <p>Consulte modelos 3D, explore cada peça e organize os custos dos seus móveis em um só lugar.</p>
          <div className={styles.beneficios}>
            <span><i>01</i> Modelos interativos</span>
            <span><i>02</i> Vista técnica</span>
            <span><i>03</i> Planejamento de custos</span>
          </div>
        </div>

        <div className={styles.desenho} aria-hidden>
          <svg viewBox="0 0 420 300" fill="none">
            <path className={styles.grade} d="M20 260h380M48 280 360 28M118 280 390 62M188 280 410 99M258 280 420 137M328 280 420 191" />
            <path className={styles.linhaFina} d="M118 235h178v18H118v-18Zm82-126h24v126h-24V109Zm-64 39h79v17h-79v-17Zm68-53h83v17h-83V95Z" />
            <path className={styles.linhaForte} d="M106 225h202v27H106v-27Zm80-128h49v128h-49V97Zm-63 39h85v29h-85v-29Zm87-53h91v29h-91V83Z" />
            <path className={styles.medida} d="M95 267h222M95 262v10m222-10v10M84 81v172M79 81h10m-10 172h10" />
          </svg>
        </div>
      </section>

      <section className={styles.acesso} aria-label="Entrar na área de membros">
        <div className={styles.cartao}>
          <span className={styles.etiqueta}>ÁREA DE MEMBROS</span>
          <h2>Bem-vindo de volta</h2>
          <p className={styles.instrucao}>Digite o e-mail utilizado na compra para acessar sua biblioteca.</p>
          <FormularioLogin erro={temErro} />
          <div className={styles.seguranca}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v10H6V10Z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span>Acesso seguro e exclusivo para compradores.</span>
          </div>
        </div>
        <p className={styles.rodape}>© 2026 Móveis para Gatos · Projetos para marcenaria</p>
      </section>
    </main>
  );
}

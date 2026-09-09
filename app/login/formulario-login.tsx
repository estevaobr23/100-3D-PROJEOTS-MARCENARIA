"use client";

import { useFormStatus } from "react-dom";
import { login } from "./actions";
import styles from "./login.module.css";

function BotaoEntrar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.entrar} type="submit" disabled={pending}>
      {pending ? "Verificando…" : "Acessar meus projetos"}
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function FormularioLogin({ erro }: { erro?: boolean }) {
  return (
    <form className={styles.formulario} action={login}>
      <label className={styles.campo} htmlFor="email-login">
        <span>E-mail usado na compra</span>
        <div className={styles.entradaCaixa}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.6" />
            <path d="m5 7.5 7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <input
            id="email-login"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            required
          />
        </div>
      </label>

      <BotaoEntrar />

      {erro && (
        <p className={styles.demonstracao} role="alert">
          Não encontramos uma compra ativa com esse e-mail. Use o mesmo e-mail
          da compra. Se acabou de comprar, aguarde um instante e tente de novo.
        </p>
      )}
    </form>
  );
}

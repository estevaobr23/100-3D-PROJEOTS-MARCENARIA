"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth/session";

/** Encerra a sessão (banco + cookie) e volta para a tela de login. */
export async function sair() {
  await destroySession();
  redirect("/login");
}

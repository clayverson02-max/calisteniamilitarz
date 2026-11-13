/*
 * Meta Pixel — eventos do funil.
 *
 * O pixel base é carregado no head (src/routes/__root.tsx). Aqui ficam só os
 * disparos de evento, com guarda para quando o fbq ainda não carregou ou o
 * visitante usa bloqueador: nenhuma etapa do quiz pode travar por causa disso.
 *
 * NÃO coloque o token da Conversions API neste arquivo nem em nenhum outro de
 * src/: tudo em src/ vai para o navegador do visitante e o token ficaria
 * público. A CAPI é configurada no servidor (UTMify ou a integração Meta da
 * própria Hotmart), onde o token não sai do servidor deles.
 */

export const PIXEL_ID = "1843342580035792";

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === "function" ? f : null;
}

/** Evento padrão do Meta (PageView, Lead, InitiateCheckout, ViewContent...). */
export function track(event: string, params?: Record<string, unknown>) {
  try {
    fbq()?.("track", event, params);
  } catch {
    /* bloqueador de anúncios: segue o funil normalmente */
  }
}

/** Evento personalizado, para as etapas do quiz. */
export function trackCustom(event: string, params?: Record<string, unknown>) {
  try {
    fbq()?.("trackCustom", event, params);
  } catch {
    /* idem */
  }
}

/** Uma etapa concluída do quiz: QuizStep com o número da pergunta. */
export function trackQuizStep(step: number, total: number) {
  trackCustom("QuizStep", { step, total });
}

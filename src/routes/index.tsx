import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Landing } from "@/components/funnel/Landing";
import { Quiz } from "@/components/funnel/Quiz";
import { Loading, Results, Vsl } from "@/components/funnel/Steps";
import { Sales } from "@/components/funnel/Sales";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desafío de Calistenia Militar — 21 días" },
      { name: "description", content: "Consigue un físico marcado en solo 21 días sin salir de casa con el Desafío de Calistenia Militar." },
      { property: "og:title", content: "Desafío de Calistenia Militar — 21 días" },
      { property: "og:description", content: "Físico marcado en 21 días, sin gimnasio. Haz el cuestionario y recibe tu protocolo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Funnel,
});

type Step = "landing" | "quiz" | "loading" | "results" | "vsl" | "sales";

/*
 * Consulta de país. Roda uma vez, assim que o funil monta, e com limite de
 * tempo: antes ela era disparada no clique de "Acceder al protocolo" e sem
 * timeout, então um ipwho.is lento deixava o botão sem resposta.
 */
const GEO_TIMEOUT_MS = 1200;

function fallbackBrazil(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator.language || "").toLowerCase().startsWith("pt-br");
}

async function isBrazil(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), GEO_TIMEOUT_MS);
  try {
    const r = await fetch("https://ipwho.is/", { signal: ctrl.signal });
    const j = (await r.json()) as { country_code?: string };
    return j.country_code === "BR";
  } catch {
    return fallbackBrazil();
  } finally {
    clearTimeout(t);
  }
}

function Funnel() {
  const [step, setStep] = useState<Step>("landing");
  const [age, setAge] = useState(0);
  const [hideFace, setHideFace] = useState(false);

  // a consulta já está resolvida quando a pessoa chega no botão
  const geo = useRef<Promise<boolean> | null>(null);
  useEffect(() => {
    geo.current = isBrazil();
  }, []);

  const go = useCallback((s: Step) => {
    setStep(s);
    window.scrollTo(0, 0);
  }, []);

  const aoAprovar = useCallback(async () => {
    const br = await (geo.current ?? Promise.resolve(fallbackBrazil()));
    if (br) {
      setHideFace(true);
      go("sales");
    } else {
      go("vsl");
    }
  }, [go]);

  return (
    <main className="min-h-screen">
      {step === "landing" && <Landing onStart={(v) => { setAge(v); go("quiz"); }} />}
      {step === "quiz" && <Quiz initial={{ 3: age }} onComplete={() => go("loading")} />}
      {step === "loading" && <Loading onComplete={() => go("results")} />}
      {step === "results" && <Results onContinue={aoAprovar} />}
      {step === "vsl" && <Vsl onComplete={() => go("sales")} />}
      {step === "sales" && <Sales hideFace={hideFace} />}
    </main>
  );
}

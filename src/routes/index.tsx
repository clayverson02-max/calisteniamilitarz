import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

async function isBrazil(): Promise<boolean> {
  try {
    const r = await fetch("https://ipwho.is/");
    const j = (await r.json()) as { country_code?: string };
    return j.country_code === "BR";
  } catch {
    return (navigator.language || "").toLowerCase().startsWith("pt-br");
  }
}

function Funnel() {
  const [step, setStep] = useState<Step>("landing");
  const [age, setAge] = useState(0);
  const [hideFace, setHideFace] = useState(false);
  const go = (s: Step) => { setStep(s); window.scrollTo(0, 0); };
  return (
    <main className="min-h-screen">
      {step === "landing" && <Landing onStart={(v) => { setAge(v); go("quiz"); }} />}
      {step === "quiz" && <Quiz initial={{ 3: age }} onComplete={() => go("loading")} />}
      {step === "loading" && <Loading onComplete={() => go("results")} />}
      {step === "results" && <Results onContinue={async () => { if (await isBrazil()) { setHideFace(true); go("sales"); } else go("vsl"); }} />}
      {step === "vsl" && <Vsl onComplete={() => go("sales")} />}
      {step === "sales" && <Sales hideFace={hideFace} />}
    </main>
  );
}

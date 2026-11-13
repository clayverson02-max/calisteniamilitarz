import { createElement, useEffect, useRef, useState } from "react";
import { VSL_ID, VSL_POSTER } from "@/lib/funnel-data";

const loadingTexts = ["ANALISANDO PERFIL TÁCTICO", "GENERANDO PROTOCOLO MILITAR", "PREPARANDO TU MISIÓN DE 21 DÍAS", "FINALIZANDO TU RECLUTAMIENTO"];

export function Loading({ onComplete }: { onComplete: () => void }) {
  const [p, setP] = useState(0);
  const done = useRef(onComplete); done.current = onComplete;
  useEffect(() => {
    const t = setInterval(() => setP((x) => { if (x >= 100) { clearInterval(t); setTimeout(() => done.current(), 400); return 100; } return x + 1; }), 50);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary/30 bg-card/50 p-8">
        <div className="animate-scan pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,var(--color-primary)_50%)] bg-[length:100%_4px] opacity-5" />
        <div className="mb-6 flex justify-between font-mono text-[10px] uppercase text-primary"><span>Protocolo: 2026</span><span>Estado: Analizando</span></div>
        <h2 className="text-center text-xl font-black uppercase">Procesando reclutamiento</h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">Verificando compatibilidad operativa...</p>
        <div className="mb-2 text-center text-6xl font-black tabular-nums text-primary">{p}%</div>
        <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary shadow-glow" style={{ width: `${p}%` }} /></div>
        <p className="mt-6 font-mono text-xs text-primary">{"> "}{loadingTexts[Math.min(3, Math.floor(p / 25))]}</p>
        <p className="font-mono text-xs text-muted-foreground">{"> Ejecutando secuencia..."}</p>
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Sistema Seguro // Acceso Limitado</p>
      </div>
    </div>
  );
}

export function Results({ onContinue }: { onContinue: () => void }) {
  const items = [
    ["📋", "Protocolo Generado", "Plan de entrenamiento adaptado a tu biotipo y objetivos actuales."],
    ["🎥", "Acceso a Videos", "Biblioteca técnica con ejecución correcta de cada movimiento."],
    ["🔥", "Garantía de Resultados", "Método probado en campo con tasa de éxito del 98%."],
  ];
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-4xl shadow-glow">🎖️</div>
        <h1 className="text-3xl font-black uppercase">Recluta <span className="text-primary">Aprobado</span></h1>
        <p className="mt-2 text-muted-foreground">Tu perfil cumple con los requisitos para el <span className="font-bold text-foreground">Protocolo de Fuerzas Especiales</span>.</p>
        <div className="mt-8 rounded-2xl border border-primary/30 bg-card/50 text-left">
          <div className="flex justify-between border-b border-primary/20 p-4 font-mono text-xs uppercase text-primary"><span>Informe final</span><span>ID: #8X-299</span></div>
          <div className="space-y-5 p-5">
            {items.map(([e, t, d]) => (
              <div key={t} className="flex gap-4"><span className="text-2xl">{e}</span><div><h3 className="font-bold">{t}</h3><p className="text-sm text-muted-foreground">{d}</p></div></div>
            ))}
          </div>
        </div>
        <button onClick={onContinue} className="mt-8 w-full rounded-xl bg-primary py-4 text-lg font-black uppercase text-primary-foreground shadow-glow">Acceder al protocolo 🔓</button>
      </div>
    </div>
  );
}

export function Vsl({ onComplete }: { onComplete: () => void }) {
  const [left, setLeft] = useState(540);
  useEffect(() => {
    const t = setInterval(() => setLeft((x) => (x <= 1 ? (clearInterval(t), 0) : x - 1)), 1000);
    const s = document.createElement("script");
    s.src = "https://cdn.vslwave.site/p/player.v1.js"; s.async = true;
    document.head.appendChild(s);
    return () => { clearInterval(t); s.remove(); };
  }, []);
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md text-center">
        <p className="text-lg font-black">Tu video ha comenzado, míralo y desbloquea el protocolo.</p>
        <p className="mb-6 text-sm text-muted-foreground">El video debe ser visto completo para continuar</p>
        <div className="overflow-hidden rounded-xl border border-primary/30">
          {createElement("x-vsl", { "data-id": VSL_ID, "data-poster": VSL_POSTER, "data-aspect": "0.5625", style: { display: "block", margin: "0 auto", width: "100%", "--ratio": "177.78%" } })}
        </div>
        {left === 0 && (
          <button onClick={onComplete} className="bg-cta mt-6 w-full rounded-xl py-4 text-lg font-black uppercase text-accent-foreground">👊 Acceder al protocolo</button>
        )}
      </div>
    </div>
  );
}

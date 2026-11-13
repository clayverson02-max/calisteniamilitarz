import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { questions, socialProof, type Option } from "@/lib/funnel-data";

type Answers = Record<string, number | number[]>;

function Ruler({ min, max, value, unit, onChange }: { min: number; max: number; value: number; unit: string; onChange: (v: number) => void }) {
  const STEP = 40;
  const [drag, setDrag] = useState<{ x: number; start: number } | null>(null);
  const offset = -(value - min) * STEP;
  const pos = (e: PointerEvent | React.PointerEvent) => e.clientX;
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const o = Math.min(0, Math.max(-(max - min) * STEP, drag.start + pos(e) - drag.x));
      onChange(Math.round(-o / STEP) + min);
    };
    const up = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [drag, min, max, onChange]);
  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex items-end">
        <span className="text-8xl font-black italic tabular-nums tracking-tighter md:text-9xl">{value}</span>
        <span className="mb-4 ml-2 text-3xl font-bold italic text-primary md:text-4xl">{unit}</span>
      </div>
      <div onPointerDown={(e) => setDrag({ x: pos(e), start: offset })}
        className="relative h-[120px] w-full cursor-grab touch-none select-none overflow-hidden border-y border-primary/40 bg-background/20 active:cursor-grabbing">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-0.5 -translate-x-1/2 bg-primary shadow-glow" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-32" />
        <div className="absolute left-1/2 top-0 h-full" style={{ transform: `translateX(${offset}px)`, transition: drag ? "none" : "transform .2s" }}>
          {ticks.map((t) => (
            <div key={t} className="absolute flex h-full w-10 -translate-x-1/2 flex-col items-center justify-center" style={{ left: (t - min) * STEP }}>
              <div className={t % 10 === 0 ? "h-16 w-1 rounded-full bg-foreground" : t % 5 === 0 ? "h-10 w-0.5 bg-foreground/40" : "h-6 w-px bg-foreground/10"} />
              {t % 10 === 0 && <div className="absolute bottom-4 font-mono text-xs font-bold text-foreground/40">{t}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="h-12 w-12 rounded-full border border-primary/40 text-2xl">−</button>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="h-12 w-12 rounded-full border border-primary/40 text-2xl">+</button>
      </div>
      <p className="mt-8 animate-pulse text-center text-xs font-black uppercase tracking-[0.2em] text-primary/60">Arrastre para ajustar</p>
    </div>
  );
}

function SocialProof({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [i, setI] = useState(0);
  const done = useRef(onDone); done.current = onDone;
  useEffect(() => {
    const a = setInterval(() => setI((x) => (x + 1) % socialProof.length), 2000);
    const b = setTimeout(() => done.current(), seconds * 1000);
    return () => { clearInterval(a); clearTimeout(b); };
  }, [seconds]);
  const s = socialProof[i]!;
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Resultados Verificados</p>
      <h2 className="my-3 text-2xl font-black uppercase md:text-3xl">Esto va a pasarte a ti</h2>
      <p className="mb-4 text-4xl font-black text-primary">21 Días</p>
      <div className="grid grid-cols-2 gap-3">
        {[{ d: "DÍA 0", l: "Antes", src: s.img }, { d: "DÍA 21", l: "Después", src: s.img2 }].map((x) => (
          <div key={x.d} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/30">
            <img src={x.src} alt={x.l} className="h-full w-full object-cover" />
            <div className="absolute left-2 top-2 rounded bg-background/70 px-2 py-1 text-xs font-bold">{x.d} · {x.l}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 font-bold">{s.name}</p>
      <p className="text-sm text-muted-foreground">"{s.text}"</p>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">Sin químicos • Sin gimnasio • Solo protocolo</p>
      <p className="mt-2 text-sm"><span className="font-black text-primary">+12.000</span> Hombres</p>
    </div>
  );
}

function OptionButton({ o, selected, onClick }: { o: Option; selected: boolean; onClick: () => void }) {
  if (o.image) {
    return (
      <button onClick={onClick} className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${selected ? "border-primary shadow-glow" : "border-primary/20 hover:border-primary/60"}`}>
        <div className="aspect-square w-full overflow-hidden bg-card"><img src={o.image} alt={o.label} className="h-full w-full object-cover transition-transform group-hover:scale-105" /></div>
        <div className={`flex items-center justify-between gap-2 p-3 text-sm font-bold ${selected ? "bg-primary text-primary-foreground" : "bg-card"}`}>
          <span>{o.label}</span>{selected && <Check className="h-4 w-4" />}
        </div>
      </button>
    );
  }
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left font-bold transition-all ${selected ? "border-primary bg-primary/20" : "border-primary/20 bg-card hover:border-primary/60"}`}>
      <span className="text-2xl">{o.emoji}</span><span className="flex-1">{o.label}</span>{selected && <Check className="h-5 w-5 text-primary" />}
    </button>
  );
}

export function Quiz({ initial, onComplete }: { initial: Answers; onComplete: (a: Answers) => void }) {
  const [idx, setIdx] = useState(1);
  const [answers, setAnswers] = useState<Answers>(initial);
  const [locked, setLocked] = useState(false);
  const q = questions[idx]!;
  const pct = ((idx + 1) / questions.length) * 100;
  const next = (a: Answers) => (idx < questions.length - 1 ? setIdx(idx + 1) : onComplete(a));

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest">
            <span className="text-primary">Cuestionario <span className="text-muted-foreground">· Pregunta {String(idx + 1).padStart(2, "0")}</span></span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary shadow-glow transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
        {q.type === "social-proof" ? (
          <SocialProof key={String(q.id)} seconds={q.autoSkip} onDone={() => next(answers)} />
        ) : (
          <>
            <h2 className="mb-2 text-center text-2xl font-black uppercase md:text-3xl">{q.question}</h2>
            {"description" in q && q.description && <p className="mb-4 text-center text-muted-foreground">{q.description}</p>}
            <div className="mt-6">
              {q.type === "slider" ? (
                <>
                  <Ruler key={q.id} {...q.slider} value={(answers[q.id] as number) ?? q.slider.defaultValue} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
                  <button onClick={() => next({ ...answers, [q.id]: (answers[q.id] as number) ?? q.slider.defaultValue })} className="mt-8 w-full rounded-xl bg-primary py-4 font-black uppercase text-primary-foreground shadow-glow">Continuar</button>
                </>
              ) : (
                <>
                  <div className={q.options[0]?.image ? "grid grid-cols-2 gap-4" : "space-y-3"}>
                    {q.options.map((o) => {
                      const cur = answers[q.id];
                      const sel = q.type === "multiselect" ? Array.isArray(cur) && cur.includes(o.value) : cur === o.value;
                      return (
                        <OptionButton key={o.value} o={o} selected={sel} onClick={() => {
                          if (q.type === "multiselect") {
                            const arr = Array.isArray(cur) ? cur : [];
                            setAnswers({ ...answers, [q.id]: arr.includes(o.value) ? arr.filter((x) => x !== o.value) : [...arr, o.value] });
                          } else if (!locked) {
                            const a = { ...answers, [q.id]: o.value };
                            setAnswers(a); setLocked(true);
                            setTimeout(() => { setLocked(false); next(a); }, 400);
                          }
                        }} />
                      );
                    })}
                  </div>
                  {q.type === "multiselect" && (
                    <button disabled={!Array.isArray(answers[q.id]) || !(answers[q.id] as number[]).length} onClick={() => next(answers)} className="mt-6 w-full rounded-xl bg-primary py-4 font-black uppercase text-primary-foreground shadow-glow disabled:opacity-40">Continuar</button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {idx > 1 && <button onClick={() => setIdx(idx - 1)} className="mx-auto mt-8 block text-xs font-bold uppercase tracking-widest text-muted-foreground">← Anterior</button>}
      </div>
    </div>
  );
}

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { questions, socialProof, type Option, type Question } from "@/lib/funnel-data";
import { trackQuizStep, track } from "@/lib/pixel";

type Answers = Record<string, number | number[]>;

/** Tempo que a opção fica marcada antes de avançar. Acima de ~200 ms o quiz
 *  começa a parecer travado no celular. */
const LOCK_MS = 150;

/* ------------------------------------------------------------------ *
 * Pré-carregamento: as imagens da próxima etapa baixam enquanto a
 * pessoa responde a atual. Sem isso, cada etapa com fotos (até ~500 KB)
 * abre com os cards vazios.
 * ------------------------------------------------------------------ */
function imagensDe(q: Question | undefined): string[] {
  if (!q) return [];
  if (q.type === "social-proof") return socialProof.flatMap((s) => [s.img, s.img2]);
  if ("options" in q) return q.options.map((o) => o.image).filter((x): x is string => !!x);
  return [];
}

const jaPedidas = new Set<string>();
function precarregar(urls: string[]) {
  if (typeof window === "undefined") return;
  for (const u of urls) {
    if (jaPedidas.has(u)) continue;
    jaPedidas.add(u);
    const img = new Image();
    img.decoding = "async";
    img.src = u;
  }
}

/* ------------------------------------------------------------------ *
 * Régua
 * ------------------------------------------------------------------ */
const STEP = 40;

/** Os traços não dependem do valor escolhido, só do intervalo. Isolados num
 *  memo, arrastar deixa de re-renderizar 80 a 110 nós por quadro. */
const Tracos = memo(function Tracos({ min, max }: { min: number; max: number }) {
  const ticks = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );
  return (
    <>
      {ticks.map((t) => (
        <div
          key={t}
          className="absolute flex h-full w-10 -translate-x-1/2 flex-col items-center justify-center"
          style={{ left: (t - min) * STEP }}
        >
          <div
            className={
              t % 10 === 0
                ? "h-16 w-1 rounded-full bg-foreground"
                : t % 5 === 0
                  ? "h-10 w-0.5 bg-foreground/40"
                  : "h-6 w-px bg-foreground/10"
            }
          />
          {t % 10 === 0 && (
            <div className="absolute bottom-4 font-mono text-xs font-bold text-foreground/40">{t}</div>
          )}
        </div>
      ))}
    </>
  );
});

function Ruler({
  min,
  max,
  value,
  unit,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const offset = -(value - min) * STEP;

  // refs para que o listener de pointermove seja montado uma única vez por
  // arrasto, e não a cada mudança de valor
  const aoMudar = useRef(onChange);
  aoMudar.current = onChange;
  const inicio = useRef({ x: 0, offset: 0 });
  const quadro = useRef(0);
  const pendente = useRef<number | null>(null);

  const comecar = useCallback(
    (e: React.PointerEvent) => {
      inicio.current = { x: e.clientX, offset };
      setDragging(true);
    },
    [offset],
  );

  useEffect(() => {
    if (!dragging) return;
    const limite = -(max - min) * STEP;

    // um único aviso de mudança por quadro: o pointermove dispara bem mais
    // vezes que isso e cada um custava um render da árvore inteira
    const aplicar = () => {
      quadro.current = 0;
      if (pendente.current === null) return;
      aoMudar.current(pendente.current);
      pendente.current = null;
    };

    const move = (e: PointerEvent) => {
      const o = Math.min(0, Math.max(limite, inicio.current.offset + e.clientX - inicio.current.x));
      pendente.current = Math.round(-o / STEP) + min;
      if (!quadro.current) quadro.current = requestAnimationFrame(aplicar);
    };
    const up = () => setDragging(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      if (quadro.current) cancelAnimationFrame(quadro.current);
      quadro.current = 0;
      pendente.current = null;
    };
  }, [dragging, min, max]);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-6 flex items-end">
        <span className="text-8xl font-black italic tabular-nums tracking-tighter md:text-9xl">{value}</span>
        <span className="mb-4 ml-2 text-3xl font-bold italic text-primary md:text-4xl">{unit}</span>
      </div>
      <div
        onPointerDown={comecar}
        className="relative h-[120px] w-full cursor-grab touch-none select-none overflow-hidden border-y border-primary/40 bg-background/20 active:cursor-grabbing"
      >
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-0.5 -translate-x-1/2 bg-primary shadow-glow" />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-32" />
        <div
          className="absolute left-1/2 top-0 h-full will-change-transform"
          style={{ transform: `translateX(${offset}px)`, transition: dragging ? "none" : "transform .2s" }}
        >
          <Tracos min={min} max={max} />
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          aria-label="Restar uno"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-12 w-12 rounded-full border border-primary/40 text-2xl"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Sumar uno"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-12 w-12 rounded-full border border-primary/40 text-2xl"
        >
          +
        </button>
      </div>
      <p className="mt-8 animate-pulse text-center text-xs font-black uppercase tracking-[0.2em] text-primary/60">
        Arrastre para ajustar
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Prova social
 * ------------------------------------------------------------------ */
function SocialProof({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [i, setI] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const a = setInterval(() => setI((x) => (x + 1) % socialProof.length), 2000);
    const b = setTimeout(() => done.current(), seconds * 1000);
    return () => {
      clearInterval(a);
      clearTimeout(b);
    };
  }, [seconds]);
  const s = socialProof[i]!;
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Resultados Verificados</p>
      <h2 className="my-3 text-2xl font-black uppercase md:text-3xl">Esto va a pasarte a ti</h2>
      <p className="mb-4 text-4xl font-black text-primary">21 Días</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { d: "DÍA 0", l: "Antes", src: s.img },
          { d: "DÍA 21", l: "Después", src: s.img2 },
        ].map((x) => (
          <div key={x.d} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/30">
            <img src={x.src} alt={x.l} decoding="async" className="h-full w-full object-cover" />
            <div className="absolute left-2 top-2 rounded bg-background/70 px-2 py-1 text-xs font-bold">
              {x.d} · {x.l}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 font-bold">{s.name}</p>
      <p className="text-sm text-muted-foreground">"{s.text}"</p>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
        Sin químicos • Sin gimnasio • Solo protocolo
      </p>
      <p className="mt-2 text-sm">
        <span className="font-black text-primary">+12.000</span> Hombres
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Opção
 * ------------------------------------------------------------------ */
const OptionButton = memo(function OptionButton({
  o,
  selected,
  onClick,
}: {
  o: Option;
  selected: boolean;
  onClick: () => void;
}) {
  if (o.image) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group relative overflow-hidden rounded-xl border-2 text-left transition-colors ${selected ? "border-primary shadow-glow" : "border-primary/20 hover:border-primary/60"}`}
      >
        <div className="aspect-square w-full overflow-hidden bg-card">
          <img
            src={o.image}
            alt={o.label}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div
          className={`flex items-center justify-between gap-2 p-3 text-sm font-bold ${selected ? "bg-primary text-primary-foreground" : "bg-card"}`}
        >
          <span>{o.label}</span>
          {selected && <Check className="h-4 w-4" />}
        </div>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left font-bold transition-colors ${selected ? "border-primary bg-primary/20" : "border-primary/20 bg-card hover:border-primary/60"}`}
    >
      <span className="text-2xl">{o.emoji}</span>
      <span className="flex-1">{o.label}</span>
      {selected && <Check className="h-5 w-5 text-primary" />}
    </button>
  );
});

/* ------------------------------------------------------------------ *
 * Quiz
 * ------------------------------------------------------------------ */
export function Quiz({ initial, onComplete }: { initial: Answers; onComplete: (a: Answers) => void }) {
  const [idx, setIdx] = useState(1);
  const [answers, setAnswers] = useState<Answers>(initial);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const q = questions[idx]!;
  const pct = ((idx + 1) / questions.length) * 100;

  // a próxima etapa baixa as imagens enquanto esta está na tela
  useEffect(() => {
    precarregar(imagensDe(questions[idx]));
    precarregar(imagensDe(questions[idx + 1]));
  }, [idx]);

  // cada etapa começa no topo e marca o evento no pixel
  useEffect(() => {
    window.scrollTo(0, 0);
    trackQuizStep(idx + 1, questions.length);
  }, [idx]);

  // nenhum timer pendente sobrevive à saída do quiz
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const next = useCallback(
    (a: Answers) => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
      } else {
        track("Lead", { content_name: "quiz_completo" });
        onComplete(a);
      }
    },
    [idx, onComplete],
  );

  const escolher = useCallback(
    (o: Option) => {
      const cur = answers[q.id];
      if (q.type === "multiselect") {
        const arr = Array.isArray(cur) ? cur : [];
        setAnswers({
          ...answers,
          [q.id]: arr.includes(o.value) ? arr.filter((x) => x !== o.value) : [...arr, o.value],
        });
        return;
      }
      if (locked.current) return;
      locked.current = true;
      const a = { ...answers, [q.id]: o.value };
      setAnswers(a);
      timer.current = setTimeout(() => {
        locked.current = false;
        next(a);
      }, LOCK_MS);
    },
    [answers, q, next],
  );

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-widest">
            <span className="text-primary">
              Cuestionario <span className="text-muted-foreground">· Pregunta {String(idx + 1).padStart(2, "0")}</span>
            </span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary shadow-glow transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {q.type === "social-proof" ? (
          <SocialProof key={String(q.id)} seconds={q.autoSkip} onDone={() => next(answers)} />
        ) : (
          <>
            <h2 className="mb-2 text-center text-2xl font-black uppercase md:text-3xl">{q.question}</h2>
            {"description" in q && q.description && (
              <p className="mb-4 text-center text-muted-foreground">{q.description}</p>
            )}
            <div className="mt-6">
              {q.type === "slider" ? (
                <>
                  <Ruler
                    key={q.id}
                    {...q.slider}
                    value={(answers[q.id] as number) ?? q.slider.defaultValue}
                    onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  />
                  <button
                    type="button"
                    onClick={() => next({ ...answers, [q.id]: (answers[q.id] as number) ?? q.slider.defaultValue })}
                    className="mt-8 w-full rounded-xl bg-primary py-4 font-black uppercase text-primary-foreground shadow-glow"
                  >
                    Continuar
                  </button>
                </>
              ) : (
                <>
                  <div className={q.options[0]?.image ? "grid grid-cols-2 gap-4" : "space-y-3"}>
                    {q.options.map((o) => {
                      const cur = answers[q.id];
                      const sel =
                        q.type === "multiselect"
                          ? Array.isArray(cur) && cur.includes(o.value)
                          : cur === o.value;
                      return <OptionButton key={o.value} o={o} selected={sel} onClick={() => escolher(o)} />;
                    })}
                  </div>
                  {q.type === "multiselect" && (
                    <button
                      type="button"
                      disabled={!Array.isArray(answers[q.id]) || !(answers[q.id] as number[]).length}
                      onClick={() => next(answers)}
                      className="mt-6 w-full rounded-xl bg-primary py-4 font-black uppercase text-primary-foreground shadow-glow disabled:opacity-40"
                    >
                      Continuar
                    </button>
                  )}
                </>
              )}
            </div>
          </>
        )}
        {idx > 1 && (
          <button
            type="button"
            onClick={() => setIdx(idx - 1)}
            className="mx-auto mt-8 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            ← Anterior
          </button>
        )}
      </div>
    </div>
  );
}

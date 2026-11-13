import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CHECKOUT_URL } from "@/lib/funnel-data";

const Cta = ({ children }: { children: React.ReactNode }) => (
  <a href={CHECKOUT_URL} className="bg-cta block w-full rounded-xl py-4 text-center text-lg font-black uppercase text-accent-foreground shadow-lg transition-transform hover:scale-[1.02]">{children}</a>
);

function StickyBar() {
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(600);
  useEffect(() => {
    const a = setTimeout(() => setShow(true), 60000);
    const b = setInterval(() => setLeft((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => { clearTimeout(a); clearInterval(b); };
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/30 bg-background/95 p-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="flex-1 text-xs">
          <p className="font-black">⚡ HAS SIDO SELECCIONADO PARA EL RECLUTAMIENTO</p>
          <p className="text-muted-foreground">Tu plaza se reservará por: <span className="font-bold text-accent">{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</span></p>
        </div>
        <a href={CHECKOUT_URL} className="bg-cta rounded-lg px-4 py-3 text-xs font-black text-accent-foreground">👊 ACCEDER</a>
      </div>
    </div>
  );
}

const names = ["Carlos", "Juan", "Luis", "Miguel", "José", "Diego", "Antonio", "Manuel", "Javier", "David", "Daniel", "Francisco", "Pablo", "Alejandro", "Fernando", "Eduardo", "Ricardo", "Roberto", "Andrés", "Sergio", "Raúl", "Alberto", "Jorge", "Pedro"];
function PurchaseToast() {
  const [s, setS] = useState<{ name: string; time: number } | null>(null);
  useEffect(() => {
    const fire = () => { setS({ name: names[Math.floor(Math.random() * names.length)]!, time: Math.floor(Math.random() * 5) + 1 }); setTimeout(() => setS(null), 5000); };
    const a = setTimeout(fire, 10000); const b = setInterval(fire, 50000);
    return () => { clearTimeout(a); clearInterval(b); };
  }, []);
  if (!s) return null;
  return (
    <div className="fixed left-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-primary/30 bg-card p-3 shadow-lg animate-in fade-in slide-in-from-top-4">
      <span className="text-2xl">🛒</span><div><p className="text-sm font-bold">{s.name}</p><p className="text-xs text-muted-foreground">compró el protocolo hace {s.time} min</p></div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [o, setO] = useState(false);
  return (
    <div className="rounded-xl border border-primary/20 bg-card/50">
      <button onClick={() => setO(!o)} className="flex w-full justify-between p-4 text-left font-bold"><span>{q}</span><span>{o ? "−" : "+"}</span></button>
      {o && <p className="px-4 pb-4 text-sm text-muted-foreground">{a}</p>}
    </div>
  );
}

const features = [["⚡", "Plan de Entrenamiento (21 Días)"], ["🎥", "Vídeos Demonstrativos"], ["🎮", "Sistema de Gamificación"], ["📡", "Soporte Prioritario"], ["🛡️", "Garantía de 7 Días"]];
const vs = [["😵‍💫 Entrenar sin rumbo", "🎯 Entrenamientos guiados"], ["😔 Entrenar solo", '🪖 Comunidad "Tropa"'], ["📉 Sin progresión", "📈 Protocolo adaptado"], ["🐌 Resultados lentos", "⚡ Resultados en 21 Días"], ["💸 Gimnasio costoso", "🏠 Entrena en casa"]];
const transf = [["t1", "AGENTE 01", "18 DÍAS"], ["t2", "AGENTE 02", "21 DÍAS"], ["t3", "AGENTE 03", "33 DÍAS"], ["t4", "AGENTE 04", "45 DÍAS"]];
const bonos = [
  ["💪", "Guía de Recuperación Muscular", "¡Recupérate como una profesional! Técnicas de estiramiento, descanso activo y consejos esenciales para evitar lesiones y mantener el ritmo en tus entrenamientos.", "$19,90 USD"],
  ["☕", "Café de Combate Termogénico", "La bebida secreta que usaban los soldados de élite para mantener la energía y quemar grasa incluso en medio del combate. Una receta especial con ingredientes naturales que aceleran tu metabolismo.", "$39,90 USD"],
  ["🚀", "Next-Level Avanzado", "¡Lleva tu entrenamiento al siguiente nivel con ejercicios avanzados! Rutinas exclusivas para resistencia extrema, definición total y evolución constante.", "$58,00 USD"],
  ["🗺️", "Mapa de Progreso Táctico", "Visualiza tu transformación como una operación militar. Con esta hoja de ruta diaria, sabrás exactamente qué entrenar y cómo seguir tu evolución.", "$19,90 USD"],
];
const reviews = [
  ["Paulo", "39 years old", "¡Valió la pena intentarlo!", "Siempre hice pesas, pero un amigo me habló de la calistenia militar y decidí probar. ¡Me encantó! Ahora entreno en casa, a mi ritmo, y estoy progresando sin necesitar pesas."],
  ["Rodrigo", "41 years old", "¡Increíble y sin impacto!", "He probado de todo, pero la calistenia militar fue lo único que no me dejó dolorido después. ¡Perdí 8kg en 4 semanas sin lesiones! Lo recomiendo mucho."],
];
const faqs = [
  ["¿Necesito equipo?", "No. El protocolo utiliza el peso de tu propio cuerpo. Puedes hacerlo en casa, en el parque o donde quieras."],
  ["¿Es adecuado para principiantes?", "Sí. El programa está diseñado con progresiones. Empezarás desde tu nivel actual y avanzarás a medida que ganes fuerza."],
  ["¿Cuánto tiempo dura cada entrenamiento?", "Los entrenamientos son intensos y eficientes, duran entre 20 y 40 minutos."],
  ["¿Tengo garantía?", "Sí, ofrecemos una garantía de satisfacción de 7 días. Si no te gusta, te devolvemos tu dinero."],
];

export function Sales({ hideFace }: { hideFace: boolean }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove("opacity-0", "translate-y-10"); io.unobserve(e.target); } }), { threshold: 0.1 });
    document.querySelectorAll("[data-animate]").forEach((el) => { el.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-1000"); io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <div className="pb-24">
      <PurchaseToast /><StickyBar />
      <section className="relative px-4 pt-8 text-center">
        <div className="mx-auto max-w-xl">
          {!hideFace && (
            <div className="relative">
              <img src="/sem-titulo-2.webp" alt="Experto militar" className="mx-auto w-full max-w-md" />
              <div className="absolute bottom-6 left-0 flex flex-col gap-2 text-xs font-black">
                <span className="rounded bg-primary px-3 py-1 text-primary-foreground">★ EX-MILITAR</span>
                <span className="rounded bg-card px-3 py-1">🛡️ ENTRENADOR</span>
              </div>
            </div>
          )}
          <p className="mt-6 font-mono text-sm text-primary">{"> PROTOCOLO SECRETO REVELADO_"}</p>
          <h2 className="mt-2 text-3xl font-black uppercase">Presentamos: el <span className="text-primary">Protocolo Calistenia Militar</span></h2>
          <div className="mt-8 rounded-2xl border-2 border-primary/40 bg-card/60 p-6 text-left shadow-glow">
            <div className="mb-2 flex justify-between font-mono text-[10px] uppercase text-primary"><span>● Acceso autorizado</span><span>ID: 99-21-X</span></div>
            <p className="font-mono text-xs text-muted-foreground">ARCHIVO CLASIFICADO #8821</p>
            <h3 className="text-2xl font-black">PROTOCOLO</h3><h3 className="text-2xl font-black text-primary">CALISTENIA MILITAR</h3>
            <div className="my-4 flex items-end gap-3">
              <span className="text-2xl font-bold">$</span><span className="text-6xl font-black">7,90</span>
              <div className="mb-2 flex flex-col text-xs"><span className="font-bold text-accent">OFERTA</span><span className="text-muted-foreground line-through">$49.90</span></div>
            </div>
            <p className="mb-4 text-sm font-bold">♾️ Acceso Vitalicio</p>
            <ul className="mb-6 space-y-2">{features.map(([i, t]) => <li key={t} className="flex gap-3 text-sm"><span>{i}</span><span>{t}</span></li>)}</ul>
            <a href={CHECKOUT_URL} className="bg-cta flex items-center justify-center gap-2 rounded-xl py-4 text-lg font-black text-accent-foreground">INICIAR MISIÓN <ArrowRight className="h-5 w-5" /></a>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">🔒 SSL SECURE</p>
          </div>
        </div>
      </section>

      <section data-animate className="mx-auto mt-16 max-w-xl px-4">
        <h3 className="mb-6 text-center text-2xl font-black uppercase"><span className="text-accent">VS</span> Análisis táctico</h3>
        <div className="space-y-3">{vs.map(([c, m]) => (
          <div key={c} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3"><div className="text-[10px] font-bold text-destructive">CIVIL</div>{c}</div>
            <span className="text-xs font-black text-muted-foreground">VS</span>
            <div className="rounded-lg border border-primary/40 bg-primary/10 p-3"><div className="text-[10px] font-bold text-primary">MILITAR</div>{m}</div>
          </div>))}
        </div>
      </section>

      <section data-animate className="mx-auto mt-16 max-w-xl px-4">
        <h2 className="mb-6 text-center text-2xl font-black uppercase">Resultados <span className="text-primary">confirmados</span></h2>
        <div className="grid grid-cols-2 gap-3">{transf.map(([s, l, d]) => (
          <div key={s} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/30">
            <img src={`/assets/transformations/${s}.webp`} alt={l} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-2 text-xs font-bold"><div>{l}</div><div className="text-primary">{d}</div></div>
          </div>))}
        </div>
        <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">// CLASIFICADO: RESULTADOS INDIVIDUALES PUEDEN VARIAR //</p>
      </section>

      <section data-animate className="mx-auto mt-16 grid max-w-xl gap-4 px-4">
        <div className="rounded-2xl border border-destructive/30 bg-card/50 p-6">
          <h3 className="mb-4 font-black text-destructive">✕ REALIDAD ACTUAL</h3>
          <ul className="space-y-3 text-sm">
            <li>¿Entrenas duro pero tu físico sigue <b className="text-destructive">débil y estancado</b>?</li>
            <li>¿Has intentado de todo y tu cuerpo simplemente <b className="text-destructive">no responde</b>?</li>
            <li>¿Estás cansado de esforzarte sin ver <b className="text-destructive">resultados reales</b>?</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-primary/40 bg-card/50 p-6">
          <h3 className="mb-4 font-black text-primary">⚠ LA VERDAD BRUTAL</h3>
          <p className="text-sm">La mayoría de los entrenamientos está pensada para <b>quemar calorías</b>.</p>
          <p className="mt-2 text-sm">El Protocolo Militar está diseñado para <b className="text-primary">FORJAR</b> un cuerpo de combate.</p>
        </div>
      </section>

      <section data-animate className="mx-auto mt-16 max-w-xl px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">● Centro de comando personal</p>
        <h2 className="mt-2 text-3xl font-black uppercase">Tu mando táctico <br /><span className="text-primary">en tu bolsillo</span></h2>
        <p className="mt-3 text-muted-foreground">Interfaz intuitiva y profesional. <b className="text-foreground">Todo lo que necesitas</b> para tu transformación en una sola app.</p>
        <div className="mt-6 grid grid-cols-4 gap-2 text-xs">{[["💪", "+100", "Ejercicios"], ["🎥", "HD", "Vídeos"], ["♾️", "Acceso", "Vitalicio"], ["👥", "Comunidad", "VIP"]].map(([i, a, b]) => (
          <div key={b} className="rounded-xl border border-primary/30 bg-card/50 p-3"><div className="text-xl">{i}</div><div className="font-black">{a}</div><div className="text-muted-foreground">{b}</div></div>))}
        </div>
        <img src="/assets/mockupapp.webp" alt="App Calistenia Militar" className="mx-auto mt-6 w-full max-w-md" loading="lazy" />
        <p className="mt-2 text-sm text-muted-foreground">📱 Disponible para acceso inmediato después de la compra</p>
      </section>

      <section data-animate className="mx-auto mt-16 max-w-xl px-4">
        <h2 className="mb-6 text-center text-3xl font-black">Solo hoy obtienes <span className="text-accent">bonos</span></h2>
        <div className="space-y-4">{bonos.map(([i, t, d, p]) => (
          <div key={t} className="rounded-2xl border border-primary/30 bg-card/50 p-5">
            <div className="text-3xl">{i}</div><h3 className="mt-2 font-black">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p>
            <div className="mt-3 flex gap-3 text-sm"><span className="text-muted-foreground line-through">{p}</span><span className="font-black text-primary">Ahora GRATIS</span></div>
          </div>))}
        </div>
        <p className="my-4 text-center text-sm">Valor total: <span className="line-through">$137.70</span></p>
        <Cta>🔥 Asegura tus bonos ahora</Cta>
      </section>

      <section data-animate className="mx-auto mt-16 max-w-xl px-4">
        <h2 className="text-center text-3xl font-black">Resultados que nos <span className="text-primary">enorgullecen</span></h2>
        <p className="mb-6 text-center text-muted-foreground">Mira lo que dicen quienes siguieron el protocolo</p>
        <div className="space-y-4">{reviews.map(([n, a, h, t]) => (
          <div key={n} className="rounded-2xl border border-primary/30 bg-card/50 p-5">
            <div className="mb-3 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-black text-primary-foreground">{n![0]}</div><div><h4 className="font-bold">{n}</h4><p className="text-xs text-muted-foreground">{a}</p></div></div>
            <div className="font-bold">"{h}"</div><p className="mt-1 text-sm text-muted-foreground">"{t}"</p><div className="mt-2">⭐⭐⭐⭐⭐</div>
          </div>))}
        </div>
        <div className="mt-6"><Cta>🔥 Quiero empezar ahora</Cta></div>
      </section>

      <section data-animate className="mx-auto mt-16 max-w-xl px-4">
        <h2 className="mb-6 text-center text-3xl font-black">Preguntas Frecuentes</h2>
        <div className="space-y-3">{faqs.map(([q, a]) => <Faq key={q} q={q!} a={a!} />)}</div>
        <div className="mt-6"><Cta>👊 Acceder al protocolo</Cta></div>
      </section>
    </div>
  );
}

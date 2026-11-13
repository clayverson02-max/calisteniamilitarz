import { ageOptions } from "@/lib/funnel-data";

export function Landing({ onStart }: { onStart: (v: number) => void }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-full bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.03]" />
      </div>
      <div className="relative z-10 mx-auto mb-8 max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-glow" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Reclutamiento Abierto</span>
        </div>
        <h1 className="mb-4 text-2xl font-black uppercase leading-tight tracking-tight md:text-4xl">
          <span className="block">Consigue un físico marcado en solo 21 días con el</span>
          <span className="mx-1 inline-block text-primary">Desafío de Calistenia Militar</span>
          <span className="block">sin salir de casa.</span>
        </h1>
        <div className="mx-auto my-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <p className="mx-auto mb-6 max-w-lg text-sm text-muted-foreground md:text-base">
          Este programa está diseñado para adaptarse a tu nivel de condición física y edad actual.
        </p>
        <p className="text-base font-medium text-foreground/90 md:text-lg">Selecciona tu edad para comenzar</p>
      </div>
      <div className="relative z-10 grid w-full max-w-4xl grid-cols-2 gap-3 sm:gap-6">
        {ageOptions.map((o, i) => (
          <button key={o.value} onClick={() => onStart(o.value)}
            className="group relative flex h-[280px] w-full flex-col justify-end overflow-hidden rounded-xl border border-primary/30 bg-card/30 text-left transition-all duration-300 hover:border-primary hover:shadow-glow sm:h-[320px]">
            <img src={o.image} alt={o.label} loading={i < 2 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="relative z-20 w-full border-t border-primary/20 bg-background/40 p-4 backdrop-blur-md transition-colors duration-300 group-hover:bg-primary/90 sm:p-6">
              <span className="text-lg font-bold drop-shadow-md group-hover:text-primary-foreground sm:text-xl">Edad: {o.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

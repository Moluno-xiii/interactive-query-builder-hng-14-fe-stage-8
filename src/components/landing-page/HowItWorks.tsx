import { STEPS } from "@/data";

const HowItWorks = () => {
  return (
    <section id="how" className="border-y border-border bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-chakra-petch text-3xl font-bold tracking-tight">Three steps to a result</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-lg border border-border-soft bg-surface p-6">
              <span className="font-jetbrains-mono text-[28px] font-bold text-accent opacity-90">{s.n}</span>
              <h3 className="mt-2 text-[16px] font-semibold">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

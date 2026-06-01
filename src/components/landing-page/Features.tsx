import { FEATURES } from "@/data";

const Features = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-chakra-petch text-3xl font-bold tracking-tight">Everything a query needs</h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          A recursive, schema-driven builder with a complete query engine behind it.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-lg border border-border-soft bg-surface p-6 transition hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
          >
            <span className="inline-grid h-11 w-11 place-items-center rounded-md bg-accent-dim text-accent">
              {f.icon}
            </span>
            <h3 className="mt-4 text-[16px] font-semibold">{f.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Radar as RadarIcon } from "lucide-react";
import { Backdrop, Panel } from "@/components/cyber/Frame";
import { SiteFooter } from "@/components/cyber/Legal";
import { ARENA_LABEL, TACTICS, type Tactic } from "@/lib/tactics";

export const Route = createFileRoute("/tactics/")({
  head: () => ({
    meta: [
      { title: "The Tactic Library — Named Manipulation Plays at Work | Unbluff" },
      {
        name: "description",
        content:
          "False deadlines, blame trails, moving goalposts. Every pressure tactic used in work and client messages — named, explained, and answered with a reply you can send.",
      },
      { property: "og:title", content: "The Tactic Library — Unbluff" },
      {
        property: "og:description",
        content: "Every manipulation play in work messages, named and answered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TacticsIndex,
});

function TacticCard({ tactic }: { tactic: Tactic }) {
  return (
    <Link to="/tactics/$slug" params={{ slug: tactic.slug }} className="block">
      <Panel className="h-full p-4 transition-colors hover:border-neon/50">
        <div className="font-mono text-[10px] uppercase tracking-widest text-amber">
          {ARENA_LABEL[tactic.arena]}
        </div>
        <h2 className="mt-1.5 font-mono text-sm font-bold text-foreground">{tactic.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tactic.definition}</p>
        <p className="mt-3 border-l-2 border-alert/50 pl-2 font-mono text-[11px] italic text-alert/80">
          “{tactic.sounds_like}”
        </p>
      </Panel>
    </Link>
  );
}

function TacticsIndex() {
  return (
    <div className="min-h-screen">
      <Backdrop />
      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-neon"
        >
          <ArrowLeft className="h-3 w-3" /> back to scanner
        </Link>

        <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neon/70">
          <RadarIcon className="h-3.5 w-3.5" /> tactic_library // {TACTICS.length} entries
        </div>
        <h1 className="mt-3 font-mono text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          Every play has a <span className="text-neon text-glow">name.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          This is the library Unbluff scans against. When a message lands, you don’t get a vague
          feeling — you get the name of what they’re doing, and a reply that answers it.
        </p>

        {(["work", "client", "personal"] as const).map((arena) => (
          <section key={arena} className="mt-10">
            <h2 className="font-mono text-sm uppercase tracking-widest text-amber">
              {ARENA_LABEL[arena]}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {TACTICS.filter((t) => t.arena === arena).map((t) => (
                <TacticCard key={t.slug} tactic={t} />
              ))}
            </div>
          </section>
        ))}

        <Link
          to="/"
          className="pulse-neon mt-12 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-neon hover:bg-neon/20"
        >
          Show me what they’re doing
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
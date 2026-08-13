import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Eye, Swords } from "lucide-react";
import { Backdrop, Panel } from "@/components/cyber/Frame";
import { SiteFooter } from "@/components/cyber/Legal";
import { ARENA_LABEL, TACTICS, getTactic } from "@/lib/tactics";

export const Route = createFileRoute("/tactics/$slug")({
  loader: ({ params }) => {
    const tactic = getTactic(params.slug);
    if (!tactic) throw notFound();
    return { tactic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tactic not found — Unbluff" }, { name: "robots", content: "noindex" }],
      };
    }
    const { tactic } = loaderData;
    const title = `${tactic.name} — ${tactic.search_intent} | Unbluff`;
    const description = `${tactic.definition} What they're really doing, and the exact reply that answers it.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: `${tactic.name} — Unbluff` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: TacticMissing,
  component: TacticPage,
});

function TacticMissing() {
  return (
    <div className="min-h-screen">
      <Backdrop />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-mono text-2xl font-bold text-foreground">Tactic not found</h1>
        <Link to="/tactics" className="mt-4 inline-block font-mono text-sm text-neon underline">
          Back to the library
        </Link>
      </main>
    </div>
  );
}

function TacticPage() {
  const { tactic } = Route.useLoaderData();
  const related = TACTICS.filter((t) => t.arena === tactic.arena && t.slug !== tactic.slug).slice(
    0,
    4,
  );

  return (
    <div className="min-h-screen">
      <Backdrop />
      <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-10">
        <Link
          to="/tactics"
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-neon"
        >
          <ArrowLeft className="h-3 w-3" /> tactic library
        </Link>

        <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-amber">
          {ARENA_LABEL[tactic.arena]}
        </div>
        <h1 className="mt-2 font-mono text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {tactic.name}
        </h1>
        {tactic.aka && (
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            also called: {tactic.aka}
          </p>
        )}
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{tactic.definition}</p>

        <Panel className="mt-6 p-4">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-alert" /> how it sounds
          </div>
          <p className="mt-2 border-l-2 border-alert/50 pl-3 font-mono text-sm italic text-alert/90">
            “{tactic.sounds_like}”
          </p>
        </Panel>

        <h2 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-amber">
          <Eye className="h-4 w-4" /> What they’re really doing
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tactic.really_doing}</p>

        <h2 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-neon">
          <Swords className="h-4 w-4" /> The reply that answers it
        </h2>
        <Panel className="mt-3 p-4">
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-6 text-neon/90">
            {tactic.reply}
          </pre>
          <p className="mt-3 border-t border-neon/15 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            square brackets = the one fact only you know
          </p>
        </Panel>

        <Panel className="mt-8 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            This is the generic version. Paste the actual message and Unbluff writes the reply for
            your exact wording, history and stakes.
          </p>
          <Link
            to="/"
            className="pulse-neon mt-4 flex w-full items-center justify-center rounded-sm border border-neon bg-neon/10 px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-neon hover:bg-neon/20"
          >
            Decode my message — first one free
          </Link>
        </Panel>

        {related.length > 0 && (
          <>
            <h2 className="mt-10 font-mono text-sm uppercase tracking-widest text-muted-foreground">
              Usually shows up with
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {related.map((t) => (
                <Link key={t.slug} to="/tactics/$slug" params={{ slug: t.slug }}>
                  <Panel className="p-3 transition-colors hover:border-neon/50">
                    <div className="font-mono text-[13px] font-bold text-foreground">{t.name}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                      {t.definition}
                    </p>
                  </Panel>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
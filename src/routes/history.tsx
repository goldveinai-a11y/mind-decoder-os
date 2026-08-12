import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Radar as RadarIcon } from "lucide-react";
import { Backdrop, Panel } from "@/components/cyber/Frame";
import { UnlockedState } from "@/components/cyber/states";
import { useAuth } from "@/hooks/useAuth";
import { getScan, listMyScans, type ScanHistoryItem } from "@/lib/scan.functions";
import type { ScanTeaser } from "@/lib/scan-types";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "My Decodes — Cyber-Polygraph" },
      {
        name: "description",
        content: "Every message you decoded, with its manipulation patterns and reply scripts.",
      },
      { property: "og:title", content: "My Decodes — Cyber-Polygraph" },
      { property: "og:description", content: "Your archive of decoded transmissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: History,
});

const LEVEL_COLOR: Record<string, string> = {
  clear: "text-neon",
  elevated: "text-amber",
  high: "text-alert",
  critical: "text-alert",
};

function History() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [items, setItems] = useState<ScanHistoryItem[] | null>(null);
  const [open, setOpen] = useState<ScanTeaser | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth" });
      return;
    }
    void listMyScans().then(setItems);
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen">
      <Backdrop />
      <header className="sticky top-0 z-30 border-b border-neon/20 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <button
            onClick={() => (open ? setOpen(null) : navigate({ to: "/" }))}
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> back
          </button>
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-neon">
            archive
          </span>
        </div>
      </header>

      <main>
        {open ? (
          <UnlockedState teaser={open} onReset={() => setOpen(null)} />
        ) : (
          <section className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10">
            <h1 className="font-mono text-2xl font-bold uppercase text-foreground">My decodes</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Every report you unlocked stays here. Replies included.
            </p>

            {items === null && (
              <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                loading archive...
              </p>
            )}

            {items?.length === 0 && (
              <Panel className="mt-6 p-6 text-center">
                <RadarIcon className="mx-auto h-5 w-5 text-neon/60" />
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  no decoded transmissions yet
                </p>
              </Panel>
            )}

            <div className="mt-6 space-y-3">
              {items?.map((item) => (
                <button
                  key={item.id}
                  onClick={async () => {
                    const teaser = await getScan({ data: { id: item.id, token: item.token } });
                    if (teaser) setOpen(teaser);
                  }}
                  className="block w-full text-left"
                >
                  <Panel className="p-4 transition-colors hover:border-neon/50">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>{item.context}</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{item.headline}</p>
                    <div
                      className={`mt-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
                        LEVEL_COLOR[item.threat_level] ?? "text-amber"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3" /> {item.threat_level} ·{" "}
                      {item.pattern_count} patterns
                    </div>
                  </Panel>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

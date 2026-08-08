import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Radar as RadarIcon, TerminalSquare } from "lucide-react";
import { Backdrop } from "@/components/cyber/Frame";
import {
  InputState,
  ScanningState,
  PaywallState,
  UnlockedState,
} from "@/components/cyber/states";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyber-Polygraph — Decode Hidden Motives in Any Message" },
      {
        name: "description",
        content:
          "Intercept and decode any message. Detect gaslighting, bluffs and hidden agendas with an FBI-level behavioral profile.",
      },
      { property: "og:title", content: "Cyber-Polygraph — Decode Hidden Motives" },
      {
        property: "og:description",
        content: "Paste a message. Our AI radar detects manipulation patterns in 8 seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "input" | "scanning" | "paywall" | "unlocked";

function Index() {
  const [stage, setStage] = useState<Stage>("input");

  return (
    <div className="min-h-screen">
      <Backdrop />

      <header className="sticky top-0 z-30 border-b border-neon/20 bg-background/85 backdrop-blur-md">
        <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <RadarIcon className="h-4 w-4 shrink-0 text-neon" />
            <span className="truncate font-mono text-xs font-bold uppercase tracking-[0.18em] text-neon">
              COMM_INTERCEPTOR v2.4
            </span>
          </div>
          <button
            onClick={() => setStage("unlocked")}
            title="dev: skip to unlocked"
            aria-label="Developer skip to unlocked state"
            className="shrink-0 rounded-sm border border-border/60 p-1.5 text-muted-foreground/40 transition-colors hover:text-neon"
          >
            <TerminalSquare className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {stage === "input" && <InputState onScan={() => setStage("scanning")} />}
          {stage === "scanning" && <ScanningState onDone={() => setStage("paywall")} />}
          {stage === "paywall" && (
            <PaywallState onUnlock={() => alert("Redirecting to Stripe...")} />
          )}
          {stage === "unlocked" && <UnlockedState onReset={() => setStage("input")} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

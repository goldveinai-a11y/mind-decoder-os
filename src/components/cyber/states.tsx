import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Crosshair,
  Eye,
  Fingerprint,
  Lock,
  Radar as RadarIcon,
  ShieldCheck,
  Swords,
  Terminal,
  UserX,
} from "lucide-react";
import { Panel } from "./Frame";
import { Radar } from "./Radar";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4 },
};

/* ---------------- STATE 1 ---------------- */

export function InputState({ onScan }: { onScan: (v: string) => void }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <motion.section key="input" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10">
      <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neon/70">
        <Activity className="h-3.5 w-3.5" /> secure channel open
      </div>
      <h1 className="font-mono text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Decode <span className="text-neon text-glow">Hidden Motives.</span>
        <br />
        Win <span className="text-neon text-glow">the Exchange.</span>
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Paste a message from your boss, client, partner, or ex — or from whoever’s tearing
        you apart in the comments. Our AI radar will detect gaslighting, bluffs, and hidden
        agendas — then writes the reply that ends it.
      </p>

      <Panel className="mt-8 p-3">
        <div className="mb-2 flex items-center justify-between border-b border-neon/15 px-1 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-neon" /> input_buffer
          </span>
          <span>{value.length} bytes</span>
        </div>
        <div className="relative">
          <textarea
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => setValue(e.target.value)}
            rows={7}
            placeholder="[Paste intercepted transmission or comment thread...]"
            className="w-full resize-none bg-transparent px-1 font-mono text-sm text-neon caret-transparent outline-none placeholder:text-muted-foreground/60"
          />
          {!focused && value.length === 0 && (
            <span className="caret-blink pointer-events-none absolute left-1 top-0 h-5 w-2 bg-neon/80" />
          )}
        </div>
      </Panel>

      <button
        onClick={() => onScan(value)}
        className="pulse-neon mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-neon transition-colors hover:bg-neon/20 active:scale-[0.99]"
      >
        <Crosshair className="h-4 w-4" /> Initialize Scan
      </button>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-neon/50">
        No shouting. No insults. You just stop losing.
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3 text-neon/70" /> encrypted
        </span>
        <span className="flex items-center gap-1">
          <UserX className="h-3 w-3 text-neon/70" /> anonymous
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-neon/70" /> no logs
        </span>
      </div>
    </motion.section>
  );
}

/* ---------------- STATE 2 ---------------- */

const LOGS = [
  "> Establishing secure uplink...",
  "> Extracting syntax tree...",
  "> Tokenizing 1.284 semantic units",
  "> Bypassing emotional filters...",
  "> Detecting manipulation patterns...",
  "> Mapping power asymmetry vectors",
  "> Cross-referencing FBI behavioral database...",
  "> Isolating deception markers [3 hits]",
  "> Profiling sender intent signature",
  "> Compiling counter-strike vectors...",
  "> Encrypting payload. STANDBY.",
];

function useTypedLogs(active: boolean) {
  const [lines, setLines] = useState<string[]>([]);
  const [partial, setPartial] = useState("");

  useEffect(() => {
    if (!active) return;
    let i = 0;
    let c = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled || i >= LOGS.length) return;
      const line = LOGS[i]!;
      c += 2;
      if (c >= line.length) {
        setLines((p) => [...p, line]);
        setPartial("");
        i += 1;
        c = 0;
        timer = window.setTimeout(tick, 180);
      } else {
        setPartial(line.slice(0, c));
        timer = window.setTimeout(tick, 16);
      }
    };
    let timer = window.setTimeout(tick, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [active]);

  return { lines, partial };
}

export function ScanningState({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const { lines, partial } = useTypedLogs(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps: Array<[number, number]> = [
      [40, 900],
      [40, 2200],
      [89, 3400],
      [89, 6200],
      [100, 7700],
    ];
    const timers = steps.map(([p, t]) => window.setTimeout(() => setProgress(p), t));
    const done = window.setTimeout(onDone, 8000);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [onDone]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, partial]);

  return (
    <motion.section key="scan" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10">
      <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-neon/80">
        // scanning transmission
      </div>

      <Radar />

      <div className="mt-8">
        <div className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-widest">
          <span className="text-muted-foreground">decoding</span>
          <span className="text-neon">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-sm border border-neon/25 bg-panel">
          <motion.div
            className="h-full bg-neon glow-neon"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      <Panel className="mt-6 p-3">
        <div className="mb-2 flex items-center gap-1.5 border-b border-neon/15 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Terminal className="h-3 w-3 text-neon" /> live_trace
        </div>
        <div ref={scrollRef} className="h-44 overflow-hidden font-mono text-[11px] leading-6">
          {lines.map((l) => (
            <div key={l} className="text-neon/80">
              {l}
            </div>
          ))}
          {partial && (
            <div className="text-neon">
              {partial}
              <span className="caret-blink">_</span>
            </div>
          )}
        </div>
      </Panel>
    </motion.section>
  );
}

/* ---------------- STATE 3 ---------------- */

const BLUR_LINES = [
  "w-full",
  "w-11/12",
  "w-10/12",
  "w-full",
  "w-9/12",
  "w-full",
  "w-8/12",
  "w-11/12",
];

export function PaywallState({ onUnlock }: { onUnlock: () => void }) {
  return (
    <motion.section key="paywall" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-56 pt-10">
      <motion.h2
        className="glitch font-mono text-2xl font-bold uppercase leading-tight text-alert text-glow sm:text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Analysis complete. Threats detected.
      </motion.h2>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Panel className="p-4">
          <div className="font-mono text-5xl font-bold text-alert text-glow">3</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Manipulation patterns found
          </div>
        </Panel>
        <Panel className="p-4">
          <div className="font-mono text-5xl font-bold text-amber text-glow">1</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Sender weak point identified
          </div>
        </Panel>
      </div>

      <Panel className="relative mt-4 overflow-hidden p-4">
        <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Fingerprint className="h-3 w-3 text-alert" /> psychological_profile.enc
        </div>
        <div className="space-y-2.5 blur-[5px] select-none" aria-hidden>
          {BLUR_LINES.map((w, i) => (
            <div key={i} className={`h-3 rounded-sm bg-neon/25 ${w}`} />
          ))}
          <div className="mt-4 h-3 w-1/3 rounded-sm bg-alert/40" />
          {BLUR_LINES.slice(0, 4).map((w, i) => (
            <div key={`b${i}`} className={`h-3 rounded-sm bg-neon/20 ${w}`} />
          ))}
        </div>
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(0,255,65,0.10),transparent)]"
          animate={{ y: [-60, 420] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      </Panel>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-neon/25 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
            <span className="text-alert">TRANSMISSION ENCRYPTED.</span> Unlock the full FBI-level
            psychological profile and generate a Counter-Strike Response Script.
          </p>
          <button
            onClick={onUnlock}
            className="pulse-neon mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/15 px-4 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/25 active:scale-[0.99]"
          >
            <Lock className="h-4 w-4" /> Decrypt full report — $9.99
          </button>
          <div className="mt-3 grid grid-cols-3 gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-neon/70" /> secure pay
            </span>
            <span className="flex items-center gap-1">
              <UserX className="h-3 w-3 text-neon/70" /> anonymous
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-neon/70" /> instant access
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------------- STATE 4 ---------------- */

const THREATS = [
  {
    title: "Guilt Induction",
    body: "Sender reframes their own delay as your failure to follow up, transferring accountability.",
  },
  {
    title: "Artificial Urgency (Bluff)",
    body: "Deadline language is unsupported by any concrete constraint — pressure without leverage.",
  },
  {
    title: "Reality Distortion / Gaslighting",
    body: "Contradicts a previously agreed detail while implying you misremembered it.",
  },
];

const SCRIPT = `Thanks for the update. To keep us aligned, I'm summarizing what we agreed on:

1. The scope and timeline we confirmed on [date] remain unchanged.
2. The item you raised was not part of that agreement — happy to treat it as a new request.
3. I can proceed as soon as I get written confirmation on which option you prefer.

Let me know which you'd like and I'll move immediately.`;

export function UnlockedState({ onReset }: { onReset: () => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.section key="unlocked" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neon">
        <ShieldCheck className="h-4 w-4" /> decryption successful
      </div>
      <h2 className="mt-3 font-mono text-2xl font-bold uppercase text-foreground sm:text-3xl">
        Full Behavioral Report
      </h2>

      <h3 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-alert">
        <AlertTriangle className="h-4 w-4" /> Threat Analysis
      </h3>
      <div className="mt-3 space-y-3">
        {THREATS.map((t) => (
          <Panel key={t.title} className="p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-alert" />
              <div className="min-w-0">
                <div className="font-mono text-sm font-bold text-foreground">{t.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <h3 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-amber">
        <Eye className="h-4 w-4" /> Sender's True Motive
      </h3>
      <Panel className="mt-3 p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          The sender is attempting to renegotiate terms without formally reopening them. The
          emotional framing exists to make a concession feel like a favor. Their weak point: they
          need your cooperation faster than you need theirs — every ambiguity you remove reduces
          their leverage.
        </p>
      </Panel>

      <h3 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-neon">
        <Swords className="h-4 w-4" /> Counter-Strike Script
      </h3>
      <Panel className="mt-3 p-4">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-6 text-neon/90">
          {SCRIPT}
        </pre>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(SCRIPT);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/20"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied to clipboard" : "Copy to clipboard"}
        </button>
      </Panel>

      <button
        onClick={onReset}
        className="mt-8 w-full rounded-sm border border-border px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon"
      >
        <RadarIcon className="mr-2 inline h-3 w-3" /> Run new interception
      </button>
    </motion.section>
  );
}

export { AnimatePresence };

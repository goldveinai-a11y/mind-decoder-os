import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Check,
  Copy,
  Crosshair,
  Eye,
  Fingerprint,
  ImagePlus,
  Lock,
  Radar as RadarIcon,
  ShieldCheck,
  Swords,
  Terminal,
  UserX,
  X,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Panel } from "./Frame";
import { Radar } from "./Radar";
import { SCAN_CONTEXTS, CREDIT_PACKS, type ScanContext, type ScanTeaser } from "@/lib/scan-types";
import { SHOWCASE_SLUGS, TACTICS, getTactic } from "@/lib/tactics";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4 },
};

/* ---------------- STATE 1 ---------------- */

export function InputState({
  onScan,
  error,
}: {
  onScan: (payload: { text: string; context: ScanContext; imageDataUrl: string | null }) => void;
  error?: string | null;
}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [context, setContext] = useState<ScanContext>("work");
  const [image, setImage] = useState<{ name: string; dataUrl: string } | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setLocalError("Screenshot is too large (max 4 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLocalError(null);
      setImage({ name: file.name, dataUrl: String(reader.result) });
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!value.trim() && !image) {
      setLocalError("Paste a message or attach a screenshot.");
      return;
    }
    setLocalError(null);
    onScan({ text: value, context, imageDataUrl: image?.dataUrl ?? null });
  };

  return (
    <motion.section key="input" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10">
      <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neon/70">
        <Activity className="h-3.5 w-3.5" /> secure channel open
      </div>
      <h1 className="font-mono text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        They’re using a tactic.
        <br />
        It has <span className="text-neon text-glow">a name.</span>
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
        You don’t win the argument. You just stop losing.
      </p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Paste the message from your boss, your manager, HR or a client. Unbluff names the play
        they’re running — false deadline, blame trail, moving goalposts — and writes the reply you
        can send as-is.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-neon/70">
        <span>first decode free · no account</span>
        <span className="text-muted-foreground">then $4.99 · no subscription</span>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {SCAN_CONTEXTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setContext(c.id)}
            className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
              context === c.id
                ? "border-neon bg-neon/15 text-neon"
                : "border-border text-muted-foreground hover:border-neon/40 hover:text-neon"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Panel className="mt-4 p-3">
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
            maxLength={8000}
            placeholder="[Paste intercepted transmission or comment thread...]"
            className="w-full resize-none bg-transparent px-1 font-mono text-sm text-neon caret-transparent outline-none placeholder:text-muted-foreground/60"
          />
          {!focused && value.length === 0 && (
            <span className="caret-blink pointer-events-none absolute left-1 top-0 h-5 w-2 bg-neon/80" />
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 border-t border-neon/15 pt-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-neon/40 hover:text-neon"
          >
            <ImagePlus className="h-3 w-3" /> attach screenshot
          </button>
          {image && (
            <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] text-neon/80">
              <span className="truncate">{image.name}</span>
              <button onClick={() => setImage(null)} aria-label="Remove screenshot">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      </Panel>

      {(localError || error) && (
        <p className="mt-3 font-mono text-[11px] text-alert">{localError ?? error}</p>
      )}

      <button
        onClick={submit}
        className="pulse-neon mt-6 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-6 py-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-neon transition-colors hover:bg-neon/20 active:scale-[0.99]"
      >
        <Crosshair className="h-4 w-4" /> Show me what they’re doing
      </button>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-neon/50">
        No shouting. No insults. You just stop losing.
      </p>

      <ChatGptObjection />
      <Showcase />
      <PricingStrip />
      <PrivacyBlock />
      <OtherArenas />
    </motion.section>
  );
}

/* ---------------- LANDING BLOCKS ---------------- */

function ChatGptObjection() {
  return (
    <Panel className="mt-10 p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-amber">
        why not just ask chatgpt
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        ChatGPT will write you a polite paragraph. It will not tell you that the message is a{" "}
        <span className="text-neon">false deadline</span> — because to ask that, you already have to
        know it’s a false deadline. Unbluff starts one step earlier: it names the play first, then
        answers it.
      </p>
      <Link
        to="/tactics"
        className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest text-neon underline underline-offset-4"
      >
        see all {TACTICS.length} tactics →
      </Link>
    </Panel>
  );
}

function Showcase() {
  const items = SHOWCASE_SLUGS.map((s) => getTactic(s)).filter(Boolean);
  return (
    <section className="mt-10">
      <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        Three real messages, decoded
      </h2>
      <div className="mt-3 space-y-3">
        {items.map((t) => (
          <Panel key={t!.slug} className="p-4">
            <p className="border-l-2 border-alert/50 pl-3 font-mono text-[13px] italic text-alert/90">
              “{t!.sounds_like}”
            </p>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-amber">
              tactic detected — {t!.name}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {t!.really_doing}
            </p>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-neon">
              your reply
            </div>
            <pre className="mt-1.5 whitespace-pre-wrap font-mono text-[12px] leading-6 text-neon/90">
              {t!.reply}
            </pre>
          </Panel>
        ))}
      </div>
    </section>
  );
}

function PricingStrip() {
  return (
    <section className="mt-10">
      <h2 className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        What it costs
      </h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {CREDIT_PACKS.map((p) => (
          <Panel key={p.id} className="p-4 text-center">
            <div className="font-mono text-2xl font-bold text-neon">
              ${(p.amountCents / 100).toFixed(2)}
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-foreground">
              {p.label}
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {p.note}
            </div>
          </Panel>
        ))}
      </div>
      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        your first decode is free · one-time payment · no subscription · decodes never expire
      </p>
    </section>
  );
}

function PrivacyBlock() {
  return (
    <Panel className="mt-10 p-5">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-amber">
        <Lock className="h-3 w-3" /> what happens to your message
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        Work messages are sensitive, so this isn’t small print. Your text is sent over an encrypted
        connection, analysed once, and kept only so you can reopen your own report. It is never
        used to train models, never shown to anyone else, and never tied to your employer. You can
        run your first decode without an account at all.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3 text-neon/70" /> encrypted
        </span>
        <span className="flex items-center gap-1">
          <UserX className="h-3 w-3 text-neon/70" /> anonymous
        </span>
        <span className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-neon/70" /> not training data
        </span>
      </div>
    </Panel>
  );
}

function OtherArenas() {
  return (
    <p className="mt-8 text-center text-sm leading-relaxed text-muted-foreground">
      Built for work and clients — it also handles a partner, an ex or a landlord. Switch the
      context chip above before you scan.
    </p>
  );
}

/* ---------------- STATE 2 ---------------- */

const LOGS = [
  "> Establishing secure uplink...",
  "> Extracting syntax tree...",
  "> Tokenizing semantic units",
  "> Bypassing emotional filters...",
  "> Detecting manipulation patterns...",
  "> Mapping power asymmetry vectors",
  "> Cross-referencing behavioral database...",
  "> Isolating deception markers",
  "> Profiling sender intent signature",
  "> Compiling counter-strike vectors...",
  "> Drafting response payloads...",
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
      if (cancelled) return;
      const line = LOGS[i % LOGS.length]!;
      c += 2;
      if (c >= line.length) {
        setLines((p) => [...p.slice(-40), line]);
        setPartial("");
        i += 1;
        c = 0;
        timer = window.setTimeout(tick, 420);
      } else {
        setPartial(line.slice(0, c));
        timer = window.setTimeout(tick, 18);
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

export function ScanningState({ done }: { done: boolean }) {
  const [progress, setProgress] = useState(0);
  const { lines, partial } = useTypedLogs(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const steps: Array<[number, number]> = [
      [40, 900],
      [40, 2200],
      [72, 3400],
      [89, 6200],
      [94, 12000],
    ];
    const timers = steps.map(([p, t]) => window.setTimeout(() => setProgress(p), t));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (done) setProgress(100);
  }, [done]);

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
          {lines.map((l, i) => (
            <div key={`${l}-${i}`} className="text-neon/80">
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

const BLUR_LINES = ["w-full", "w-11/12", "w-10/12", "w-full", "w-9/12", "w-full", "w-8/12"];

const THREAT_COPY: Record<string, string> = {
  clear: "No hostile intent detected.",
  elevated: "Pressure detected.",
  high: "Threats detected.",
  critical: "Hostile operator. Threats detected.",
};

export function PaywallState({
  teaser,
  credits,
  signedIn,
  onSignIn,
  onBuy,
  onUnlock,
  freeAvailable,
  onFreeUnlock,
  busy,
  error,
}: {
  teaser: ScanTeaser;
  credits: number;
  signedIn: boolean;
  onSignIn: () => void;
  onBuy: (pack: string) => void;
  onUnlock: () => void;
  freeAvailable: boolean;
  onFreeUnlock: () => void;
  busy: boolean;
  error?: string | null;
}) {
  const canUnlockNow = signedIn && credits > 0;

  return (
    <motion.section key="paywall" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-24 pt-10">
      <motion.h2
        className="glitch font-mono text-2xl font-bold uppercase leading-tight text-alert text-glow sm:text-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Analysis complete. {THREAT_COPY[teaser.threat_level] ?? "Threats detected."}
      </motion.h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{teaser.headline}</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Panel className="p-4">
          <div className="font-mono text-5xl font-bold text-alert text-glow">
            {teaser.pattern_names.length}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Manipulation patterns found
          </div>
        </Panel>
        <Panel className="p-4">
          <div className="font-mono text-5xl font-bold text-amber text-glow">
            {teaser.reply_labels.length}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Counter-strike replies ready
          </div>
        </Panel>
      </div>

      {teaser.pattern_names.length > 0 && (
        <Panel className="mt-4 p-4">
          <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-alert" /> detected_tactics
          </div>
          <ul className="space-y-2">
            {teaser.pattern_names.map((name, i) => {
              const slug = teaser.pattern_slugs?.[i];
              return (
                <li key={name} className="flex items-start gap-2 font-mono text-sm text-foreground">
                  <span className="mt-0.5 text-alert">▮</span>
                  {slug ? (
                    <Link
                      to="/tactics/$slug"
                      params={{ slug }}
                      className="underline decoration-dotted underline-offset-4 hover:text-neon"
                    >
                      {name}
                    </Link>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      <Panel className="relative mt-4 overflow-hidden p-4">
        <div className="mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Fingerprint className="h-3 w-3 text-alert" /> profile_and_replies.enc
        </div>
        <div className="select-none space-y-2.5 blur-[5px]" aria-hidden>
          {BLUR_LINES.map((w, i) => (
            <div key={i} className={`h-3 rounded-sm bg-neon/25 ${w}`} />
          ))}
          <div className="mt-4 h-3 w-1/3 rounded-sm bg-alert/40" />
          {BLUR_LINES.slice(0, 5).map((w, i) => (
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

      <Panel className="mt-5 p-4">
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
          <span className="text-alert">TRANSMISSION ENCRYPTED.</span> Unlock the sender’s true
          motive, their weak point, and {teaser.reply_labels.length} ready-to-send replies written
          for this exact message.
        </p>

        {freeAvailable && !canUnlockNow ? (
          <>
            <button
              onClick={onFreeUnlock}
              disabled={busy}
              className="pulse-neon mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/15 px-4 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/25 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {busy ? "Decrypting..." : "Open my first report — free"}
            </button>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              no account · no card · one free decode
            </p>
          </>
        ) : canUnlockNow ? (
          <button
            onClick={onUnlock}
            disabled={busy}
            className="pulse-neon mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/15 px-4 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/25 disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {busy ? "Decrypting..." : `Decrypt report — 1 of ${credits} decodes`}
          </button>
        ) : !signedIn ? (
          <button
            onClick={onSignIn}
            className="pulse-neon mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/15 px-4 py-4 font-mono text-sm font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/25"
          >
            <Lock className="h-4 w-4" /> Unlock report
          </button>
        ) : (
          <div className="mt-4 space-y-2">
            {CREDIT_PACKS.map((p) => (
              <button
                key={p.id}
                onClick={() => onBuy(p.id)}
                disabled={busy}
                className="flex w-full items-center justify-between rounded-sm border border-neon/40 bg-neon/5 px-4 py-3.5 text-left transition-colors hover:bg-neon/15 disabled:opacity-50"
              >
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-neon">
                  {p.label}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.note}
                  </span>
                  <span className="font-mono text-sm text-foreground">
                    ${(p.amountCents / 100).toFixed(2)}
                  </span>
                </span>
              </button>
            ))}
            <p className="pt-1 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              one-time payment · no subscription · decodes never expire
            </p>
          </div>
        )}

        {error && <p className="mt-3 font-mono text-[11px] text-alert">{error}</p>}

        <div className="mt-4 grid grid-cols-3 gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
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
      </Panel>
    </motion.section>
  );
}

/* ---------------- STATE 4 ---------------- */

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/20"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy reply"}
    </button>
  );
}

export function UnlockedState({
  teaser,
  onReset,
}: {
  teaser: ScanTeaser;
  onReset: () => void;
}) {
  return (
    <motion.section key="unlocked" {...fade} className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neon">
        <ShieldCheck className="h-4 w-4" /> decryption successful
      </div>
      <h2 className="mt-3 font-mono text-2xl font-bold uppercase text-foreground sm:text-3xl">
        Full Behavioral Report
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{teaser.headline}</p>

      {teaser.patterns && teaser.patterns.length > 0 && (
        <>
          <h3 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-alert">
            <AlertTriangle className="h-4 w-4" /> Threat Analysis
          </h3>
          <div className="mt-3 space-y-3">
            {teaser.patterns.map((t) => (
              <Panel key={t.name} className="p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-alert" />
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-bold text-foreground">{t.name}</div>
                    {t.quote && (
                      <p className="mt-1.5 border-l-2 border-alert/50 pl-2 font-mono text-[12px] italic text-alert/80">
                        “{t.quote}”
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t.explanation}
                    </p>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </>
      )}

      <h3 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-amber">
        <Eye className="h-4 w-4" /> Sender&apos;s True Motive
      </h3>
      <Panel className="mt-3 p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{teaser.motive}</p>
        <p className="mt-4 border-t border-neon/15 pt-3 font-mono text-[10px] uppercase tracking-widest text-amber">
          weak point
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{teaser.weak_point}</p>
      </Panel>

      <h3 className="mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-neon">
        <Swords className="h-4 w-4" /> Counter-Strike Replies
      </h3>
      <div className="mt-3 space-y-3">
        {(teaser.replies ?? []).map((r) => (
          <Panel key={r.label} className="p-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-neon">
              {r.label}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {r.when_to_use}
            </div>
            <pre className="mt-3 whitespace-pre-wrap font-mono text-[12px] leading-6 text-neon/90">
              {r.text}
            </pre>
            <CopyBlock text={r.text} />
          </Panel>
        ))}
      </div>

      <button
        onClick={onReset}
        className="mt-8 w-full rounded-sm border border-border px-4 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon"
      >
        <RadarIcon className="mr-2 inline h-3 w-3" /> Run new interception
      </button>
    </motion.section>
  );
}

import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { History, LogOut, Radar as RadarIcon, X, Zap } from "lucide-react";
import { Backdrop } from "@/components/cyber/Frame";
import { InputState, ScanningState, PaywallState, UnlockedState } from "@/components/cyber/states";
import { PackCheckout } from "@/components/cyber/Checkout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { SiteFooter } from "@/components/cyber/Legal";
import { SoundToggle } from "@/components/cyber/SoundToggle";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { freeUnlockScan, getAccount, getScan, runScan, unlockScan } from "@/lib/scan.functions";
import { chiptune } from "@/lib/chiptune";
import { TACTICS } from "@/lib/tactics";
import type { ScanContext, ScanTeaser } from "@/lib/scan-types";

const SHOWCASE_BY_CONTEXT: Record<ScanContext, string[]> = {
  work: ["false-deadline", "blame-trail", "workplace-gaslighting"],
  client: ["lowball-anchor", "scope-creep", "approval-limbo"],
  relationship: ["guilt-induction", "darvo", "devaluation"],
  money: ["lowball-anchor", "guilt-induction", "blame-shifting"],
  landlord: ["implied-threat", "guilt-induction", "devaluation"],
  public: ["public-pressure", "whataboutism", "weaponised-politeness"],
};

function chatGptCopy(context: ScanContext): React.ReactNode {
  const copies: Record<ScanContext, React.ReactNode> = {
    work: (
      <>
        ChatGPT will write you a polite paragraph. It will not tell you that the email is a{" "}
        <span className="text-neon">false deadline</span> — because to ask that, you already have
        to know it’s a false deadline. Unbluff starts one step earlier: it names the play first,
        then answers it.
      </>
    ),
    client: (
      <>
        ChatGPT will draft a friendly follow-up. It will not flag that the client just ran a{" "}
        <span className="text-neon">lowball anchor</span> or slipped in{" "}
        <span className="text-neon">scope creep</span>. Unbluff names the tactic, then writes the
        reply that protects your rate.
      </>
    ),
    relationship: (
      <>
        ChatGPT will suggest you “communicate openly.” It will not tell you that the message is{" "}
        <span className="text-neon">DARVO</span> or a <span className="text-neon">guilt trip</span>{" "}
        — because to ask, you already have to suspect it. Unbluff names the pattern first, then
        gives you the grounded reply.
      </>
    ),
    money: (
      <>
        ChatGPT will write a calm refund request. It will not tell you that the message is{" "}
        <span className="text-neon">blame shifting</span> or a{" "}
        <span className="text-neon">false consensus</span>. Unbluff names the play, then writes the
        reply that gets your money back.
      </>
    ),
    landlord: (
      <>
        ChatGPT will draft a polite tenant response. It will not flag the{" "}
        <span className="text-neon">implied threat</span> or{" "}
        <span className="text-neon">vague authority</span> buried in the wording. Unbluff names it,
        then answers it.
      </>
    ),
    public: (
      <>
        ChatGPT will write a measured public comment. It will not tell you that the reply is{" "}
        <span className="text-neon">public pressure</span> or{" "}
        <span className="text-neon">whataboutism</span>. Unbluff names the tactic, then gives you
        the response that keeps your dignity intact.
      </>
    ),
  };
  return copies[context];
}

type Stage = "input" | "scanning" | "paywall" | "unlocked";
const STORE_KEY = "cp_scan";
const PACK_KEY = "cp_pending_pack";
const FP_KEY = "cp_device";
const FREE_KEY = "cp_free_used";

function deviceFingerprint(): string {
  let id = localStorage.getItem(FP_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(FP_KEY, id);
  }
  return id;
}

export type ScanFlowProps = {
  initialContext: ScanContext;
  heroTitle: React.ReactNode;
  heroSubtitle: React.ReactNode;
  heroBody: React.ReactNode;
  metaTitle: string;
  metaDescription: string;
};

export function ScanFlow({ initialContext, heroTitle, heroSubtitle, heroBody }: ScanFlowProps) {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [stage, setStage] = useState<Stage>("input");
  const [teaser, setTeaser] = useState<ScanTeaser | null>(null);
  const [scanDone, setScanDone] = useState(false);
  const [credits, setCredits] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPack, setCheckoutPack] = useState<string | null>(null);
  const [autoUnlock, setAutoUnlock] = useState(false);
  const [freeAvailable, setFreeAvailable] = useState(false);
  const restored = useRef(false);

  const refreshCredits = useCallback(async () => {
    if (!session) {
      setCredits(0);
      return 0;
    }
    try {
      const acc = await getAccount();
      setCredits(acc.credits);
      return acc.credits;
    } catch {
      return 0;
    }
  }, [session]);

  useEffect(() => {
    void refreshCredits();
  }, [refreshCredits]);

  useEffect(() => {
    setFreeAvailable(localStorage.getItem(FREE_KEY) !== "1");
  }, []);

  // Resume a pack purchase started before sign-in.
  useEffect(() => {
    if (authLoading || !session) return;
    const pending = sessionStorage.getItem(PACK_KEY);
    if (!pending) return;
    sessionStorage.removeItem(PACK_KEY);
    setCheckoutPack(pending);
  }, [authLoading, session]);

  const startPurchase = (pack: string) => {
    if (session) {
      setCheckoutPack(pack);
      return;
    }
    sessionStorage.setItem(PACK_KEY, pack);
    void navigate({ to: "/auth" });
  };

  // Restore a scan after sign-in or checkout return.
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { id: string; token: string };
    void (async () => {
      const t = await getScan({ data: saved });
      if (!t) return;
      setTeaser(t);
      setStage(t.unlocked ? "unlocked" : "paywall");
    })();
  }, []);

  // After a successful payment Stripe returns here.
  useEffect(() => {
    if (authLoading || !session) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("paid") !== "1") return;
    window.history.replaceState({}, "", url.pathname);
    setBusy(true);
    void (async () => {
      for (let i = 0; i < 12; i += 1) {
        const c = await refreshCredits();
        if (c > 0) break;
        await new Promise((r) => setTimeout(r, 1500));
      }
      setBusy(false);
      setAutoUnlock(true);
    })();
  }, [authLoading, session, refreshCredits]);

  const startScan = async (payload: {
    text: string;
    context: ScanContext;
    imageDataUrl: string | null;
  }) => {
    setError(null);
    setScanDone(false);
    setStage("scanning");
    chiptune.blipScan();
    chiptune.playLoop();
    const started = Date.now();
    try {
      const t = await runScan({
        data: {
          context: payload.context,
          text: payload.text,
          ...(payload.imageDataUrl ? { imageDataUrl: payload.imageDataUrl } : {}),
        },
      });
      setScanDone(true);
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ id: t.id, token: t.token }));
      const wait = Math.max(0, 8000 - (Date.now() - started));
      window.setTimeout(() => {
        chiptune.stopLoop();
        setTeaser(t);
        setStage("paywall");
      }, wait + 600);
    } catch (e) {
      chiptune.stopLoop();
      setError(e instanceof Error ? e.message : "The scan failed. Try again.");
      setStage("input");
    }
  };

  const doUnlock = async () => {
    if (!teaser) return;
    setBusy(true);
    setError(null);
    try {
      const full = await unlockScan({ data: { id: teaser.id, token: teaser.token } });
      setTeaser(full);
      setStage("unlocked");
      chiptune.blipSuccess();
      void refreshCredits();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not unlock the report.";
      setError(msg.includes("NO_DECODES") ? "You have no decodes left." : msg);
      void refreshCredits();
    } finally {
      setBusy(false);
    }
  };

  const doFreeUnlock = async () => {
    if (!teaser) return;
    setBusy(true);
    setError(null);
    try {
      const full = await freeUnlockScan({
        data: { id: teaser.id, token: teaser.token, fingerprint: deviceFingerprint() },
      });
      localStorage.setItem(FREE_KEY, "1");
      setFreeAvailable(false);
      setTeaser(full);
      setStage("unlocked");
      chiptune.blipSuccess();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not unlock the report.";
      if (msg.includes("FREE_USED")) {
        localStorage.setItem(FREE_KEY, "1");
        setFreeAvailable(false);
        setError("Your free decode is already used. Grab a pack to keep going.");
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  // Paid users land straight in the full report.
  useEffect(() => {
    if (!autoUnlock || busy) return;
    if (!teaser || teaser.unlocked || credits < 1) return;
    setAutoUnlock(false);
    void doUnlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoUnlock, busy, teaser, credits]);

  const reset = () => {
    sessionStorage.removeItem(STORE_KEY);
    setTeaser(null);
    setScanDone(false);
    setStage("input");
  };

  const returnUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/?paid=1`;

  return (
    <div className="min-h-screen">
      <Backdrop />
      <PaymentTestModeBanner />

      <header className="sticky top-0 z-30 border-b border-neon/20 bg-background/85 backdrop-blur-md">
        <div className="mx-auto grid max-w-2xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <RadarIcon className="h-4 w-4 shrink-0 text-neon" />
            <span className="truncate font-mono text-xs font-bold uppercase tracking-[0.18em] text-neon">
              UNBLUFF // COMM_INTERCEPTOR v2.4
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <SoundToggle />
            {session ? (
              <>
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-amber">
                  <Zap className="h-3 w-3" /> {credits}
                </span>
                <button
                  onClick={() => navigate({ to: "/history" })}
                  aria-label="My decodes"
                  className="rounded-sm border border-border/60 p-1.5 text-muted-foreground/60 transition-colors hover:text-neon"
                >
                  <History className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => supabase.auth.signOut()}
                  aria-label="Sign out"
                  className="rounded-sm border border-border/60 p-1.5 text-muted-foreground/60 transition-colors hover:text-neon"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate({ to: "/auth" })}
                className="rounded-sm border border-neon/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon transition-colors hover:bg-neon/10"
              >
                sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {stage === "input" && (
            <InputState
              initialContext={initialContext}
              heroTitle={heroTitle}
              heroSubtitle={heroSubtitle}
              heroBody={heroBody}
              showcaseSlugs={SHOWCASE_BY_CONTEXT[initialContext]}
              chatGptObjection={
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {chatGptCopy(initialContext)}
                </p>
              }
              onScan={startScan}
              error={error}
              onBuy={startPurchase}
            />
          )}
          {stage === "scanning" && <ScanningState done={scanDone} />}
          {stage === "paywall" && teaser && (
            <PaywallState
              teaser={teaser}
              credits={credits}
              signedIn={Boolean(session)}
              busy={busy}
              error={error}
              onSignIn={() => navigate({ to: "/auth" })}
              onBuy={(pack) => setCheckoutPack(pack)}
              onUnlock={doUnlock}
              freeAvailable={freeAvailable}
              onFreeUnlock={doFreeUnlock}
            />
          )}
          {stage === "unlocked" && teaser && <UnlockedState teaser={teaser} onReset={reset} />}
        </AnimatePresence>
      </main>

      <SiteFooter />

      {checkoutPack && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95 p-4 backdrop-blur-sm">
          <div className="mx-auto max-w-2xl">
            <button
              onClick={() => setCheckoutPack(null)}
              className="mb-3 ml-auto flex items-center gap-1 rounded-sm border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-neon"
            >
              <X className="h-3 w-3" /> close
            </button>
            <PackCheckout pack={checkoutPack} returnUrl={returnUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

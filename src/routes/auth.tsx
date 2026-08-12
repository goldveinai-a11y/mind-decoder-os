import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Backdrop, Panel } from "@/components/cyber/Frame";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Operator Access — Unbluff" },
      {
        name: "description",
        content:
          "Sign in to unlock full behavioral reports and counter-strike reply scripts for any message.",
      },
      { property: "og:title", content: "Operator Access — Unbluff" },
      {
        property: "og:description",
        content: "Sign in to unlock full behavioral reports and reply scripts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/" });
  }, [loading, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        setNotice("Check your inbox to confirm the address, then sign in.");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Access denied");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError("Google sign-in failed. Try email instead.");
  };

  return (
    <div className="min-h-screen">
      <Backdrop />
      <section className="mx-auto w-full max-w-md px-4 pb-20 pt-16">
        <div className="mb-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-neon/70">
          <ShieldCheck className="h-3.5 w-3.5" /> operator access
        </div>
        <h1 className="font-mono text-3xl font-bold text-foreground">
          Identify <span className="text-neon text-glow">yourself.</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your decodes and unlocked reports are tied to this operator ID. No profile, no feed,
          nothing public.
        </p>

        <Panel className="mt-8 p-4">
          <form onSubmit={submit} className="space-y-3">
            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-neon/25 bg-panel px-3 py-2.5 font-mono text-sm text-neon outline-none focus:border-neon"
              placeholder="operator@domain.com"
            />
            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              passphrase
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-neon/25 bg-panel px-3 py-2.5 font-mono text-sm text-neon outline-none focus:border-neon"
              placeholder="••••••••"
            />
            {error && <p className="font-mono text-[11px] text-alert">{error}</p>}
            {notice && <p className="font-mono text-[11px] text-amber">{notice}</p>}
            <button
              type="submit"
              disabled={busy}
              className="pulse-neon flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-4 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/20 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {busy ? "Verifying..." : mode === "signin" ? "Authenticate" : "Create operator ID"}
            </button>
          </form>

          <button
            onClick={google}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-border px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-neon/40 hover:text-neon"
          >
            <Mail className="h-3.5 w-3.5" /> Continue with Google
          </button>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon"
          >
            {mode === "signin" ? "No operator ID? Create one" : "Already registered? Sign in"}
          </button>
        </Panel>
      </section>
    </div>
  );
}

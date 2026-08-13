import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export const SUPPORT_EMAIL = "support@unbluff.com";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 px-4 py-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
        <Link to="/tactics" className="transition-colors hover:text-neon">
          Tactic library
        </Link>
        <Link to="/terms" className="transition-colors hover:text-neon">
          Terms
        </Link>
        <Link to="/privacy" className="transition-colors hover:text-neon">
          Privacy
        </Link>
        <Link to="/refunds" className="transition-colors hover:text-neon">
          Refunds
        </Link>
        <Link to="/contact" className="transition-colors hover:text-neon">
          Contact
        </Link>
        <span className="text-muted-foreground/40">© {new Date().getFullYear()} Unbluff</span>
      </div>
    </footer>
  );
}

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon"
        >
          <ArrowLeft className="h-3 w-3" /> back
        </Link>
        <h1 className="mt-6 font-mono text-xl uppercase tracking-widest text-neon">{title}</h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
          Last updated {updated}
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-mono text-xs uppercase tracking-widest text-foreground">{heading}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
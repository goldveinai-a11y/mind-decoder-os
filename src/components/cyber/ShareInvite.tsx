import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { getReferralInfo } from "@/lib/scan.functions";

/**
 * Minimal invite line: copy your link, a friend runs their first decode,
 * you get a free decode back. No modals, no dashboards.
 */
export function ShareInvite({
  signedIn,
  onSignIn,
  className = "",
}: {
  signedIn: boolean;
  onSignIn: () => void;
  className?: string;
}) {
  const [info, setInfo] = useState<{ code: string | null; joined: number; cap: number } | null>(
    null,
  );

  useEffect(() => {
    if (!signedIn) return;
    let alive = true;
    void getReferralInfo()
      .then((r) => {
        if (alive) setInfo(r);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [signedIn]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = info?.code ? `${origin}/?r=${info.code}` : "";

  return (
    <div className={`rounded-sm border border-neon/25 bg-neon/[0.04] p-4 ${className}`}>
      <p className="flex items-start gap-2 font-mono text-[10px] uppercase leading-4 tracking-widest text-muted-foreground">
        <Gift className="mt-px h-3.5 w-3.5 shrink-0 text-neon" />
        send it to someone in the same conversation — their first decode gives you one free
      </p>
      {signedIn && link ? (
        <>
          <CopyButton text={link} label="Copy invite link" className="mt-3" />
          {info && info.joined > 0 && (
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-neon/70">
              {info.joined} of {info.cap} friends arrived
            </p>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={onSignIn}
          className="mt-3 w-full rounded-sm border border-neon/40 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/10"
        >
          Get my invite link
        </button>
      )}
    </div>
  );
}

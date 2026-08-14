import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function copyText(text: string): boolean {
  try {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  label = "Copy reply",
  onCopied,
  className = "",
}: {
  text: string;
  label?: string;
  onCopied?: () => void;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        copyText(text);
        setCopied(true);
        onCopied?.();
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex w-full items-center justify-center gap-2 rounded-sm border border-neon bg-neon/10 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neon transition-colors hover:bg-neon/20 active:bg-neon/25 ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

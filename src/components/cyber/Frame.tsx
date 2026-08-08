import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel relative rounded-sm ${className}`}>
      <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-neon" />
      <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-neon" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-neon" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-neon" />
      {children}
    </div>
  );
}

export function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,255,65,0.10),transparent_60%)]" />
      <div className="scanlines absolute inset-0 opacity-40" />
    </div>
  );
}
export function Radar({ size = 260 }: { size?: number }) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[260px] rounded-full border border-neon/30"
      style={{ maxWidth: size }}
    >
      <div className="absolute inset-[12%] rounded-full border border-neon/20" />
      <div className="absolute inset-[28%] rounded-full border border-neon/20" />
      <div className="absolute inset-[44%] rounded-full border border-neon/20" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neon/15" />
      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-neon/15" />
      <div className="radar-sweep absolute inset-0 rounded-full [background:conic-gradient(from_0deg,rgba(0,255,65,0.35),rgba(0,255,65,0.02)_28%,transparent_45%)]" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon glow-neon" />
      {[
        { t: "26%", l: "62%", c: "bg-alert" },
        { t: "58%", l: "34%", c: "bg-amber" },
        { t: "70%", l: "68%", c: "bg-alert" },
      ].map((b) => (
        <span
          key={b.l + b.t}
          className={`absolute h-2 w-2 animate-ping rounded-full ${b.c}`}
          style={{ top: b.t, left: b.l }}
        />
      ))}
    </div>
  );
}
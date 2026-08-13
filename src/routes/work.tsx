import { createFileRoute } from "@tanstack/react-router";
import { ScanFlow } from "@/components/cyber/ScanFlow";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "How to Respond to a Passive-Aggressive Boss or Coworker | Unbluff" },
      {
        name: "description",
        content:
          "Decode emails from your boss, manager, or coworkers. Detect false deadlines, blame trails, gaslighting, and get the exact reply to send.",
      },
      {
        property: "og:title",
        content: "How to Respond to a Passive-Aggressive Boss or Coworker | Unbluff",
      },
      {
        property: "og:description",
        content:
          "Decode work messages. Detect manipulation tactics and copy the reply that ends the exchange.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <ScanFlow
      initialContext="work"
      metaTitle="How to Respond to a Passive-Aggressive Boss or Coworker | Unbluff"
      metaDescription="Decode emails from your boss, manager, or coworkers. Detect false deadlines, blame trails, gaslighting, and get the exact reply to send."
      heroTitle={
        <>
          Your boss is using a tactic.
          <br />
          It has <span className="text-neon text-glow">a name.</span>
        </>
      }
      heroSubtitle={
        <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
          You don’t win the argument. You just stop losing.
        </p>
      }
      heroBody={
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Paste the email, Slack, or Teams message from your boss, manager, HR, or coworker.
          Unbluff names the play — false deadline, blame trail, moving goalposts — and writes the
          reply you can send as-is.
        </p>
      }
    />
  );
}

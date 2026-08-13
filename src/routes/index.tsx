import { createFileRoute } from "@tanstack/react-router";
import { ScanFlow } from "@/components/cyber/ScanFlow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unbluff — Decode Hidden Motives in Any Message" },
      {
        name: "description",
        content:
          "Paste a message or screenshot. Detect gaslighting, bluffs and hidden agendas, then copy the reply that ends the exchange.",
      },
      { property: "og:title", content: "Unbluff — Decode Hidden Motives" },
      {
        property: "og:description",
        content: "AI radar for manipulation in work, client and personal messages.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ScanFlow
      initialContext="work"
      metaTitle="Unbluff — Decode Hidden Motives in Any Message"
      metaDescription="Paste a message or screenshot. Detect gaslighting, bluffs and hidden agendas, then copy the reply that ends the exchange."
      heroTitle={
        <>
          They’re using a tactic.
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
          Paste the message from your boss, your manager, HR or a client. Unbluff names the play
          they’re running — false deadline, blame trail, moving goalposts — and writes the reply
          you can send as-is.
        </p>
      }
    />
  );
}

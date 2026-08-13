import { createFileRoute } from "@tanstack/react-router";
import { ScanFlow } from "@/components/cyber/ScanFlow";

export const Route = createFileRoute("/gaslighting")({
  head: () => ({
    meta: [
      { title: "How to Respond to Gaslighting in a Relationship | Unbluff" },
      {
        name: "description",
        content:
          "Decode messages from a partner or ex who twists reality. Detect guilt trips, DARVO, devaluation, and get the calm reply that stops the loop.",
      },
      {
        property: "og:title",
        content: "How to Respond to Gaslighting in a Relationship | Unbluff",
      },
      {
        property: "og:description",
        content:
          "Detect manipulation tactics in texts from a partner or ex and copy the reply that ends the loop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaslightingPage,
});

function GaslightingPage() {
  return (
    <ScanFlow
      initialContext="relationship"
      metaTitle="How to Respond to Gaslighting in a Relationship | Unbluff"
      metaDescription="Decode messages from a partner or ex who twists reality. Detect guilt trips, DARVO, devaluation, and get the calm reply that stops the loop."
      heroTitle={
        <>
          They rewrite reality.
          <br />
          <span className="text-neon text-glow">Name it.</span> Answer it.
        </>
      }
      heroSubtitle={
        <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
          You don’t win the fight. You stop doubting yourself.
        </p>
      }
      heroBody={
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Paste the message from your partner or ex. Unbluff detects gaslighting, guilt trips,
          DARVO, and silent treatment — then writes the calm, grounded reply you can send.
        </p>
      }
    />
  );
}

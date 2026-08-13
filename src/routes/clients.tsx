import { createFileRoute } from "@tanstack/react-router";
import { ScanFlow } from "@/components/cyber/ScanFlow";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "How to Respond to a Difficult Client or Lowball Offer | Unbluff" },
      {
        name: "description",
        content:
          "Decode client emails and negotiation tactics. Detect scope creep, lowball anchors, approval limbo, and get the reply that protects your rate.",
      },
      {
        property: "og:title",
        content: "How to Respond to a Difficult Client or Lowball Offer | Unbluff",
      },
      {
        property: "og:description",
        content:
          "Detect client negotiation tactics and copy the reply that protects your rate and scope.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <ScanFlow
      initialContext="client"
      metaTitle="How to Respond to a Difficult Client or Lowball Offer | Unbluff"
      metaDescription="Decode client emails and negotiation tactics. Detect scope creep, lowball anchors, approval limbo, and get the reply that protects your rate."
      heroTitle={
        <>
          The client is playing a tactic.
          <br />
          It has <span className="text-neon text-glow">a name.</span>
        </>
      }
      heroSubtitle={
        <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
          You don’t cave on price. You stop bleeding scope.
        </p>
      }
      heroBody={
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Paste the email or proposal thread. Unbluff detects lowball anchors, scope creep,
          approval limbo, and exposure-pay offers — then writes the reply that protects your
          rate and your time.
        </p>
      }
    />
  );
}

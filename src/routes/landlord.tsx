import { createFileRoute } from "@tanstack/react-router";
import { ScanFlow } from "@/components/cyber/ScanFlow";

export const Route = createFileRoute("/landlord")({
  head: () => ({
    meta: [
      { title: "How to Respond to a Landlord or Property Manager | Unbluff" },
      {
        name: "description",
        content:
          "Decode emails from your landlord or property manager. Detect pressure tactics, vague threats, and guilt trips — and get the reply that protects your lease and deposit.",
      },
      {
        property: "og:title",
        content: "How to Respond to a Landlord or Property Manager | Unbluff",
      },
      {
        property: "og:description",
        content:
          "Decode landlord emails. Detect pressure tactics and get the reply that protects your lease and deposit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandlordPage,
});

function LandlordPage() {
  return (
    <ScanFlow
      initialContext="landlord"
      metaTitle="How to Respond to a Landlord or Property Manager | Unbluff"
      metaDescription="Decode emails from your landlord or property manager. Detect pressure tactics, vague threats, and guilt trips — and get the reply that protects your lease and deposit."
      heroTitle={
        <>
          Your landlord is using a tactic.
          <br />
          It has <span className="text-neon text-glow">a name.</span>
        </>
      }
      heroSubtitle={
        <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground sm:text-lg">
          You don’t escalate. You stop getting pushed around.
        </p>
      }
      heroBody={
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Paste the email, text, or notice from your landlord or property manager. Unbluff
          detects implied threats, guilt trips, and rule-bending — then writes the reply that
          protects your lease and your deposit.
        </p>
      }
    />
  );
}

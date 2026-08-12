import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, SUPPORT_EMAIL } from "@/components/cyber/Legal";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Unbluff" },
      {
        name: "description",
        content: "When and how you can get a refund for Unbluff decode credits.",
      },
      { property: "og:title", content: "Refund Policy — Unbluff" },
      { property: "og:description", content: "Refund terms for Unbluff decode credit packs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Refunds,
});

function Refunds() {
  return (
    <LegalPage title="Refund Policy" updated="12 August 2026">
      <p>
        Unbluff sells one-time decode credit packs. There is no subscription and nothing renews
        automatically.
      </p>
      <Section heading="Unused credits">
        If you have not used any credits from a purchase, you can request a full refund within 14
        days of that purchase. We refund to the original payment method.
      </Section>
      <Section heading="Partially used packs">
        If you used some credits, we refund the unused portion on a pro-rata basis within 14 days of
        purchase. Used decodes are digital content delivered immediately and are not refundable
        once generated.
      </Section>
      <Section heading="Technical failures">
        If a decode fails, returns an empty report, or a credit is charged without delivering a
        result, contact us and we will restore the credit or refund it — regardless of the 14-day
        window.
      </Section>
      <Section heading="EU/UK consumers">
        Digital content is delivered immediately on your request. By starting a decode you consent
        to immediate performance and acknowledge that the statutory withdrawal right no longer
        applies to credits already consumed. Unconsumed credits remain refundable as described
        above.
      </Section>
      <Section heading="How to request">
        Email <span className="text-neon">{SUPPORT_EMAIL}</span> from your account address with the
        purchase date and amount. We reply within 2 business days; approved refunds reach your bank
        within 5–10 business days. Refunded credits are removed from your balance.
      </Section>
      <Section heading="Chargebacks">
        Please contact us before opening a dispute — it is faster. Credits linked to a refunded or
        disputed payment are automatically revoked.
      </Section>
    </LegalPage>
  );
}
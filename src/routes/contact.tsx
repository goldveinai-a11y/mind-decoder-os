import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, SUPPORT_EMAIL } from "@/components/cyber/Legal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Support — Unbluff" },
      {
        name: "description",
        content: "Reach Unbluff support for billing, refunds, privacy requests or bug reports.",
      },
      { property: "og:title", content: "Contact & Support — Unbluff" },
      { property: "og:description", content: "Support, billing and privacy contacts for Unbluff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <LegalPage title="Contact & Support" updated="12 August 2026">
      <p>
        Unbluff is an AI message decoder. We answer every email from a real person, usually within
        2 business days (Monday–Friday).
      </p>
      <Section heading="Email">
        <p>
          Support, billing, refunds and privacy requests:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-neon underline">
            {SUPPORT_EMAIL}
          </a>
        </p>
      </Section>
      <Section heading="What to include">
        <ul className="list-disc space-y-1 pl-5">
          <li>the email address on your account;</li>
          <li>for billing issues: the purchase date and amount;</li>
          <li>for bugs: what you did and what you expected to happen.</li>
        </ul>
      </Section>
      <Section heading="Related pages">
        Refund conditions are described in the Refund Policy, data handling in the Privacy Policy,
        and usage rules in the Terms of Service — all linked in the footer.
      </Section>
    </LegalPage>
  );
}
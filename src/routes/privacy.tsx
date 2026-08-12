import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, SUPPORT_EMAIL } from "@/components/cyber/Legal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Unbluff" },
      {
        name: "description",
        content: "What Unbluff collects, how decoded messages are stored, and your data rights.",
      },
      { property: "og:title", content: "Privacy Policy — Unbluff" },
      { property: "og:description", content: "How Unbluff handles your messages and account data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="12 August 2026">
      <p>
        This policy explains what data Unbluff collects, why, and what control you have over it. It
        applies to the Unbluff website and app.
      </p>
      <Section heading="Data we collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-foreground">Account data:</strong> email address and
            authentication identifiers (including Google sign-in), created when you register.
          </li>
          <li>
            <strong className="text-foreground">Content you submit:</strong> the message text or
            screenshots you paste for analysis, and the generated report.
          </li>
          <li>
            <strong className="text-foreground">Purchase data:</strong> credit packs bought, amount,
            and payment identifiers. Card details are handled by our payment provider and never
            reach our servers.
          </li>
          <li>
            <strong className="text-foreground">Technical data:</strong> basic logs needed to run
            and secure the service.
          </li>
        </ul>
      </Section>
      <Section heading="How we use it">
        To generate your decode, keep your history available in your account, process payments and
        credits, prevent abuse, and provide support. We do not sell your data and we do not use your
        submitted messages for advertising.
      </Section>
      <Section heading="Processors">
        We use third-party providers strictly to deliver the service: a cloud database and
        authentication provider for accounts and history, an AI model provider to generate the
        analysis, and a payment provider for checkout, tax and receipts. They process data on our
        instructions.
      </Section>
      <Section heading="AI processing">
        The message you submit is sent to an AI model provider to produce the report. It is not used
        to train third-party models. Please avoid submitting more personal or sensitive information
        about others than the analysis requires.
      </Section>
      <Section heading="Retention">
        Decodes stay in your account history until you delete them or delete your account. Purchase
        records are kept as long as accounting and tax law requires.
      </Section>
      <Section heading="Your rights">
        You can request access, correction, export or deletion of your data, and object to certain
        processing. Write to <span className="text-neon">{SUPPORT_EMAIL}</span> and we will respond
        within 30 days. If you are in the EEA or UK, you may also complain to your local data
        protection authority.
      </Section>
      <Section heading="Security">
        Data is stored on managed infrastructure with access controls, and rows are scoped so only
        your account can read your decodes. No system is perfectly secure, so please do not submit
        data you cannot afford to have exposed.
      </Section>
      <Section heading="Contact">
        Privacy questions: <span className="text-neon">{SUPPORT_EMAIL}</span>
      </Section>
    </LegalPage>
  );
}
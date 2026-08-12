import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhook, type StripeEnv } from "@/lib/stripe.server";

async function revokeCredits(charge: Record<string, unknown>) {
  const paymentIntent =
    typeof charge["payment_intent"] === "string" ? (charge["payment_intent"] as string) : null;
  if (!paymentIntent) return;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.rpc("revoke_refunded_credits", {
    p_payment_intent: paymentIntent,
  });
  if (error) console.error("payments webhook: revoke failed", error);
}

async function grantCredits(session: Record<string, unknown>) {
  const metadata = (session["metadata"] ?? {}) as Record<string, string | undefined>;
  const userId = metadata["userId"];
  const credits = Number(metadata["credits"] ?? 0);
  const pack = metadata["pack"] ?? "unknown";
  const sessionId = String(session["id"] ?? "");
  const amount = Number(session["amount_total"] ?? 0);
  const paymentIntent =
    typeof session["payment_intent"] === "string" ? (session["payment_intent"] as string) : null;

  if (!userId || !credits || !sessionId) {
    console.error("payments webhook: missing metadata", { userId, credits, sessionId });
    return;
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.rpc("grant_purchased_credits", {
    p_user: userId,
    p_pack: pack,
    p_credits: credits,
    p_amount_cents: amount,
    p_session: sessionId,
    p_payment_intent: paymentIntent,
  });
  if (error) console.error("payments webhook: grant failed", error);
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          const object = event.data.object;
          switch (event.type) {
            case "checkout.session.completed":
              if (object["payment_status"] !== "unpaid") await grantCredits(object);
              break;
            case "checkout.session.async_payment_succeeded":
              await grantCredits(object);
              break;
            case "charge.refunded":
            case "charge.dispute.created":
              await revokeCredits(object);
              break;
            default:
              break;
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});

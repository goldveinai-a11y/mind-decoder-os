import { createFileRoute } from "@tanstack/react-router";
import type Stripe from "stripe";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

export const Route = createFileRoute("/api/public/admin/test-session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (new URL(request.url).searchParams.get("token") !== "3f9c1a7e5b2d4086") {
          return new Response("forbidden", { status: 403 });
        }
        try {
          const stripe = createStripeClient("sandbox");
          const prices = await stripe.prices.list({ lookup_keys: ["decode_pack_1_price"] });
          const price = prices.data[0]!;
          const session = await stripe.checkout.sessions.create({
            line_items: [{ price: price.id, quantity: 1 }],
            mode: "payment",
            ui_mode: "embedded_page",
            return_url: "https://mind-decoder-os.lovable.app/?paid=1",
            managed_payments: { enabled: true },
            metadata: { managed_payments: "true" },
          } as Stripe.Checkout.SessionCreateParams);
          return Response.json({ ok: true, id: session.id, secret: Boolean(session.client_secret) });
        } catch (error) {
          return Response.json({ ok: false, error: getStripeErrorMessage(error) }, { status: 500 });
        }
      },
    },
  },
});

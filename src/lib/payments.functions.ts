import { createServerFn } from "@tanstack/react-start";
import type Stripe from "stripe";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeErrorMessage, type StripeEnv } from "./stripe.server";
import { PACK_PRICE_IDS, packById, resolveOrCreateCustomer } from "./payments.server";

export const createPackCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { pack: string; returnUrl: string; environment: StripeEnv }) => {
    packById(data.pack);
    return data;
  })
  .handler(async ({ data, context }): Promise<{ clientSecret: string } | { error: string }> => {
    try {
      const pack = packById(data.pack);
      const priceId = PACK_PRICE_IDS[pack.id];
      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({ lookup_keys: [priceId] });
      const stripePrice = prices.data[0];
      if (!stripePrice) throw new Error("Price not found");

      const {
        data: { user },
      } = await context.supabase.auth.getUser();

      const customerId = await resolveOrCreateCustomer(stripe, {
        email: user?.email,
        userId: context.userId,
      });

      const productId =
        typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id;
      const product = await stripe.products.retrieve(productId);

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        payment_intent_data: { description: product.name },
        managed_payments: { enabled: true },
        metadata: {
          userId: context.userId,
          pack: pack.id,
          credits: String(pack.credits),
          managed_payments: "true",
        },
      } as Stripe.Checkout.SessionCreateParams);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

import { createFileRoute } from "@tanstack/react-router";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { PACK_PRICE_IDS } from "@/lib/payments.server";

const TOKEN = "3f9c1a7e5b2d4086";
const TAX_CODE = "txcd_10000000";

export const Route = createFileRoute("/api/public/admin/set-tax-codes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (new URL(request.url).searchParams.get("token") !== TOKEN) {
          return new Response("forbidden", { status: 403 });
        }
        try {
          const stripe = createStripeClient("sandbox");
          const out: Record<string, string> = {};
          for (const lookupKey of Object.values(PACK_PRICE_IDS)) {
            const prices = await stripe.prices.list({ lookup_keys: [lookupKey] });
            const price = prices.data[0];
            if (!price) {
              out[lookupKey] = "price not found";
              continue;
            }
            const productId =
              typeof price.product === "string" ? price.product : price.product.id;
            const updated = await stripe.products.update(productId, { tax_code: TAX_CODE });
            out[lookupKey] = `${productId} -> ${String(updated.tax_code)}`;
          }
          return Response.json({ ok: true, out });
        } catch (error) {
          return Response.json({ ok: false, error: getStripeErrorMessage(error) }, { status: 500 });
        }
      },
    },
  },
});

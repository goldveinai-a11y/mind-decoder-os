import { useRef } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createPackCheckout } from "@/lib/payments.functions";
import { trackEcommerce } from "@/lib/analytics";
import { CREDIT_PACKS } from "@/lib/scan-types";

// Matches the key ScanFlow.tsx reads from after returning from Stripe.
const LAST_CHECKOUT_KEY = "cp_last_checkout";

export function PackCheckout({ pack, returnUrl }: { pack: string; returnUrl: string }) {
  const firedRef = useRef(false);

  const fetchClientSecret = async (): Promise<string> => {
    const result = await createPackCheckout({
      data: { pack, returnUrl, environment: getStripeEnvironment() },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Checkout could not be started");

    if (!firedRef.current) {
      firedRef.current = true;
      const packInfo = CREDIT_PACKS.find((p) => p.id === pack);
      // Stripe's embedded-checkout client secret is "{session_id}_secret_{...}" —
      // the session id prefix is the real Stripe Checkout Session ID, which we
      // reuse as the GA4 transaction_id once the purchase actually completes.
      const sessionId = result.clientSecret.split("_secret_")[0] ?? "";
      sessionStorage.setItem(
        LAST_CHECKOUT_KEY,
        JSON.stringify({ pack, sessionId, value: (packInfo?.amountCents ?? 0) / 100 }),
      );
      if (packInfo) {
        trackEcommerce("begin_checkout", {
          currency: "USD",
          value: packInfo.amountCents / 100,
          items: [
            {
              item_id: packInfo.id,
              item_name: packInfo.label,
              price: packInfo.amountCents / 100,
              quantity: 1,
            },
          ],
        });
      }
    }

    return result.clientSecret;
  };

  return (
    <div id="checkout" className="rounded-sm bg-white p-1">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}

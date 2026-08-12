import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createPackCheckout } from "@/lib/payments.functions";

export function PackCheckout({ pack, returnUrl }: { pack: string; returnUrl: string }) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = await createPackCheckout({
      data: { pack, returnUrl, environment: getStripeEnvironment() },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Checkout could not be started");
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

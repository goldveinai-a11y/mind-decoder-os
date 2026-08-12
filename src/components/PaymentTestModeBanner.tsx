const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-alert/40 bg-alert/10 px-4 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-alert">
        Checkout is not configured for production yet.
      </div>
    );
  }
  if (String(clientToken).startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-amber/40 bg-amber/10 px-4 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-amber">
        Test mode — payments in preview are simulated
      </div>
    );
  }
  return null;
}

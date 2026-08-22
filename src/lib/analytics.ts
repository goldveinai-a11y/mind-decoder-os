// Thin wrapper around gtag (Google Analytics 4). Installed via the
// <script> tags in src/routes/__root.tsx (measurement ID G-QWFFW29G81).
//
// Two helpers:
// - trackEvent: any custom event with flat string/number/boolean params.
// - trackEcommerce: begin_checkout / purchase, which GA4 requires to carry
//   a nested items[] array — something trackEvent's flat params can't hold.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export type EcommerceItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
};

export function trackEcommerce(
  name: "begin_checkout" | "purchase",
  params: {
    currency: string;
    value: number;
    transaction_id?: string;
    items: EcommerceItem[];
  },
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

import type Stripe from "stripe";
import { CREDIT_PACKS, type CreditPackId } from "./scan-types";

export const PACK_PRICE_IDS: Record<CreditPackId, string> = {
  single: "decode_pack_1_price",
  ten: "decode_pack_10_price",
  fifty: "decode_pack_50_price",
};

export function packById(id: string) {
  const pack = CREDIT_PACKS.find((p) => p.id === id);
  if (!pack) throw new Error("Unknown pack");
  return pack;
}

export async function resolveOrCreateCustomer(
  stripe: Stripe,
  options: { email?: string | undefined; userId?: string | undefined },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length && found.data[0]) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    const customer = existing.data[0];
    if (customer) {
      if (options.userId && customer.metadata?.["userId"] !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email ? { email: options.email } : {}),
    ...(options.userId ? { metadata: { userId: options.userId } } : {}),
  });
  return created.id;
}

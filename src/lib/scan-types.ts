export const SCAN_CONTEXTS = [
  { id: "work", label: "Work / boss" },
  { id: "client", label: "Client / deal" },
  { id: "relationship", label: "Partner / ex" },
  { id: "money", label: "Money / refund" },
  { id: "landlord", label: "Landlord / lease" },
  { id: "public", label: "Public fight" },
] as const;

export type ScanContext = (typeof SCAN_CONTEXTS)[number]["id"];

export type Pattern = {
  name: string;
  /** Slug from the tactic library, or "other" when nothing matches. */
  slug?: string;
  quote: string;
  explanation: string;
};

export type Reply = {
  label: string;
  when_to_use: string;
  text: string;
};

export type ScanResult = {
  threat_level: string;
  headline: string;
  patterns: Pattern[];
  motive: string;
  weak_point: string;
  replies: Reply[];
};

export type ScanTeaser = {
  id: string;
  token: string;
  unlocked: boolean;
  threat_level: string;
  headline: string;
  pattern_names: string[];
  pattern_slugs: (string | null)[];
  patterns: Pattern[] | null;
  motive: string | null;
  weak_point: string | null;
  replies: Reply[] | null;
  reply_labels: string[];
};

export const CREDIT_PACKS = [
  { id: "single", credits: 3, amountCents: 499, label: "3 decodes", note: "starter" },
  { id: "ten", credits: 10, amountCents: 1499, label: "10 decodes", note: "best value" },
  { id: "fifty", credits: 50, amountCents: 3999, label: "50 decodes", note: "long war" },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];

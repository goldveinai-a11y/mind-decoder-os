export const SCAN_CONTEXTS = [
  { id: "work", label: "Работа" },
  { id: "client", label: "Клиент" },
  { id: "relationship", label: "Отношения" },
  { id: "public", label: "Публичный спор" },
] as const;

export type ScanContext = (typeof SCAN_CONTEXTS)[number]["id"];

export type Pattern = {
  name: string;
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
  patterns: Pattern[] | null;
  motive: string | null;
  weak_point: string | null;
  replies: Reply[] | null;
  reply_labels: string[];
};

export const CREDIT_PACKS = [
  { id: "single", credits: 1, amountCents: 499, label: "1 декод", note: "разовый" },
  { id: "ten", credits: 10, amountCents: 1499, label: "10 декодов", note: "выгодно" },
  { id: "fifty", credits: 50, amountCents: 3999, label: "50 декодов", note: "для затяжной войны" },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];

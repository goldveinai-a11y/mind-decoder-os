import type { ScanContext, ScanResult, ScanTeaser } from "./scan-types";
import { SCAN_CONTEXTS } from "./scan-types";
import { TACTIC_SLUGS } from "./tactics";

export const MAX_TEXT_LENGTH = 8000;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export function normalizeContext(value: unknown): ScanContext {
  const ids = SCAN_CONTEXTS.map((c) => c.id) as string[];
  return (typeof value === "string" && ids.includes(value) ? value : "work") as ScanContext;
}

export function validateImageDataUrl(value: string): string {
  if (!/^data:image\/(png|jpe?g|webp|heic);base64,/i.test(value)) {
    throw new Error("Unsupported image format. Use PNG, JPG or WEBP.");
  }
  const base64 = value.slice(value.indexOf(",") + 1);
  const bytes = Math.floor((base64.length * 3) / 4);
  if (bytes > MAX_IMAGE_BYTES) throw new Error("Screenshot is too large (max 4 MB).");
  return value;
}

export function newAccessToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function normalizeFingerprint(value: unknown): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!/^[a-z0-9-]{8,64}$/i.test(raw)) throw new Error("Invalid device marker.");
  return raw.toLowerCase();
}

/** One-way hash of the caller IP — the address itself is never stored. */
export async function hashClientIp(headers: Headers): Promise<string> {
  const ip =
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown";
  const data = new TextEncoder().encode(`unbluff:free:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export function buildTeaser(
  id: string,
  token: string,
  result: ScanResult,
  unlocked: boolean,
): ScanTeaser {
  const base = {
    id,
    token,
    unlocked,
    threat_level: result.threat_level,
    headline: result.headline,
    pattern_names: result.patterns.map((p) => p.name),
    pattern_slugs: result.patterns.map((p) =>
      p.slug && TACTIC_SLUGS.includes(p.slug) ? p.slug : null,
    ),
    reply_labels: result.replies.map((r) => r.label),
  };

  if (!unlocked) {
    return { ...base, patterns: null, motive: null, weak_point: null, replies: null };
  }

  return {
    ...base,
    patterns: result.patterns,
    motive: result.motive,
    weak_point: result.weak_point,
    replies: result.replies,
  };
}

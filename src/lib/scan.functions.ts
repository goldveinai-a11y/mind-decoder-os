import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { analyzeTransmission } from "./analyze.server";
import {
  MAX_TEXT_LENGTH,
  buildTeaser,
  hashClientIp,
  newAccessToken,
  normalizeContext,
  normalizeFingerprint,
  validateImageDataUrl,
} from "./scan.server";
import type { ScanResult, ScanTeaser } from "./scan-types";

export const runScan = createServerFn({ method: "POST" })
  .inputValidator((input: { context: string; text?: string; imageDataUrl?: string }) => {
    const text = (input.text ?? "").trim().slice(0, MAX_TEXT_LENGTH);
    const imageDataUrl = input.imageDataUrl ? validateImageDataUrl(input.imageDataUrl) : null;
    if (!text && !imageDataUrl) throw new Error("Paste a message or attach a screenshot.");
    return { context: normalizeContext(input.context), text, imageDataUrl };
  })
  .handler(async ({ data }): Promise<ScanTeaser> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const token = newAccessToken();

    const { data: row, error } = await supabaseAdmin
      .from("scans")
      .insert({
        access_token: token,
        context: data.context,
        input_text: data.text || null,
        status: "processing",
      })
      .select("id")
      .single();
    if (error || !row) throw new Error("Could not start the scan.");

    try {
      const result = await analyzeTransmission({
        context: data.context,
        text: data.text,
        imageDataUrl: data.imageDataUrl,
      });
      await supabaseAdmin
        .from("scans")
        .update({ result: result as never, status: "done" })
        .eq("id", row.id);
      return buildTeaser(row.id, token, result, false);
    } catch (e) {
      const message = e instanceof Error ? e.message : "unknown";
      await supabaseAdmin
        .from("scans")
        .update({ status: "failed", error: message })
        .eq("id", row.id);
      if (message === "RATE_LIMIT") throw new Error("Too many scans right now. Try again shortly.");
      if (message === "NO_CREDITS") throw new Error("AI quota exhausted. Try again later.");
      throw new Error("The scan failed. Try again.");
    }
  });

export const getScan = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; token: string }) => input)
  .handler(async ({ data }): Promise<ScanTeaser | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("scans")
      .select("id, access_token, result, unlocked")
      .eq("id", data.id)
      .eq("access_token", data.token)
      .maybeSingle();
    if (!row?.result) return null;
    return buildTeaser(row.id, row.access_token, row.result as unknown as ScanResult, row.unlocked);
  });

export const getAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ credits: number; email: string | null }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("credits, email")
      .eq("id", context.userId)
      .maybeSingle();
    return { credits: profile?.credits ?? 0, email: profile?.email ?? null };
  });

/** One free full report per device per day — no account required. */
export const freeUnlockScan = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; token: string; fingerprint: string }) => ({
    id: input.id,
    token: input.token,
    fingerprint: normalizeFingerprint(input.fingerprint),
  }))
  .handler(async ({ data }): Promise<ScanTeaser> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("scans")
      .select("id, access_token, result, unlocked")
      .eq("id", data.id)
      .eq("access_token", data.token)
      .maybeSingle();
    if (!row?.result) throw new Error("Report not found.");

    const result = row.result as unknown as ScanResult;
    if (row.unlocked) return buildTeaser(row.id, row.access_token, result, true);

    const request = getRequest();
    const ipHash = await hashClientIp(request?.headers ?? new Headers());
    const today = new Date().toISOString().slice(0, 10);

    const { count } = await supabaseAdmin
      .from("free_uses")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .eq("used_on", today);
    if ((count ?? 0) >= 3) throw new Error("FREE_USED");

    const { error: claimError } = await supabaseAdmin.from("free_uses").insert({
      fingerprint: data.fingerprint,
      ip_hash: ipHash,
      used_on: today,
      scan_id: row.id,
    });
    if (claimError) throw new Error("FREE_USED");

    const { error: unlockError } = await supabaseAdmin
      .from("scans")
      .update({ unlocked: true, unlocked_free: true })
      .eq("id", row.id)
      .eq("access_token", row.access_token);
    if (unlockError) throw new Error("Could not unlock the report.");

    return buildTeaser(row.id, row.access_token, result, true);
  });

export const getAccountLegacy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ credits: number; email: string | null }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("credits, email")
      .eq("id", context.userId)
      .maybeSingle();
    return { credits: profile?.credits ?? 0, email: profile?.email ?? null };
  });

export const unlockScan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; token: string }) => input)
  .handler(async ({ data, context }): Promise<ScanTeaser> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("scans")
      .select("id, access_token, result, unlocked, user_id")
      .eq("id", data.id)
      .eq("access_token", data.token)
      .maybeSingle();
    if (!row?.result) throw new Error("Report not found.");

    const result = row.result as unknown as ScanResult;

    if (row.unlocked) {
      return buildTeaser(row.id, row.access_token, result, true);
    }

    const { data: outcome, error: rpcError } = await supabaseAdmin.rpc(
      "spend_credit_and_unlock",
      { p_scan: row.id, p_token: row.access_token, p_user: context.userId },
    );
    if (rpcError) throw new Error("Could not unlock the report.");
    if (outcome === "no_credits") throw new Error("NO_DECODES");
    if (outcome !== "ok") throw new Error("Report not found.");

    return buildTeaser(row.id, row.access_token, result, true);
  });

export type ScanHistoryItem = {
  id: string;
  token: string;
  context: string;
  headline: string;
  threat_level: string;
  pattern_count: number;
  created_at: string;
};

export const listMyScans = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ScanHistoryItem[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("scans")
      .select("id, access_token, context, result, created_at")
      .eq("user_id", context.userId)
      .eq("unlocked", true)
      .order("created_at", { ascending: false })
      .limit(100);

    return (rows ?? []).map((row) => {
      const result = (row.result ?? {}) as unknown as ScanResult;
      return {
        id: row.id,
        token: row.access_token,
        context: row.context,
        headline: result.headline ?? "Decoded transmission",
        threat_level: result.threat_level ?? "elevated",
        pattern_count: result.patterns?.length ?? 0,
        created_at: row.created_at,
      };
    });
  });

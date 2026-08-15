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
  normalizeReferralCode,
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

/** One-click quality signal on an unlocked report. */
export const rateScan = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; token: string; verdict: string }) => {
    if (input.verdict !== "accurate" && input.verdict !== "off") {
      throw new Error("Invalid verdict.");
    }
    return { id: input.id, token: input.token, verdict: input.verdict };
  })
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("scans")
      .select("id")
      .eq("id", data.id)
      .eq("access_token", data.token)
      .maybeSingle();
    if (!row) throw new Error("Report not found.");

    await supabaseAdmin
      .from("scan_feedback")
      .upsert({ scan_id: row.id, verdict: data.verdict }, { onConflict: "scan_id" });
    return { ok: true };
  });

/** One free full report per device per day — no account required. */
export const freeUnlockScan = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { id: string; token: string; fingerprint: string; referralCode?: string }) => ({
      id: input.id,
      token: input.token,
      fingerprint: normalizeFingerprint(input.fingerprint),
      referralCode: normalizeReferralCode(input.referralCode),
    }),
  )
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

    if (data.referralCode) {
      await supabaseAdmin.rpc("claim_referral", {
        p_code: data.referralCode,
        p_ip_hash: ipHash,
        p_scan: row.id,
      });
    }

    return buildTeaser(row.id, row.access_token, result, true);
  });

/** Personal invite code plus how many friends already converted. */
export const getReferralInfo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ code: string | null; joined: number; cap: number }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("referral_code")
      .eq("id", context.userId)
      .maybeSingle();
    const { count } = await supabaseAdmin
      .from("referrals")
      .select("id", { count: "exact", head: true })
      .eq("referrer_id", context.userId);
    return { code: profile?.referral_code ?? null, joined: count ?? 0, cap: 10 };
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

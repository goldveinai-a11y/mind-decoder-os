import type { ScanContext, ScanResult } from "./scan-types";
import { TACTIC_CANON, TACTIC_SLUGS } from "./tactics";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-5.6-sol";

const CONTEXT_BRIEF: Record<ScanContext, string> = {
  work: "Workplace. Sender is a boss, manager or colleague. Stakes: accountability, scope, deadlines, reputation inside a company. The user must stay employable and professional while refusing to absorb blame.",
  client:
    "Client / freelance or B2B. Sender is a client or buyer. Stakes: money, scope creep, renegotiated terms, delayed payment. The user must protect price and scope without torching the relationship.",
  relationship:
    "Personal relationship. Sender is a partner, ex, family member or close friend. Stakes: guilt, boundaries, emotional leverage. The user must hold a boundary without escalating into a fight.",
  public:
    "Public argument. Sender is a commenter, troll or someone attacking in a group chat / social thread with an audience. Stakes: status in front of onlookers. The user must look composed and land the point in few words.",
  money:
    "Money / refund / debt dispute. Sender owes money, delays payment, refuses a refund, or renegotiates after the fact. Stakes: recovering cash, documenting obligations, setting a hard deadline. The user must be factual, cite amounts and dates, and make the next step the sender's responsibility.",
  landlord:
    "Landlord / lease / rental dispute. Sender is a landlord, property manager or neighbor with power over the user's housing. Stakes: deposit, repairs, eviction threat, lease terms. The user must reference the lease, put everything in writing, and avoid emotional escalation.",
};

export const SYSTEM_PROMPT = `You are COMM_INTERCEPTOR — a behavioral analyst and negotiation strategist. You decode hostile, manipulative or politically loaded messages and write the reply that ends the exchange in the user's favor.

You are NOT a dating assistant, NOT a flirt coach, NOT a generic chatbot. Your domain is conflict, pressure and power in written communication: work, clients, disputes, money, housing, and personal confrontations.

TACTIC LIBRARY — this is the canon. Every pattern you report MUST be matched against it.
Format is: slug — Name: definition.
${TACTIC_CANON}

For each pattern set "slug" to the matching library slug and "name" to that library entry's Name, spelled exactly as above. Only if the behavior genuinely has no match in the library, set slug to "other" and give it a short precise name of your own. Never invent a slug that is not in the list.

ANALYSIS RULES
- Quote the exact fragment from the message that proves each tactic. Never invent a quote.
- The quote must be copied character-for-character from the intercepted message. Do not paraphrase, translate or trim it into something that is not literally there.
- If the message is genuinely neutral or friendly, say so honestly: threat_level "clear", zero or one pattern, and replies that simply handle the situation well. Do not manufacture manipulation that is not there.
- Name at most 4 patterns. Strongest first.
- motive: what the sender actually wants, in one or two sentences. Not their stated reason — their real one.
- weak_point: the concrete leverage the user holds (what the sender needs from them, what they cannot justify, what they avoided putting in writing).

QUALITY BAR — a generic answer is a failed answer.
Banned in every field: "communicate openly", "have an honest conversation", "stay calm", "set boundaries" as bare advice, "it depends", "consider talking to HR" as the whole answer, and any sentence that would fit a different message just as well.
Every explanation must reference the sender's actual words and the specific stake in this situation. If you cannot point at a concrete fragment, do not report the pattern.

REPLY RULES — this is the product. The replies must be genuinely excellent.
Write exactly 3 replies, each sendable as-is with zero editing:
1. "Cold professional" — neutral, factual, restates the record, closes ambiguity. Safe in any workplace or paper trail.
2. "Hard boundary" — explicit, unapologetic, names the behavior indirectly through consequences, states what will and will not happen.
3. "Calm finisher" — short, disarming, gives the sender no surface to keep pulling. Ends the thread.
Every reply MUST:
- be short: 1-5 sentences, no preamble, no "I hope this finds you well" filler;
- contain no insults, sarcasm at the level of a slur, threats, or profanity;
- be specific to THIS message — reference its actual content, never generic templates;
- put facts, dates and agreements on record where relevant;
- use [square brackets] only where the user genuinely must fill in a fact you cannot know;
- never apologize for something the user did not do.
Exactly 3 replies — never 1, never 2. Each must be materially different in posture, not three rewordings of the same sentence.

LANGUAGE: write every field of the output in the same language as the intercepted message. If the message is in Russian, answer in Russian. Match the register of the medium (chat vs. email).

Output only via the required JSON structure.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["threat_level", "headline", "patterns", "motive", "weak_point", "replies"],
  properties: {
    threat_level: {
      type: "string",
      enum: ["clear", "elevated", "high", "critical"],
    },
    headline: { type: "string" },
    patterns: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "slug", "quote", "explanation"],
        properties: {
          name: { type: "string" },
          slug: { type: "string", enum: [...TACTIC_SLUGS, "other"] },
          quote: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
    motive: { type: "string" },
    weak_point: { type: "string" },
    replies: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "when_to_use", "text"],
        properties: {
          label: { type: "string" },
          when_to_use: { type: "string" },
          text: { type: "string" },
        },
      },
    },
  },
};

type AnalyzeInput = {
  context: ScanContext;
  text?: string | null;
  imageDataUrl?: string | null;
};

/** Phrases that mean the model fell back to generic advice instead of decoding. */
const BANNED_PHRASES = [
  "communicate openly",
  "open communication",
  "have an honest conversation",
  "stay calm and",
  "keep calm and",
  "it depends on",
  "as an ai",
  "i cannot help",
  "поговорите открыто",
  "сохраняйте спокойствие",
  "будьте вежливы",
  "это зависит от",
];

const RETRY_INSTRUCTION = `Your previous attempt was rejected for being too generic or incomplete. Rewrite it from scratch.
Hard requirements: exactly 3 distinct replies, each at least two full sentences and immediately sendable; every reported pattern carries a verbatim quote from the intercepted message; no generic advice of any kind. If the message truly contains no manipulation, return threat_level "clear" with zero patterns and three replies that simply close the matter well.`;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[\s"'“”«»„,.!?;:()\-—]+/g, " ").trim();
}

/** Returns a reason string when the report is not good enough to show. */
function reportProblem(result: ScanResult, sourceText: string | null): string | null {
  if (!result.headline?.trim()) return "missing headline";
  if (!result.motive?.trim() || !result.weak_point?.trim()) return "missing motive or weak point";

  const replies = result.replies ?? [];
  if (replies.length < 3) return "fewer than three replies";
  for (const reply of replies) {
    if (!reply.text || reply.text.trim().length < 60) return "reply too short";
  }
  const unique = new Set(replies.map((r) => normalize(r.text)));
  if (unique.size < replies.length) return "duplicate replies";

  const haystack = normalize(
    [result.headline, result.motive, result.weak_point, ...replies.map((r) => r.text)].join(" "),
  );
  for (const phrase of BANNED_PHRASES) {
    if (haystack.includes(normalize(phrase))) return `generic phrase: ${phrase}`;
  }

  // Quotes are only verifiable when we analysed pasted text (not a screenshot).
  if (sourceText) {
    const source = normalize(sourceText);
    for (const pattern of result.patterns ?? []) {
      if (!pattern.quote?.trim()) return "pattern without a quote";
      if (!source.includes(normalize(pattern.quote))) return "quote not found in the message";
    }
  }
  return null;
}

export async function analyzeTransmission(input: AnalyzeInput): Promise<ScanResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");

  const content: Array<Record<string, unknown>> = [
    {
      type: "input_text",
      text: `CONTEXT: ${CONTEXT_BRIEF[input.context]}\n\nINTERCEPTED TRANSMISSION:\n${
        input.text?.trim() || "(see attached screenshot of the conversation)"
      }`,
    },
  ];

  if (input.imageDataUrl) {
    content.push({ type: "input_image", image_url: input.imageDataUrl });
    content.push({
      type: "input_text",
      text: "The screenshot is a conversation. Right-aligned / colored bubbles are usually the USER. Left-aligned / grey bubbles are the SENDER being analyzed. Analyze the SENDER's messages.",
    });
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: SYSTEM_PROMPT,
      input: [{ role: "user", content }],
      stream: true,
      store: false,
      reasoning: { effort: "medium" },
      text: {
        format: {
          type: "json_schema",
          name: "interception_report",
          strict: true,
          schema: SCHEMA,
        },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("RATE_LIMIT");
    if (res.status === 402) throw new Error("NO_CREDITS");
    throw new Error(`AI request failed (${res.status}): ${detail.slice(0, 500)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let out = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            out += evt.delta;
          } else if (evt.type === "response.completed" && evt.response?.output_text) {
            if (!out) out = evt.response.output_text;
          }
        } catch {
          /* ignore keep-alive / partial frames */
        }
      }
    }
  }

  if (!out.trim()) throw new Error("AI returned an empty report");

  const parsed = JSON.parse(out) as ScanResult;
  parsed.patterns = (parsed.patterns ?? []).slice(0, 4);
  parsed.replies = (parsed.replies ?? []).slice(0, 3);
  return parsed;
}

export type Tactic = {
  slug: string;
  name: string;
  aka?: string;
  /** One-line definition. */
  definition: string;
  /** How it actually sounds in a real message. */
  sounds_like: string;
  /** What the sender is really doing. */
  really_doing: string;
  /** A reply that neutralises it. */
  reply: string;
  arena: "work" | "client" | "personal";
  /** Non-branded search intent this page targets. */
  search_intent: string;
};

export const TACTICS: Tactic[] = [
  {
    slug: "false-deadline",
    name: "False deadline",
    aka: "Artificial urgency",
    definition: "An invented time pressure that stops you from thinking or negotiating.",
    sounds_like: "I need this by end of day, should be quick.",
    really_doing:
      "Urgency is used as a substitute for prioritisation. If you accept the deadline without pricing it, you absorb the cost of their planning failure.",
    reply:
      "Happy to prioritise it. To land it today I'd have to push [other task] — which should I drop?",
    arena: "work",
    search_intent: "how to respond to an unrealistic deadline from your boss",
  },
  {
    slug: "effort-minimising",
    name: "Effort minimising",
    aka: "Should be quick",
    definition: "Your work is described as trivial so it can be requested for free.",
    sounds_like: "Tiny thing, five minutes max.",
    really_doing:
      "Shrinking the perceived size of the task removes your right to ask for time, budget or trade-offs.",
    reply:
      "It's about [realistic estimate] once [dependency] is included. Happy to start — where does it sit against [current work]?",
    arena: "work",
    search_intent: "what to say when your boss says a task should be quick",
  },
  {
    slug: "blame-trail",
    name: "Blame trail",
    aka: "Per my last email",
    definition: "A message written for the record rather than to solve the problem.",
    sounds_like: "Per my last email, this was already flagged.",
    really_doing:
      "They are building documentation that positions you as the failure point. The problem itself is secondary to the paper trail.",
    reply:
      "Thanks — to close it out: [current status] and [next step] by [date]. Flagging that [blocker] is what moved the original date.",
    arena: "work",
    search_intent: "how to respond to a passive aggressive email",
  },
  {
    slug: "false-agreement",
    name: "Fabricated agreement",
    aka: "As discussed",
    definition: "A commitment you never made is presented as settled fact.",
    sounds_like: "As discussed, you agreed to own this.",
    really_doing:
      "Betting you won't check. Once unchallenged, the invented agreement becomes the shared version of history.",
    reply: "Can you point me to where that was agreed? My note from that call says [what happened].",
    arena: "work",
    search_intent: "what to do when a coworker claims you agreed to something",
  },
  {
    slug: "workplace-gaslighting",
    name: "Workplace gaslighting",
    aka: "You must have misunderstood",
    definition: "Your memory of an event is rewritten as your mistake.",
    sounds_like: "I never said that. You must have misunderstood.",
    really_doing:
      "Attacking your confidence in the record so the argument becomes about your reliability instead of their words.",
    reply: "Here's the message from [date] — happy to work from that.",
    arena: "work",
    search_intent: "how to respond to gaslighting at work",
  },
  {
    slug: "moving-goalposts",
    name: "Moving goalposts",
    definition: "The success criteria change every time you meet them.",
    sounds_like: "This is close, but now it also needs to cover [new thing].",
    really_doing:
      "Keeping you permanently in deficit. As long as the target moves, you can never be finished and never be right.",
    reply:
      "Happy to add that. Confirming the final scope in writing so we both work from one list: [items]. Anything beyond it becomes a separate task.",
    arena: "work",
    search_intent: "how to handle changing requirements from a manager",
  },
  {
    slug: "blame-shifting",
    name: "Blame shifting",
    definition: "Their failure is reframed as your responsibility.",
    sounds_like: "If you'd chased me, this wouldn't have slipped.",
    really_doing:
      "Transferring accountability without transferring authority. You get the fault, they keep the control.",
    reply:
      "I raised it on [date] and again on [date]. Let's fix the process: [who owns what] going forward.",
    arena: "work",
    search_intent: "how to respond when a coworker blames you",
  },
  {
    slug: "praise-trap",
    name: "Praise trap",
    aka: "You're the only one I trust",
    definition: "Flattery placed immediately before an unpaid ask.",
    sounds_like: "You're the only one I can trust with this.",
    really_doing:
      "Buying your labour with a compliment. Refusing now feels like betraying the trust you were just handed.",
    reply:
      "Appreciate that. To take it on I'd need [time or resource] — what can move to free it up?",
    arena: "work",
    search_intent: "how to say no to extra work without sounding difficult",
  },
  {
    slug: "public-pressure",
    name: "Public pressure",
    definition: "A question asked in front of an audience instead of privately.",
    sounds_like: "Any update on this? @you — in the all-hands channel.",
    really_doing:
      "Performing accountability for onlookers. The audience is the leverage, not the update.",
    reply:
      "Status: [one line]. Sending you the detail directly so we don't clog the channel.",
    arena: "work",
    search_intent: "how to respond when your boss calls you out in a group chat",
  },
  {
    slug: "we-are-a-family",
    name: "Family framing",
    definition: "Employment obligations are replaced by emotional ones.",
    sounds_like: "We're like a family here, so everyone pitches in after hours.",
    really_doing:
      "Turning a contract into loyalty. Families don't ask for overtime pay — that's the point of the metaphor.",
    reply:
      "I'm in for [what you'll actually do]. For anything beyond [hours], let's agree how it's compensated.",
    arena: "work",
    search_intent: "what does we are a family mean at work",
  },
  {
    slug: "vague-authority",
    name: "Vague authority",
    aka: "Management says",
    definition: "An unnamed higher power is invoked so there is nobody to argue with.",
    sounds_like: "Management wants this changed.",
    really_doing:
      "Removing the decision-maker from the conversation so their instruction can't be questioned or negotiated.",
    reply: "Happy to align — who's the owner on that call? I'll confirm the detail with them.",
    arena: "work",
    search_intent: "how to respond to management says at work",
  },
  {
    slug: "implied-threat",
    name: "Implied threat",
    definition: "A consequence hinted at but never stated, so it can be denied.",
    sounds_like: "It'd be a shame if this came up in your review.",
    really_doing:
      "Getting the effect of a threat with none of the accountability. Deniability is built into the phrasing.",
    reply:
      "Want to make sure I've understood: are you saying [explicit version]? Happy to discuss it directly.",
    arena: "work",
    search_intent: "how to respond to a veiled threat from your boss",
  },
  {
    slug: "urgency-by-silence",
    name: "Silent treatment",
    definition: "Withholding a reply until the pressure does the negotiating.",
    sounds_like: "Nothing. For four days. After a direct question.",
    really_doing:
      "Silence costs them nothing and costs you certainty. It's a bid for you to concede without them arguing.",
    reply:
      "Following up on [question] from [date]. If I don't hear back by [date] I'll proceed with [default] so we stay on track.",
    arena: "work",
    search_intent: "what to do when someone ignores your work messages",
  },
  {
    slug: "template-rejection",
    name: "Template rejection",
    definition: "A refusal with no information in it.",
    sounds_like: "We went with a candidate whose experience was a better fit.",
    really_doing:
      "Closing the loop without exposure. The wording is chosen to be unarguable and content-free.",
    reply:
      "Understood, thanks for letting me know. One thing that would genuinely help me: which part of the profile was the gap?",
    arena: "work",
    search_intent: "how to respond to a job rejection email and get feedback",
  },
  {
    slug: "weaponised-politeness",
    name: "Weaponised politeness",
    definition: "Hostility delivered in impeccable manners so any reaction looks unhinged.",
    sounds_like: "Just gently circling back on this, no rush at all!",
    really_doing:
      "The tone is the armour. If you respond to what's underneath, you're the one who escalated.",
    reply: "Thanks for the nudge — [status]. Next update [date].",
    arena: "work",
    search_intent: "how to reply to a passive aggressive coworker",
  },
  {
    slug: "lowball-anchor",
    name: "Lowball anchor",
    definition: "A number thrown out early to reset your expectations downward.",
    sounds_like: "Our budget is tight this quarter — can you do it for less?",
    really_doing:
      "Anchoring the price while keeping the scope untouched. The discount is meant to come out of your margin.",
    reply:
      "I can work to [their budget] — at that number the scope is [reduced version]. The full scope stays at [price].",
    arena: "client",
    search_intent: "how to answer a client who says your price is too high",
  },
  {
    slug: "scope-creep",
    name: "Scope creep by assumption",
    definition: "New work is slipped in as though it was always included.",
    sounds_like: "And obviously that includes the other pages too, right?",
    really_doing:
      "Expanding the deliverable inside a question, so agreeing feels like the polite default.",
    reply:
      "That wasn't in the agreed scope — happy to add it as [price / timeline]. Shall I send the updated version?",
    arena: "client",
    search_intent: "how to deal with scope creep from a client",
  },
  {
    slug: "approval-limbo",
    name: "Approval limbo",
    definition: "Payment or sign-off is deferred to a process with no owner and no date.",
    sounds_like: "We're just waiting on internal approvals.",
    really_doing:
      "An indefinite delay dressed as a procedure. With no name and no date attached, it can run forever.",
    reply:
      "Who's the approver, and what date should I expect? I'll hold [next step] until [date], after which [consequence].",
    arena: "client",
    search_intent: "what to say when a client delays payment",
  },
  {
    slug: "exposure-pay",
    name: "Payment in exposure",
    definition: "Non-money offered in place of money.",
    sounds_like: "This will be great for your portfolio, and more work will follow.",
    really_doing:
      "Converting your invoice into a promise. Future work is not consideration for present work.",
    reply:
      "I'd love the ongoing work. This piece is [price] — happy to discuss a rate for the follow-on separately.",
    arena: "client",
    search_intent: "how to respond to being offered exposure instead of payment",
  },
  {
    slug: "competitor-leverage",
    name: "Competitor leverage",
    definition: "An unnamed cheaper alternative used to move your price.",
    sounds_like: "We've had quotes half of yours.",
    really_doing:
      "Creating a phantom competitor you can't inspect or match, so the only variable left is your number.",
    reply:
      "That's a fair comparison to make. Here's what's in mine: [scope]. If the other quote covers the same, it's the better deal.",
    arena: "client",
    search_intent: "how to respond when a client says a competitor is cheaper",
  },
  {
    slug: "guilt-induction",
    name: "Guilt induction",
    definition: "Your boundary is reframed as damage you're doing to them.",
    sounds_like: "After everything I've done, this is where you draw the line?",
    really_doing:
      "Attaching a moral cost to a normal limit, so keeping it feels like an act of cruelty.",
    reply:
      "I hear that this is hard. My answer on [thing] is still no — and it isn't about [what they've done].",
    arena: "personal",
    search_intent: "how to respond to a guilt trip in a text message",
  },
  {
    slug: "darvo",
    name: "DARVO",
    aka: "Deny, attack, reverse victim and offender",
    definition: "They deny it, attack you for raising it, and end up the injured party.",
    sounds_like: "I can't believe you'd accuse me of that. Do you know how that makes me feel?",
    really_doing:
      "A three-step redirection. By the end of the exchange you're apologising for the complaint you made.",
    reply:
      "I'm not attacking you. The thing I raised is [fact]. I'd still like an answer on that.",
    arena: "personal",
    search_intent: "what is DARVO in an argument",
  },
  {
    slug: "devaluation",
    name: "Devaluation",
    definition: "Your concern is downgraded until it doesn't qualify as a topic.",
    sounds_like: "You're being dramatic, it's really not a big deal.",
    really_doing:
      "Disqualifying the complaint rather than answering it. If your reaction is the problem, their behaviour never is.",
    reply: "It matters to me. I'd like to talk about [specific thing] — can we?",
    arena: "personal",
    search_intent: "how to respond when someone says you are overreacting",
  },
  {
    slug: "whataboutism",
    name: "Whataboutism",
    definition: "Your point is answered with an unrelated accusation.",
    sounds_like: "And what about the time you did the same thing?",
    really_doing:
      "Trading topics so the original issue never gets addressed. Both sides now have a grievance and nothing gets resolved.",
    reply:
      "Happy to talk about that separately. Right now I'm asking about [original issue].",
    arena: "personal",
    search_intent: "how to respond to whataboutism in an argument",
  },
  {
    slug: "sunk-cost-pressure",
    name: "Sunk-cost pressure",
    definition: "Past investment is used as the argument for continuing.",
    sounds_like: "We've already put six months into this — you can't stop now.",
    really_doing:
      "Time already spent is not a reason to keep spending. The argument works by making exit feel like waste.",
    reply:
      "Looking at it from today: [current cost] versus [current value]. On that basis my decision is [decision].",
    arena: "work",
    search_intent: "how to walk away from a project without guilt",
  },
  {
    slug: "false-consensus",
    name: "False consensus",
    aka: "Everyone thinks so",
    definition: "An anonymous crowd is invented to outvote you.",
    sounds_like: "Everyone on the team feels the same way about this.",
    really_doing:
      "Manufacturing a majority you can't verify or address, so disagreeing puts you against the group.",
    reply:
      "That's useful to know. Who specifically raised it? I'd rather talk to them directly than guess.",
    arena: "work",
    search_intent: "how to respond when someone says everyone agrees with them",
  },
];

export const TACTIC_SLUGS = TACTICS.map((t) => t.slug);

export function getTactic(slug: string): Tactic | undefined {
  return TACTICS.find((t) => t.slug === slug);
}

/** Canon handed to the model so detected patterns map onto library pages. */
export const TACTIC_CANON = TACTICS.map((t) => `${t.slug} — ${t.name}: ${t.definition}`).join("\n");

export const ARENA_LABEL: Record<Tactic["arena"], string> = {
  work: "Work",
  client: "Clients & deals",
  personal: "Personal",
};

/** Three worked examples shown on the landing page as proof before payment. */
export const SHOWCASE_SLUGS = ["false-deadline", "blame-trail", "false-agreement"];
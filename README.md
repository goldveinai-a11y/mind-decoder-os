# Cyber Scan

Act as an expert Frontend Developer, UI/UX Designer, and Conversion Rate Optimization specialist.
Your task is to build a high-converting, mobile-first Web-to-Paywall React application called "Cyber-Polygraph".

DESIGN REFERENCE & VISUAL INSPIRATION:
Analyze and strictly follow the visual style, dark mode aesthetic, layout mechanics, custom grid/radar elements, and high-tech feedback loops from this exact design reference website: https://spideytracker.net/intl/es/

TECH STACK:
React, Tailwind CSS, Framer Motion (crucial for complex animations), Lucide React (for icons).

VISUAL STYLE & THEME ("Spider Tracker / Hacker OSINT Terminal"):
- Theme: Dark mode only. Deep blacks (#0a0a0a), dark grays (#111), inspired by https://spideytracker.net/intl/es/
- Accents: Neon Matrix Green (#00ff00), Cyber Amber (#ffb000), Alert Red (#ff003c).
- Typography: Use a monospace font (like 'Space Mono' or 'Fira Code') for all UI elements, logs, and numbers. Use a clean sans-serif for readable body text.
- Background: A faint dark radar grid pattern, subtle scanlines, and high-tech UI overlays matching the reference aesthetic.
- Vibe: The user must feel like a hacker or an FBI profiler intercepting and decoding a secret transmission on a live tactical terminal.

CORE LOGIC & USER FLOW (4 States):

STATE 1: THE INPUT (Landing)
- Header: A sticky top bar with a radar icon and text "COMM_INTERCEPTOR v2.4".
- Hero: "Decode Hidden Motives." Subtext: "Paste a message from your boss, client, or partner. Our AI radar will detect gaslighting, bluffs, and hidden agendas."
- Input area: A large, styling text area with a blinking green cursor. Placeholder: "[Paste intercepted transmission here...]".
- Action: A full-width, glowing neon green button: "INITIALIZE SCAN".
- When the button is clicked, transition to STATE 2.

STATE 2: THE CYBER RADAR (Processing Animation - CRITICAL)
- Do NOT just show a spinner. This state must take exactly 8 seconds to build perceived value.
- Visuals:
  1. A sweeping radar animation in the center of the screen (styled like the tracking map elements in the reference link).
  2. A terminal window displaying rapidly scrolling fake logs (e.g., "Extracting syntax...", "Bypassing emotional filters...", "Detecting manipulation patterns...", "Cross-referencing FBI behavioral database...").
  3. A progress bar that fills up non-linearly (fast to 40%, pauses, fast to 89%, pauses, then 100%).
- After 8 seconds, automatically transition to STATE 3.

STATE 3: THE TEASER & PAYWALL (The Hook)
- Header changes to "ANALYSIS COMPLETE. THREATS DETECTED." (in Alert Red).
- Show a high-tech dashboard teaser:
  - Big red number: "3 Manipulation Patterns Found".
  - Big amber number: "1 Sender Weak Point Identified".
- The Report Preview: Show a skeleton/blurred version of the text analysis. Use CSS blur (backdrop-filter) and glitch effects over blocks of text so it's unreadable but looks highly detailed.
- The Paywall: A bottom-fixed or highly prominent card over the blurred text.
  - Text: "Transmission Encrypted. Unlock the full FBI-level psychological profile and generate a Counter-Strike Response Script."
  - Button: A glowing, pulsating button with a lock icon: "DECRYPT FULL REPORT - $9.99".
- Note: Make this button trigger a simple mock function (e.g., `alert('Redirecting to Stripe...')`) for now, but design it for high CTR. Include trust badges below it (secure payment, anonymous).

STATE 4: THE UNLOCKED RESULT (Mockup of successful payment)
- (Add a hidden developer button to skip to this state for testing).
- Clean, readable, but still "cyber" styled matching the dark UI.
- Section 1: "Threat Analysis" (List of detected manipulations with red icons).
- Section 2: "Sender's True Motive" (Brief summary).
- Section 3: "Counter-Strike Script" (A prominent, copyable text block with a "Copy to Clipboard" button).

ANIMATION REQUIREMENTS (Framer Motion):
- All state transitions must be seamless. Use fade-ins and glitch-reveal effects.
- The terminal logs in State 2 must appear line-by-line with a typing effect.
- Buttons should have a subtle pulse or glow effect on hover/active states.

Please generate the complete, production-ready code for this application in a single view, ensuring perfect mobile responsiveness and adherence to the reference design aesthetics.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4b9ee0c2-68ec-4f7a-b9d9-c55bf58f97fa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

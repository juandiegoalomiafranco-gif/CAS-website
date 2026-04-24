---
name: designing-premium-brands
description: Generates high-end, premium brand identities, typography choices, and UI/UX frontend designs. Escapes generic AI outputs via deep structural divergence, extreme aesthetics, and an emotion-first process. Use when the user asks for premium web design, high-end branding, or "non-generic", "wow-factor" user interfaces.
---

# Premium Brand Design & UI Construct

## The Convergence Problem
LLMs are weighted to produce the "average". When asked for design, they output standard, safe, boring concepts (e.g., Bootstrap-like layouts, purple gradients, default system fonts). This skill forces you (the Agent) to break these habits. You must intentionally embrace productive tension, extreme aesthetics, and "misalignment by design" to build a bespoke brand experience. 

**Never start with visuals. Always start with the emotive narrative.**

## When to use this skill
- When requested to design a completely new website from scratch.
- When the user asks for a "high-end", "premium", or "luxurious" design (e.g. medical niches, luxury brands).
- When instructed to rethink or overhaul a brand's visual identity.

## Workflow

Follow this "Escape the Average" workflow strictly. Use checkboxes to track your state if asked to do a full brand overhaul:

1. **Phase 0: The Emotive Narrative**
   - Do NOT talk about colors, logos, or padding yet. 
   - Ask the user (or deduce): *How must the user feel when they see this brand?* (e.g., Intimidated by the expertise? Reassured by the luxury? Disoriented? Awed?). 
   - Write a 2-paragraph Emotive Narrative.

2. **Phase 1: Brand Philosophy & Metaphor**
   - Define a central metaphor. If the brand is a luxury surgeon, maybe the metaphor is "The Artisan Sculptor" or "The Silent Gallery".
   - Define the Aesthetic Extreme (Choose one to lean into: Brutalism, Editorial/Print-Inspired, Retro-Futurism, Ultra-Minimalism/Swiss).

3. **Phase 2: Visual Rules & Typography**
   - **Forbid Standard Typography**: Avoid Inter, Roboto, Arial, Open Sans. Mandate Google Fonts with distinct character (e.g., `Cormorant Garamond`, `Cinzel`, `Outfit`, `Space Grotesk`, `Syne`).
   - Define a non-standard color palette. Instead of standard hex codes (`#0000FF`), use HSL and describe the color in real-world terms (e.g., "Oxidized Copper", "Vantablack", "Surgical Steel").
   - Set padding/margin rules that break the grid. Introduce intentional asymmetrical whitespace. 

4. **Phase 3: The "Diverge/Kill/Mutate" UI Process**
   - When building a UI component (like a header or hero section), **DO NOT just give one option.**
   - Produce 3 radically different approaches based on the philosophy.
   - Wait for the user to choose one to "Mutate" or "Kill". 

5. **Phase 4: Output to Template**
   - Once decisions are solid, output the entire system to `DESIGN_TEMPLATE.md`.

## Instructions (Anti-Convergence Rules)

*   **No Placeholders:** Never use grey boxes or generic images. Use `generate_image` or high-quality Unsplash links if available.
*   **Banned CSS Habits:** No out-of-the-box CSS frameworks like Tailwind config defaults. If you use Tailwind, strictly configure custom variables that match the brand philosophy. 
*   **Embrace Discomfort:** A generic UI feels perfectly safe. A premium UI feels slightly risky but deliberate. Use huge typography, overlapping elements, or stark contrasts.
*   **Typography is 90% of Design:** Put massive effort into font pairings. Serif for headings (elegant) and structured Sans-Serif for body, or vice versa depending on the vibe.

## Resources
- Copy the template from `resources/DESIGN_TEMPLATE.md` to establish the project's source of truth.

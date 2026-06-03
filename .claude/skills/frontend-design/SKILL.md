---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Priority order: 1) working code and correctness, 2) accessibility and responsiveness, 3) performance, 4) aesthetic distinctiveness. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints. If the user does not specify a framework, default to plain HTML/CSS/JS unless the environment explicitly requires another stack. If the audience or goal is missing, ask one clarifying question before coding. If the user does not provide enough detail to implement the interface safely, ask up to 3 clarifying questions before generating code. If requirements conflict, state the conflict and choose the least risky interpretation.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Choose exactly one aesthetic direction from this list and name it before coding: minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft pastel, or industrial.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:

- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Required baseline rules:

- **Semantic structure**: Use semantic HTML, accessible ARIA patterns when needed, and meaningful content hierarchy.
- **Accessibility**: Always implement semantic HTML, visible keyboard focus, sufficient color contrast, and responsive layouts. Do not use decorative effects that reduce readability or usability.
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics. Pair a distinctive display font with a refined body font. If a requested font, animation library, or asset cannot be loaded, substitute a safe fallback and continue generating a working interface.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Resilience**: If a requested font, library, or asset cannot be loaded, use a local or system fallback and keep the interface functional and readable.

Optional aesthetic upgrades:

- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: If the chosen aesthetic is maximalist, add up to 3 decorative effects and 2 animation layers; if the chosen aesthetic is minimal, keep code simple, avoid non-essential motion, and prioritize spacing and typography over decorative effects.

The model should produce distinctive, production-grade frontend interfaces and commit fully to a clear aesthetic vision.

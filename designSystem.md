Below is a comprehensive **Design System Document** for your Ilon X edtech platform, based on the finalized light and dark mode landing page designs we've developed. This document serves as a "single source of truth" to ensure consistency across all components, pages, and features. It incorporates the youthful & energetic color scheme (indigo for creativity/futuristic elements, mint green for positivity/balance, soft yellow for alerts/cheer, dark slate for neutrality), glassmorphism style, Geist font, Lucide icons, Framer Motion animations, and dual-mode support.

I've formatted it as a Markdown-style document for easy copying into tools like Notion, Google Docs, or your repo's README.md. When prompting LLMs (like me or others) for new components, reference this document explicitly—e.g., "Design a dashboard component in React/Tailwind following the Ilon X Design System: use glassmorphism cards in dark mode, Geist font, indigo accents, and ensure light/dark toggle compatibility."
 
# Ilon X Design System

**Version**: 1.0 (Finalized July 28, 2025)  
**Overview**: This design system defines the visual and interactive language for ilon X, an AI-powered edtech platform. It emphasizes a youthful, energetic vibe for engaging high school/college learners (e.g., gamified elements). Key principles:
- **Accessibility**: WCAG AA compliant (high contrast ratios, e.g., 4.5:1+; test with Lighthouse).
- **Responsiveness**: Mobile-first (use Tailwind's md/lg breakpoints).
- **Modes**: Support light and dark themes with a toggle (e.g., via React state).
- **Tech Stack**: React 18+, Tailwind CSS 3.4+, Lucide-react icons, Framer Motion for animations, Geist Sans font.
- **Inspiration**: Glassmorphism (translucent, blurred elements) for a modern, "futuristic" feel, aligned with edtech trends like Duolingo.

## 1. Color Palette (Youthful & Energetic Scheme)
Use 2-3 colors per component to avoid clutter. Indigo/mint for primary actions, yellow for highlights, slate for neutrals. Adjust opacity for glass effects.

| Color | Hex Code | Usage | Light Mode Example | Dark Mode Example |
|-------|----------|--------|---------------------|-------------------|
| **Indigo (Primary)** | #6366F1 | Creativity/futuristic accents (e.g., buttons, links, gradients). | text-indigo-600, bg-indigo-100/50 | text-indigo-400, bg-indigo-500/30 |
| **Mint Green (Accent)** | #34D399 | Positivity/balance (e.g., success states, progress bars). | text-emerald-600, bg-emerald-100/50 | text-emerald-400, bg-emerald-500/30 |
| **Soft Yellow (Highlight)** | #FACC15 | Alerts/cheer (e.g., notifications, badges—use sparingly). | text-yellow-500, bg-yellow-100/50 | text-yellow-300, bg-yellow-400/30 |
| **Dark Slate (Neutral)** | #1E293B | Text/backgrounds in dark mode; footers/contrasts. | text-slate-900, bg-slate-50 | text-slate-300, bg-slate-800 |
| **White/Black (Base)** | #FFFFFF / #000000 | Backgrounds/text with opacity for glassmorphism. | bg-white/70, text-slate-900 | bg-white/10, text-white |

- **Gradients**: Use `bg-gradient-to-r from-indigo-500 to-emerald-400` for energetic effects (e.g., buttons, headings).
- **Rules**: High contrast (e.g., dark text on light bg). Test with tools like WAVE. In dark mode, use softer opacities to reduce eye strain.

## 2. Typography
Use clean, geometric sans-serif for readability in learning contexts.

- **Primary Font**: Geist Sans (via @font-face CDN or local files; fallback to Inter).
  - Weights: 400 (regular), 700 (bold).
  - Sizes (Tailwind classes): 
    - Headings: text-6xl (hero), text-4xl (sections), text-2xl (cards).
    - Body: text-lg (paragraphs), text-sm (labels/footers).
  - Line Height: leading-tight for headings, leading-relaxed for body.
- **Rules**: Limit to 2-3 sizes per page. Use font-bold for emphasis. Ensure 1.5x line spacing for long-form content (e.g., notes summaries).

Example CSS (in index.css):
```css
:root {
  font-family: 'Geist Sans', 'Inter', system-ui, sans-serif;
}
```

## 3. Icons
- **Library**: Lucide-react (import specific icons, e.g., `import { Sparkles } from 'lucide-react';`).
- **Sizing**: 20-32px (e.g., size={24}).
- **Colors**: Match palette (e.g., text-emerald-400 in dark, text-emerald-600 in light).
- **Usage**: For accents only (e.g., in buttons, lists). Add subtle animations like hover:scale-105.
- **Examples**: Sparkles for branding, BookOpenCheck for features, Sun/Moon for theme toggle.

## 4. UI Patterns & Components
Reuse these patterns for consistency. Build as React components in a /components folder.

- **Glassmorphism Cards (FrostCard)**:
  - Style: Rounded-3xl, backdrop-blur-xl, semi-transparent bg (white/10 dark, white/70 light), ring-1 for borders.
  - Hover: bg-opacity increase + transition.
  - Example Code (adapt for mode):
    ```jsx
    const FrostCard = ({ children, className }) => (
      
        {children}
      
    );
    ```

- **Buttons**:
  - Primary: bg-emerald-500 (light) / bg-emerald-400 (dark), rounded-lg/full, hover:shadow-xl, text-white/slate-900.
  - Secondary: Bordered (border-white/20 dark, border-slate-300 light), backdrop-blur-sm.
  - Add Framer Motion: whileHover={{ scale: 1.05 }}.

- **Navigation (Navbar)**:
  - Sticky, backdrop-blur-md, semi-transparent bg (white/5 dark, white/70 light).
  - Links: hover:text-emerald-400/600, text-sm.

- **Sections**:
  - Padding: py-24, px-6 (mobile), max-w-6xl mx-auto.
  - Backgrounds: Gradients or subtle blobs (blurred circles for energy).

- **Animations (Framer Motion)**:
  - Subtle: initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} (fades).
  - Hovers: whileHover={{ scale: 1.03 }}.
  - Rules: Use sparingly for engagement (e.g., hero text, card hovers)—no overwhelming effects.

- **Theme Toggle**:
  - Button: Fixed top-4 right-4, z-100, with Sun/Moon icons.
  - Logic: React state (isDarkMode), conditional rendering of light/dark components.

## 5. Layout & Spacing
- **Grid/Flex**: Use Tailwind grid (md:grid-cols-2/3) for responsive layouts.
- **Spacing Scale**: px-6/py-4 (small), gap-4/8/10 (flex/grid), max-w-5xl/6xl for containers.
- **Breakpoints**: sm (mobile), md (tablet), lg (desktop).

## 6. Accessibility & Best Practices
- Contrast: Ensure text meets 4.5:1 (e.g., white on dark gradients).
- Focus: Add outline-none + focus:ring-2 ring-emerald-400.
- ARIA: Use aria-label for icons/buttons (e.g., toggle).
- Testing: Run Lighthouse audits; support dark/light via prefers-color-scheme media query.

## 7. Implementation Tips
- **Tailwind Config**: Extend with custom colors (e.g., primary: '#6366F1').
- **Reusable Components**: Build GlassCard, Button, etc., in /components.
- **Prompting LLMs**: "Create a [component] in React/Tailwind matching EduNote X Design System: youthful scheme (indigo primary), glassmorphism in dark/light modes, Geist font, Lucide icons, Framer Motion hovers."
- **Updates**: Version this doc; review after new components.

This system ensures scalable, consistent development. For questions or expansions, reference this in prompts!

This document is self-contained and ready to use. If you need it in a different format (e.g., PDF or with Figma links), or examples of prompting for a specific new component (like a notes dashboard), let me know!
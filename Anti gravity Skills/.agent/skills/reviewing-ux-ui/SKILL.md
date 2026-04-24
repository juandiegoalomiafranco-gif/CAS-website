---
name: reviewing-ux-ui
description: Provides a comprehensive UI/UX pre-delivery checklist. Use at the end of every design or implementation to verify visual quality, interactions, light/dark mode contrast, accessibility, and platform compliance.
---

# UI/UX Pro Max Checklist & Review

Use this skill at the end of a design or implementation phase to evaluate the UI/UX quality strictly against professional standards.

## Workflow

1.  **Analyze the Delivery**: Review the generated code or mockups against the Pre-Delivery Checklist.
2.  **Evaluate Visual Quality**: Check for icons, layouts, typography, and contrast.
3.  **Check Interactions**: Ensure elements meet minimum touch target sizes and interaction feedback rules.
4.  **Confirm Dark/Light Modes**: Validate contrast and visibility on both themes.
5.  **Produce Review Report**: Provide a pass/fail report to the user along with required fixes.

## Pre-Delivery Checklist

Before delivering UI code, verify these items step-by-step:

### Visual Quality
- [ ] No emojis used as icons (use SVG or vector icons instead).
- [ ] All icons come from a consistent icon family and style (e.g., Phosphor, Heroicons).
- [ ] Official brand assets are used with correct proportions and clear space.
- [ ] Pressed-state visuals do not shift layout bounds or cause jitter.
- [ ] Semantic theme tokens are used consistently (no ad-hoc per-screen hardcoded colors).

### Interaction
- [ ] All tappable elements provide clear pressed feedback (ripple/opacity/elevation) within 80-150ms.
- [ ] Touch targets meet minimum size (>=44x44pt iOS, >=48x48dp Android, or equivalent web standards).
- [ ] Micro-interaction timing stays in the 150-300ms range with native-feeling easing.
- [ ] Disabled states are visually clear, use reduced emphasis, and are non-interactive.
- [ ] Screen reader focus order matches visual order, and interactive labels are descriptive.
- [ ] Gesture regions avoid nested/conflicting interactions (tap/drag conflicts).

### Light/Dark Mode Contrast
- [ ] Primary text contrast >=4.5:1 in both light and dark mode.
- [ ] Secondary text contrast >=3:1 in both light and dark mode.
- [ ] Dividers/borders and interaction states are distinguishable in both modes.
- [ ] Modal/drawer scrim opacity is strong enough to preserve foreground legibility (typically 40-60% black).
- [ ] Both themes are tested before delivery (not inferred from a single theme).

### Layout & Spacing
- [ ] Safe areas are respected for headers, tab bars, and bottom CTA bars.
- [ ] Scroll content is not hidden behind fixed/sticky bars.
- [ ] Verified responsiveness on small phone, large phone, and tablet/desktop classes.
- [ ] Horizontal insets/gutters adapt correctly by device size and orientation.
- [ ] 4px/8px or 4dp/8dp spacing rhythm is maintained across component, section, and page levels.
- [ ] Long-form text measure remains readable on larger devices (no edge-to-edge paragraphs).

### Accessibility
- [ ] All meaningful images/icons have accessibility labels (`alt` text or `aria-label`).
- [ ] Form fields have labels, hints, and clear error messages.
- [ ] Color is not the only indicator of an important state (e.g., error blocks include icons/text).
- [ ] Reduced motion and dynamic text size/zoom are supported without layout breakage.
- [ ] Accessibility traits/roles/states (selected, disabled, expanded) are announced correctly.

## Common Anti-Patterns to Reject
- Emojis (🎨, 🚀) masking as UI icons.
- Instant, non-animated state transitions (0ms).
- Content placed under system status bars or notches.
- Mixing 20pt, 24pt, and 28pt icons haphazardly.
- Pure black `#000000` text on pure white `#FFFFFF` backgrounds (prefer dark grays like `#1F2937` or off-whites).

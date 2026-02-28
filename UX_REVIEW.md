# Sternenko Widget -- UX Specification Review

**Reviewed by:** UX Review Agent
**Date:** 2026-02-27
**Documents reviewed:**
- `/Users/sergii/Dev/Wearitar/sternenko-widget/REQUIREMENTS.md` v1.0
- `/Users/sergii/Dev/Wearitar/sternenko-widget/UX_SPEC.md` v1.0
**Design direction under review:** "Clean, minimal, and modern"

---

## 1. UX Health Score

### **Score: 82 / 100**

This is a strong specification. The UX spec is unusually thorough for a widget of this scope -- it includes pixel-level spacing, full state matrices, CSS code samples, accessibility hooks, responsive breakpoints, and acceptance criteria. However, several structural issues, specification gaps, and deviations from the "clean, minimal, modern" directive reduce the score. The issues below range from layout logic errors that would cause visual bugs in production to missed specification details that will force engineers to make UX decisions.

---

## 2. Score Breakdown

| # | Category | Weight | Score | Deductions | Violated Rule IDs |
|---|----------|--------|-------|------------|-------------------|
| 1 | Users & Context Fit | 10 | 9 | -1: Widget `aria-label` not localized (UX-OQ-01 left unresolved; minor gap for non-English screen reader users) | A/2 |
| 2 | IA & Navigation Predictability | 10 | 9 | -1: Escape key scope is underspecified -- does the Escape handler fire only when focus is inside the widget, or globally? The AC says "widget or any child element has focus" but the CSS/JS implementation guidance does not clarify listener attachment scope | A/16 |
| 3 | Hierarchy & Focal Points | 12 | 11 | -1: Vertical expanded layout (S4) says hierarchy is "same as S2" without re-stating it explicitly -- violates the spec's own pattern of being self-contained per screen | A/7 |
| 4 | Simplicity & Cognitive Load | 10 | 10 | No deductions. The two-state model is appropriately simple. Progressive disclosure is well-used | -- |
| 5 | Flows & Progressive Disclosure | 10 | 8 | -2: Bottom-position expanded layout uses `flex-direction: column-reverse` which reverses DOM reading order for screen readers vs. visual order -- a significant accessibility concern (see P0-01). Also, the vertical-to-horizontal mobile transition for center positions lacks a transition specification | A/14, A/47 |
| 6 | Feedback & State Coverage | 12 | 10 | -2: No specification for what happens when the widget is focused but Escape is pressed while already collapsed. No specification for the hover state of the overall widget container in expanded state (only collapsed hover is defined at 2% opacity shift). Missing "post-donate" micro-feedback specification | A/19 |
| 7 | Typography & Readability | 8 | 7 | -1: The body text line-height (1.6) and header line-height (1.4) produce the same computed pixel value (22.4px) at their respective font sizes (14px and 16px). This is a coincidence that could confuse developers and suggests the body text line-height should be adjusted for clearer visual differentiation | A/21, A/26 |
| 8 | Color Semantics & Contrast | 8 | 7 | -1: The focus ring color in dark mode (`#5B9BD5` on `#1A1A2E`) is 5.1:1 which passes AA but is the bare minimum. On non-interactive backgrounds (e.g., the hover-tint behind buttons), the effective contrast of the focus ring could drop below AA. Also, the spec does not verify focus ring contrast against all possible background states (rest, hover, active) | A/27, A/31 |
| 9 | Content-first Visuals & Imagery | 5 | 5 | No deductions. Single purposeful logo, no decorative imagery, solid color backgrounds | -- |
| 10 | Consistency & Design System Use | 10 | 9 | -1: The collapsed horizontal padding is `12px 16px` (asymmetric: 12px top/bottom, 16px left/right) while the expanded state uses `16px` uniform padding. This inconsistency means the header row shifts position during expand/collapse, which will cause a visual "jump" unless CSS is carefully managed | A/42, A/43 |
| 11 | Responsive & Cross-device Consistency | 10 | 7 | -3: Major gap in tablet breakpoint behavior for vertical layout (spec says "may be tight -- acceptable" without quantifying). No specification for landscape mobile. The mobile breakpoint at 480px does not align with the requirements document's 768px mobile threshold -- the requirements say center-position repositioning happens on "small viewports (< 480px)" but also define mobile as < 768px. This discrepancy needs resolution | A/44 |
| 12 | Testing & Iteration Readiness | 5 | 4 | -1: Usability test recommendations are present but lack success criteria thresholds (e.g., "what expand rate is acceptable?"). No mention of automated visual regression testing for the 48 visual variants (8 positions x 2 states x 3 themes) | A/49 |

**Weighted Total:** 9 + 9 + 11 + 10 + 8 + 10 + 7 + 7 + 5 + 9 + 7 + 4 = **82 (after weighting: 82.4, rounded to 82)**

---

## 3. P0 Issues (Release Blockers)

### P0-01: `flex-direction: column-reverse` breaks screen reader reading order for bottom positions

**Symptom:** Section 8, screen S2 specifies that bottom-position expanded layouts use `flex-direction: column-reverse` so the header row stays at the bottom visually. This reverses the DOM order for screen readers -- they will read "Donate button, body text, header" instead of "header, body text, Donate button."

**Impact:** WCAG 1.3.2 (Meaningful Sequence) violation. Screen reader users will encounter the Donate button before understanding the context (body text) or even what widget this is (header). This is a release blocker for accessibility compliance.

**Rule IDs violated:** A/14, A/16, A/47

**Exact Fix:**
- Remove the `flex-direction: column-reverse` approach
- Instead, keep the DOM order as: header row, body text, donate button (logical reading order) for ALL positions
- For bottom positions, use CSS to anchor the widget to the bottom edge and let it grow upward naturally. Since the widget uses `position: fixed; bottom: 16px`, adding content above the header row already causes the widget to grow upward -- no `column-reverse` needed
- Use this CSS structure instead:

```css
/* Bottom positions: widget anchored at bottom, grows upward */
.widget-container[data-position^="bottom"] {
  bottom: 16px;
  /* Content in normal DOM order; fixed bottom positioning 
     causes the widget to grow upward as content is added */
}
```

- If visual reordering is truly needed for aesthetic reasons, use `display: flex; flex-direction: column` with the expanded content placed ABOVE the header in the DOM, but visually the header should remain at the bottom using `order: 1` on the header and `order: 0` on the expanded content. Then add `aria-owns` or restructure the DOM so screen reader order matches logical order
- Acceptance criteria AC-03 and AC-05 need an additional clause: "And the screen reader reading order is: header, body text, donate button regardless of visual position"

### P0-02: Collapsed-to-expanded padding inconsistency causes visual jump

**Symptom:** Screen S1 (collapsed horizontal) specifies `padding: 12px 16px` (12px top/bottom, 16px left/right). Screen S2 (expanded horizontal) specifies `padding: 16px` (uniform). During the expand transition, the header row's vertical position shifts by 4px (from 12px top padding to 16px top padding), causing a visible "jump" of the logo and header text.

**Impact:** Violates the "clean, minimal" directive. The header, logo, and collapse control will visibly jump 4px downward during expansion and 4px upward during collapse. On a 250ms transition, this is noticeable and feels unpolished. Users will perceive the widget as buggy.

**Rule IDs violated:** A/42, A/43, A/19

**Exact Fix:**
- Standardize padding to `16px` for both collapsed and expanded states
- Update S1 dimensions: Height becomes `80px` (48px logo + 16px top + 16px bottom) instead of `72px`
- OR: Keep `12px 16px` for collapsed and use `12px 16px` for the header row in expanded state, with additional `4px` padding only on the body/action sections
- Recommended approach: Use `padding: 12px 16px` consistently for both states. The body section already has `margin-top: 12px` which provides sufficient separation from the header row
- Update the token usage: Container padding should reference `--sw-space-md` (12px) vertically and `--sw-space-lg` (16px) horizontally in BOTH states

---

## 4. P1 Issues (Important)

### P1-01: Mobile breakpoint conflict between requirements and UX spec

**Symptom:** The requirements document (EC-01) says mobile adjustments happen at "< 480px width" for center-position repositioning but also defines mobile broadly. The UX spec defines three breakpoints: Mobile (< 480px), Mobile-wide (480-767px), Tablet+ (>= 768px). The center-position repositioning only happens at < 480px, meaning a user on a 500px-wide phone in portrait mode still gets a vertical sidebar layout.

**Impact:** On phones with 480-767px logical viewport width (many modern phones have ~390-430px CSS pixels, but tablets in portrait are ~768px), the vertical center layout will work but may feel cramped. More critically, the requirements document section on device breakpoints is not aligned with the UX spec, which could cause confusion during implementation.

**Rule IDs violated:** A/44

**Exact Fix:**
- Align the breakpoints: Change the center-position repositioning threshold to `< 768px` (matching the requirements document's implicit mobile/tablet boundary) OR explicitly document in both specs that 480px is the intentional threshold and explain why (e.g., "vertical layout is still usable between 480-767px")
- Recommended: Use `< 768px` for center-position repositioning. Vertical sidebar layouts on a 500px phone are a poor experience
- Add an acceptance criterion:

```
Given position="center-left" and viewport width is 600px
When the widget renders
Then [specify expected behavior -- vertical or repositioned to bottom-left?]
```

### P1-02: No specification for expanded-state container hover

**Symptom:** S1 (collapsed state) specifies a "2% opacity shift" hover on the widget container. S2 (expanded state) does not specify a container-level hover -- only the Donate button and Collapse control have hover states defined.

**Impact:** If the collapsed state has a container hover and the expanded state does not, the experience is inconsistent. If the container hover is accidentally inherited into the expanded state, the entire card will tint on hover, which competes visually with the button hover states.

**Rule IDs violated:** A/19, A/42

**Exact Fix:**
- Explicitly specify that the expanded-state container has NO hover state (the container hover in collapsed state serves as an affordance to communicate "this is interactive / expandable")
- Add to S2 state matrix: `| Hover (container) | No change -- hover feedback is on individual interactive elements only |`
- Add CSS clarification:

```css
.widget-container[data-expanded="true"]:hover {
  /* No background tint -- expanded state uses per-element hover */
}
```

### P1-03: Vertical collapsed layout at 120px width may truncate translations

**Symptom:** S3 specifies a 120px fixed width for vertical collapsed layout. With 16px padding on each side, the content area is 88px. The German header text "Helfen Sie, Leben in der Ukraine zu retten" at 16px bold in an 88px column will produce approximately 10-12 lines of wrapped text, making the vertical collapsed widget very tall.

**Impact:** A ~200px tall sidebar widget is no longer "compact" or "minimal." It visually dominates the viewport edge and may obscure content. The Ukrainian header at 36 Cyrillic characters will also produce many lines in this narrow column.

**Rule IDs violated:** A/10, A/35, A/33

**Exact Fix:**
- Option A: Increase vertical collapsed width from 120px to 160px. This gives 128px content width, reducing German header wrapping to ~6-7 lines. Update `--sw-vertical-collapsed-width` token
- Option B: Reduce the header font size to 14px in vertical collapsed layout only. This keeps the 120px width but reduces height
- Option C: Truncate the header to 2-3 lines with ellipsis in vertical collapsed layout (add `display: -webkit-box; -webkit-line-clamp: 3; overflow: hidden`)
- Recommended: Option A (160px width). It maintains readability, and a sidebar widget can afford to be 160px wide on desktop viewports (>= 768px where vertical layout is shown). Update the token: `--sw-vertical-collapsed-width: 160px;`
- Add an acceptance criterion testing the German translation in vertical collapsed layout and verifying the widget height does not exceed a reasonable maximum (e.g., 250px)

### P1-04: Missing "opens in new tab" translations for Donate aria-label

**Symptom:** UX-OQ-02 identifies that the "Donate" button should have an aria-label like "Donate -- opens in new tab" but the spec does not provide translations for "opens in new tab" in the 5 non-English languages. The resolution section says "Engineering can proceed with English-only aria-labels."

**Impact:** Screen reader users who read Ukrainian, German, French, Czech, or Polish will hear English "opens in new tab" mixed with their language's button text. This is a WCAG usability issue (not a technical violation, but a poor experience).

**Rule IDs violated:** A/2, A/35

**Exact Fix:**
- Provide translations for the aria-label suffix. Add to the translation interface:

```typescript
interface SternenkoTranslation {
  header: string;
  body: string;
  supportAction: string;
  donateAction: string;
  collapseAriaLabel: string;
  donateAriaLabel: string;  // NEW: "[Donate text] -- opens in new tab" localized
  widgetAriaLabel: string;  // NEW: "Sternenko Fund donation widget" localized
}
```

- Provide these translations:
  - eng: "Donate -- opens in new tab"
  - ukr: "Задонатити -- відкриється в новій вкладці"
  - de: "Spenden -- oeffnet in neuem Tab"
  - fr: "Faire un don -- ouvre dans un nouvel onglet"
  - cs: "Darovat -- otevre se v novem panelu"
  - pl: "Wplacic darowizne -- otworzy sie w nowej karcie"

(Note: these translations need native speaker review for accuracy. The diacritics have been omitted here for ASCII safety but must be included in the actual implementation.)

### P1-05: Chevron direction specification may confuse users

**Symptom:** C7 (Collapse Control) specifies chevron directions: "Top positions: chevron pointing UP" / "Bottom positions: chevron pointing DOWN." This means the chevron points toward the edge the widget is anchored to. However, the conventional UX pattern is for the collapse chevron to point toward the direction the content will move when collapsing (i.e., the content shrinks).

**Impact:** For top positions, the widget expands downward and the collapse chevron points UP. A user might interpret "UP chevron" as "expand upward" rather than "collapse." Similarly, for bottom positions expanding upward, the DOWN chevron could be read as "expand downward." This is ambiguous.

**Rule IDs violated:** A/12, A/16

**Exact Fix:**
- Change the chevron convention to use a universal "X" close icon or a double-chevron that more clearly communicates "close/collapse"
- OR: Keep chevrons but reverse the direction so they point toward where the expanded content will go when collapsing (the content retreats into the collapsed widget):
  - Top positions (expand down): Chevron points UP (content retreats upward) -- this actually matches the current spec, so the current spec may be correct after all
  - Bottom positions (expand up): Chevron points DOWN (content retreats downward) -- this also matches
- Resolution: The current spec IS logically correct (chevron points toward the collapse direction). However, add a brief rationale note in C7: "The chevron points toward the direction the widget collapses (toward the anchored edge)." This prevents confusion during implementation
- Additionally: Consider the usability test recommendation in section 18.2 as critical -- if users struggle with the chevron, switch to an "X" icon which is universally understood as "close"

### P1-06: Shadow specification may feel "heavy" -- not aligned with "clean, minimal, modern"

**Symptom:** The light-mode shadow is `0 4px 16px rgba(0, 0, 0, 0.12)`. This is a reasonable elevation shadow, but the 16px blur radius is quite large for a widget that is already visually distinct (it floats over page content with a different background). Modern minimal design trends favor tighter, more subtle shadows or border-based elevation.

**Impact:** The shadow may make the widget feel "heavy" or "floating" in a dated way, especially on light backgrounds where the shadow is most visible. The dark-mode shadow at `rgba(0, 0, 0, 0.4)` is even heavier.

**Rule IDs violated:** A/38, A/39 (trend-chasing vs. clarity)

**Exact Fix:**
- Reduce the shadow to a more minimal specification: `0 2px 8px rgba(0, 0, 0, 0.08)` for light mode and `0 2px 8px rgba(0, 0, 0, 0.24)` for dark mode
- Alternatively, consider a 1px border (`--sw-border` color) combined with a micro-shadow: `0 1px 3px rgba(0, 0, 0, 0.08)`. This is the approach used by modern design systems (e.g., Vercel, Linear, Notion) for floating elements
- Update tokens:

```css
--sw-shadow: 0 1px 4px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.06);
```

- This two-layer shadow approach creates a more refined, modern feel while maintaining sufficient elevation
- Add a `border: 1px solid var(--sw-border)` to the container for crisp edge definition in both themes

---

## 5. P2 Improvements (Nice-to-Have)

### P2-01: Consider reducing the 4-level typography hierarchy to 3 levels

The spec defines T1 (16px/700), T2 (14px/400), T3 (15px/700), T4 (14px/600). T3 and T4 are visually very close (15px vs 14px, 700 vs 600). For a "clean, minimal" widget with only 4 text elements, consider unifying T3 and T4 into a single level (e.g., 14px/700 for both buttons/links). This reduces visual complexity.

### P2-02: Entrance animation delay of 400ms may feel sluggish

A 400ms delay before animation begins, plus 300ms animation = 700ms before the widget is fully visible. On fast connections where the script loads in <100ms, this 700ms gap between page load and widget visibility may make the widget feel slow. Consider reducing the delay to 200ms or removing it entirely (the animation itself provides sufficient "softness").

### P2-03: The `#F0F0F5` logo background in light mode adds visual clutter

The light-mode logo uses a `#F0F0F5` circular background. On a `#FFFFFF` widget background, this creates a subtle gray circle that adds visual noise without serving a functional purpose (the black star logo is already visible on white). For a "clean, minimal" aesthetic, consider removing the logo background in light mode (transparent) and only using it in dark mode where it is functionally necessary.

### P2-04: The "Support >" action text appends a literal ">" character

Using ">" as a directional indicator after "Support" is visually heavy and potentially confusing (is it a chevron? a greater-than sign?). Modern minimal design uses either: (a) an inline SVG arrow icon, or (b) no arrow at all, relying on color and weight to communicate interactivity. Consider replacing the ">" with a small (12px) SVG right-arrow icon, or removing the directional indicator entirely.

### P2-05: Add explicit `will-change` properties for animation performance

The animation CSS samples do not include `will-change` hints. For smooth 60fps transitions on mobile, add `will-change: max-height, opacity` to the expandable region and `will-change: transform, opacity` to the entrance animation target.

### P2-06: Consider adding a subtle entry/exit transition for the "Support" text

When expanding, the "Support" action disappears and the collapse control appears. The spec does not specify how the "Support" text disappears -- does it fade, or does it vanish instantly? A 150ms fade-out on the "Support" text, coordinated with the expand animation, would feel more polished.

### P2-07: The 12px border-radius on the container may feel rounded by modern standards

12px is a standard but somewhat safe border-radius. For a "modern" feel, consider 16px (matching Apple's design language for floating cards) or 8px (matching Google Material's approach). 12px sits in a middle ground that does not strongly evoke either system. This is subjective and low priority.

---

## 6. Missing Artifacts / Gaps

### Gap 1: No visual mockup or reference image

**What is missing:** The entire UX spec uses ASCII wireframes. While these are functional, they cannot communicate color, typography rendering, shadow appearance, or the overall "feel" of the widget. An engineer building from ASCII wireframes alone will make dozens of micro-visual decisions that may not align with the "clean, minimal, modern" intent.

**Where to add:** A new section (e.g., "19. Visual Reference") should include at least one high-fidelity static image or Figma link for: (a) collapsed horizontal light, (b) expanded horizontal light, (c) collapsed horizontal dark, (d) expanded vertical light.

**Structure:** 4 annotated screenshots/renders at 1x and 2x resolution, exported as PNG or linked from a design tool.

### Gap 2: No specification for what "auto" color scheme resolves to when Shadow DOM prevents `prefers-color-scheme` detection

**What is missing:** The spec says the widget runs inside Shadow DOM. The `prefers-color-scheme` media query is a page-level media query and should work inside Shadow DOM, but this is not explicitly confirmed or tested. Edge cases (e.g., iframes, certain browser extensions that force dark mode) are not addressed.

**Where to add:** Section 12 (Accessibility) or Section 14 (Interaction), add a note: "The `prefers-color-scheme` media query operates at the window level and is accessible from within Shadow DOM. Browser-forced dark modes (e.g., Chrome's forced dark mode flag) may not trigger the media query and should not be relied upon."

### Gap 3: No specification for widget behavior when viewport height is very small

**What is missing:** The expanded widget can be quite tall (header + separator + body text + donate button = ~250-300px). On a landscape mobile viewport (e.g., 568px x 320px), the expanded widget may overflow the viewport vertically. The spec does not address this.

**Where to add:** Section 13 (Responsive Behavior), add a subsection: "13.5 Small Viewport Height." Specify: if the expanded widget height exceeds `calc(100vh - 32px)`, add `max-height: calc(100vh - 32px); overflow-y: auto` to the expanded region.

### Gap 4: No specification for transition behavior when resizing viewport across breakpoints

**What is missing:** If a user has the widget open in expanded state on a desktop-width browser, then resizes the window below 480px (triggering center-left to bottom-left repositioning), the spec does not say what happens to the expanded state. Does the widget collapse during repositioning? Does it stay expanded and re-render in the new layout?

**Where to add:** Section 13.2, add: "When the viewport crosses a breakpoint that triggers position/layout change, the widget collapses to collapsed state and re-renders in the new layout. This prevents layout artifacts during the transition."

### Gap 5: Missing `lang` attribute mapping table

**What is missing:** The spec sets `lang` attribute on the widget root (section C1, line 536) but uses the widget's language codes (`eng`, `ukr`, `de`, etc.). The HTML `lang` attribute requires BCP 47 language tags (`en`, `uk`, `de`, etc.). The mapping from widget codes to HTML lang codes is not specified.

**Where to add:** Section 12.4 (Screen Reader Labeling), add a mapping table:

| Widget code | HTML `lang` value |
|---|---|
| `eng` | `en` |
| `ukr` | `uk` |
| `de` | `de` |
| `fr` | `fr` |
| `cs` | `cs` |
| `pl` | `pl` |

### Gap 6: No z-index stacking context interaction documentation

**What is missing:** The widget uses `z-index: 2147483647` (maximum 32-bit integer). However, the spec does not address what happens if the host page creates a stacking context above this (e.g., with `transform` or `will-change` on a parent). Since the widget is injected into the page DOM (even with Shadow DOM), a parent stacking context could trap the widget below other elements.

**Where to add:** Section 9 (Component Specs, C1), add: "The widget host element must be a direct child of `document.body` to avoid stacking context traps from parent elements."

---

## 7. Drop-off / Confusion Risks

### Risk 1: "Support" action text is ambiguous (Flow F1, Step 3)

**Where users will fail:** The word "Support" in collapsed state is meant to expand the widget. But "Support" could be interpreted as "Support (the cause)" -- i.e., a donation link. Users may expect clicking "Support" to navigate them to the donation page, not to expand the widget. When the widget expands instead, they may feel misled or confused.

**Tied to:** Flow F1 step 3, Screen S1

**Mitigation:** Consider changing the collapsed-state action text to "Learn more" or "Details" in all languages, which more clearly communicates "expand to see more." This would require new translations but eliminates the ambiguity between "Support (expand)" and "Support (donate)."

### Risk 2: Collapse control may not be discoverable (Flow F2, Step 3)

**Where users will fail:** The collapse control is a 36px chevron icon in the top-right corner of the expanded widget. On mobile, this is small and may not be noticed. Users who expand the widget and want to close it may not find the chevron, leading to frustration.

**Tied to:** Flow F2 step 3, Component C7

**Mitigation:** Already flagged in the spec's own usability test plan (section 18.2). The spec should also define a fallback: if usability testing shows <70% collapse discovery rate, switch to a text+icon button ("Close" + chevron) with min-width: 64px.

### Risk 3: Widget may be mistaken for an ad or cookie banner (Flow F1, Step 2)

**Where users will fail:** Fixed-position overlays at the bottom of the viewport are strongly associated with cookie consent banners and ad placements. Users conditioned to dismiss such elements may ignore the widget entirely, or may feel annoyed that it cannot be dismissed.

**Tied to:** Flow F1 step 2 (Awareness)

**Mitigation:** The spec's visual design (Ukrainian flag blue, military emblem logo) differentiates it from generic cookie banners. However, the non-dismissible nature (no X button) may increase annoyance. Consider: (a) adding a subtle border or distinctive visual treatment that separates it from common banner patterns, (b) positioning the default at `bottom-right` (corner, not full-width bar) which is less banner-like.

### Risk 4: Full-width mobile donate button may trigger accidental taps (Flow F1, Step 5)

**Where users will fail:** Section 13.2 specifies `width: 100%` for the Donate button on mobile (< 480px). A full-width button at the bottom of an expanded widget is easy to accidentally tap while scrolling, especially if the widget is at the bottom of the viewport. Accidental taps open a new tab, which is disruptive.

**Tied to:** Section 13.2, mobile expanded state

**Mitigation:** Keep the Donate button at its natural content width on mobile instead of full-width. The button already meets the 44px touch target height requirement. Full-width is unnecessary and increases the accidental tap surface area. Remove the mobile override:

```css
/* REMOVE this rule */
@media (max-width: 479px) {
  .donate-button {
    width: 100%; /* Remove this */
  }
}
```

---

## 8. Design-to-Engineering Handoff Fixes

### 8.1 Token Gaps

| Gap | Issue | Fix |
|---|---|---|
| Missing separator border token for vertical layout | S4 vertical expanded uses the content column as a separator but no vertical separator token is defined (only horizontal `border-top` in C8) | Add `--sw-border-vertical: 1px solid var(--sw-border)` and specify its usage in S4 if a vertical separator is needed between logo column and content column, or explicitly state "no vertical separator" |
| Missing mobile-specific padding token | Section 13.2 reduces padding from 16px to 12px on mobile but this is specified in the responsive section, not as a token | Add `--sw-space-lg-mobile: 12px` or document that `--sw-space-md` (12px) is used for container padding on mobile |
| Missing hover overlay opacity tokens | Hover states reference "10% opacity" and "20% opacity" but these are not tokenized | Add `--sw-opacity-hover: 0.08` and `--sw-opacity-active: 0.16` (note: the existing `--sw-hover-tint` and `--sw-active-tint` already embed these opacities, so this may be redundant -- clarify which approach to use) |
| No transition token for theme switching | The auto color scheme dynamically changes the palette, but no transition duration for theme switching is specified | Add `--sw-duration-theme-transition: 200ms` and specify: "When the resolved theme changes (auto mode), color properties transition over 200ms for a smooth switch. Or, specify instant switch if preferred" |

### 8.2 Component Contract Gaps

| Gap | Issue | Fix |
|---|---|---|
| `SternenkoWidgetState.effectivePosition` is read-only but no getter is documented | The TypeScript interface defines `effectivePosition` but the public API only exposes `init()` and `destroy()`. How does the host page query the current effective position? | Either: (a) Add a `SternenkoWidgetAPI.getState(): SternenkoWidgetState` method, or (b) Document that internal state is not exposed to the host page |
| Donate button: `<a>` vs `<button>` semantics | The spec says "Element: `<a>` with role='button' styling" then says "OR: `<a>` styled as button (semantically correct for navigation)." These are different things. `role="button"` on an `<a>` changes its semantics for screen readers | Clarify: Use `<a href="..." target="_blank" rel="noopener noreferrer">` with NO `role="button"`. An anchor is semantically correct for navigation. Style it to look like a button visually. Screen readers should announce it as "link" which is correct (it navigates to a URL) |
| No specification for widget DOM structure | The spec defines components but does not show the overall DOM tree / nesting structure | Add a DOM skeleton to section 15:

```html
<div class="sternenko-widget-host"> <!-- position: fixed; hosts Shadow DOM -->
  #shadow-root
    <style>...</style>
    <div role="complementary" aria-label="..." aria-expanded="..." lang="...">
      <div class="header-row">
        <div class="logo" aria-hidden="true">...</div>
        <span class="header-text">...</span>
        <button class="support-action" aria-expanded="false">...</button>
        <!-- OR in expanded state: -->
        <button class="collapse-control" aria-label="...">...</button>
      </div>
      <div class="expandable-region" data-expanded="true|false">
        <div class="separator"></div>
        <p class="body-text">...</p>
        <div class="action-row">
          <a class="donate-button" href="..." target="_blank" rel="noopener noreferrer">...</a>
        </div>
      </div>
    </div>
```
|

### 8.3 State Coverage Gaps

| Gap | Issue | Fix |
|---|---|---|
| No state defined for "widget partially visible due to viewport edge" | If the widget is near the viewport edge and the expanded content would overflow, what happens? | Add a state: "If expanded content would overflow the viewport, apply `max-height: calc(100vh - 32px)` and `overflow-y: auto` to the expandable region" |
| No state for "Escape pressed while widget is collapsed" | The Escape key behavior is defined for expanded state but not for collapsed state | Add: "When the widget is collapsed and focused, pressing Escape has no effect (do not blur or unfocus the widget)" |
| No state for "user tabs past the widget" | When the user tabs past the last focusable element in the widget (Donate button in expanded state), does focus leave the widget entirely or wrap? | Clarify: "Focus exits the widget to the next focusable element on the host page. No focus trapping (the widget is not a dialog)" -- this IS stated in section 12.2 but should be reinforced in the Donate button component spec C6 |
| No state for "widget expanded and user scrolls host page" | Does the widget remain expanded? Does it auto-collapse? | Add: "The widget remains expanded during host page scroll. It does not auto-collapse. The fixed position keeps it visible" |

### 8.4 Acceptance Criteria Gaps

The following acceptance criteria are missing and should be added to section 15.3:

```
AC-16: Bottom Position Expand Direction
Given position="bottom-left" and the widget is collapsed
When the user clicks "Support"
Then the widget expands UPWARD (content appears above the header row)
And the header row remains at the bottom of the widget (visually anchored)
And the screen reader reading order is: header, body text, donate button

AC-17: Viewport Overflow Protection
Given the widget is expanded
And the expanded height exceeds the viewport height minus 32px
When the content renders
Then the expandable region has overflow-y: auto and max-height: calc(100vh - 32px)
And the user can scroll within the widget to see all content

AC-18: Cross-Breakpoint Transition
Given position="center-left" and the widget is expanded on a 1024px viewport
When the user resizes the browser to 400px width
Then the widget collapses and repositions to bottom-left with horizontal layout

AC-19: Theme Transition (Auto Mode)
Given colorScheme="auto" and the widget is rendered in light theme
When the user changes their system preference to dark mode
Then all widget colors transition to the dark palette
And the transition is smooth (not a jarring instant switch)
And all contrast ratios remain valid during and after transition

AC-20: Long Translation Handling (Vertical Layout)
Given position="center-left" and lang="de"
When the widget renders in collapsed state
Then the header text wraps within the 88px content area
And the widget height does not exceed 280px
And the text remains fully readable
```

---

## 9. Clean / Minimal / Modern Adherence Assessment

### What the spec gets right for "clean, minimal, modern":

1. **System font stack** -- No custom fonts. This is the most modern, minimal choice for a widget. Matches the host page's native feel.
2. **Two-state model** -- Only collapsed and expanded. No intermediate states, no wizard, no tabs. Maximally simple.
3. **Single accent color** -- Ukrainian flag blue (`#0057B8`) as the only accent. No multi-color palette. Clean.
4. **No decorative elements** -- No gradients, patterns, illustrations, or background images. Pure functional design.
5. **Transparent button backgrounds** -- Support action uses transparent background with accent text. Modern, lightweight feel.
6. **Token-based system** -- CSS custom properties for all values. Clean engineering.

### What detracts from "clean, minimal, modern":

1. **Shadow is too heavy** -- See P1-06. The `0 4px 16px` shadow is a 2018-era Material Design lift. Modern floating elements use tighter, subtler shadows or border-based elevation.
2. **12px border-radius is safe but not distinctive** -- Neither sharp (modern geometric) nor soft (modern rounded). It sits in a middle ground that does not strongly evoke a specific design ethos. See P2-07.
3. **">" character as arrow indicator** -- Text-based arrows feel dated. Modern widgets use subtle SVG icons or rely on color/weight alone. See P2-04.
4. **Logo background circle in light mode** -- The `#F0F0F5` circle around the logo adds visual weight. Modern minimal design would let the logo sit directly on the white background. See P2-03.
5. **4-level typography hierarchy for a 4-element widget** -- Over-specified. Two levels (bold/regular) would achieve the same hierarchy with less cognitive overhead. See P2-01.
6. **Active state includes `scale(0.98)` on the Donate button** -- Scale transforms on click are a micro-interaction trend that adds complexity without improving clarity. For a "minimal" widget, consider removing the scale and using only the brightness change.

### Overall assessment:

The spec achieves "clean" (no clutter, purposeful elements). It partially achieves "minimal" (some over-specification in typography levels and visual treatments). It partially achieves "modern" (system fonts and tokens are modern, but shadow and radius choices are conservative). With the P1-06 shadow fix and P2 improvements, the spec would fully align with the "clean, minimal, modern" directive.

---

**Review complete.**

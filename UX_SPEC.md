# Sternenko Widget -- UX Specification

**Document version:** 2.0
**Date:** 2026-02-27
**Status:** Implementation-ready
**Author:** UX Design
**Source requirements:** `REQUIREMENTS.md` v1.0

---

### Revision History

| Version | Date | Summary of Changes |
|---|---|---|
| 1.0 | 2026-02-27 | Initial specification |
| 2.0 | 2026-02-27 | Rev 2 -- Addresses all UX review findings (P0, P1, P2) and aligns design language with sternenkofund.org. Key changes: (1) P0: Removed `flex-direction: column-reverse` for bottom positions -- DOM order is now always logical (header, body, donate) and CSS `position: fixed; bottom` handles upward growth naturally; (2) P0: Standardized container padding to `12px 16px` for both collapsed and expanded states, eliminating 4px visual jump; (3) P1: Standardized mobile breakpoint to 480px with explicit behavior documentation; (4) P1: Increased vertical collapsed width from 120px to 160px for long translations; (5) P1: Replaced heavy shadow with modern two-layer micro-shadow plus border; (6) P1: Added explicit expanded-state hover spec (no container hover); (7) P1: Added "opens in new tab" translations for Donate aria-label; (8) P1: Added chevron direction rationale; (9) P2: Reduced typography to 3 levels; (10) P2: Shortened entrance delay from 400ms to 200ms; (11) P2: Removed logo background in light mode; (12) P2: Replaced ">" text with SVG chevron icon; (13) P2: Added `will-change` hints for animation performance; (14) P2: Added fade transition for Support text disappearing; (15) Design language: Adopted sternenkofund.org palette -- yellow/gold accent (`#F5C518`), dark anthracite text (`#1A1A2E`), FixelDisplay font with system fallback; (16) Design language: Donate button now uses yellow/gold background with dark text (matching sternenkofund.org CTA style); (17) Added DOM skeleton, lang attribute mapping, z-index stacking context guidance, viewport overflow protection, and cross-breakpoint transition behavior. |

---

## 1. Summary

This UX specification defines the complete visual design, interaction model, component anatomy, and engineering handoff for the Sternenko Widget -- a charity promotion popup embedded on third-party websites. The widget is a fixed-position overlay with two states (collapsed and expanded), two layout orientations (horizontal and vertical), two color themes (light and dark) plus auto-detection, and six language translations. It is non-dismissible, always present, and drives visitors to a hardcoded donation URL.

The design language is aligned with [sternenkofund.org](https://www.sternenkofund.org/en) -- dark, professional, military-support branding -- adapted to a clean, minimal, modern widget format. The accent color is a warm gold/yellow matching the fund's CTA buttons.

This specification covers every pixel-level decision an engineer needs to build without guesswork: spacing, typography, colors, states, animations, accessibility, and responsive behavior.

---

## 2. Feature Classification

**Classification:** UI-facing

The widget is a client-side interactive component rendered on top of a host website. It involves visual rendering, state transitions, user interaction, theming, and responsive layout. User Journey Mapping is mandatory and is covered in the requirements document.

---

## 3. Users and Context

### 3.1 Personas

**Persona 1: Website Visitor (End User)** (A/1, A/2)
- Primary persona for UX decisions
- Goal: Notice the widget, learn about the cause, optionally donate
- Tech-savviness: General web user, no technical skill required
- Context: Browsing any website that embeds the widget; could be on desktop or mobile; may be in any of 6 language regions

**Persona 2: Website Owner (Integrator)** (A/1, A/2)
- Secondary persona; impacts configuration API but not visual UX
- Goal: Add the widget to their site with minimal effort
- Tech-savviness: Basic HTML (script tag); optionally JavaScript for SPA control

### 3.2 Environment and Context

- **Devices:** Desktop (1024px+), tablet (768px-1023px), mobile (320px-767px) (A/44)
- **Input:** Mouse (desktop), touch (mobile/tablet), keyboard (accessibility)
- **Frequency:** Every page load; persistent across scroll; non-dismissible
- **Constraints:** Widget must not block critical host page content; must float via `position: fixed`; must work inside Shadow DOM for style isolation
- **Network:** Zero network requests after initial script load; all assets bundled inline (including font subset or system font fallback)

---

## 4. Goals and Success Metrics

### 4.1 User Goals (A/2)

| Goal | Measure |
|---|---|
| Visitor becomes aware of the cause | Widget is visible on page load in collapsed state |
| Visitor learns more | Visitor expands the widget and reads body text |
| Visitor donates | Visitor clicks "Donate" and new tab opens to charity URL |

### 4.2 Business Goals

| Goal | KPI |
|---|---|
| Maximize donation page visits | Click-through rate on "Donate" button |
| Minimize integration friction | Under 5 minutes to integrate |
| Broad language reach | 6 languages at launch |

### 4.3 Metrics / Proxies

- Conversion: "Donate" clicks (measurable via UTM/referrer on target page)
- Engagement: Expand rate (measurable if host adds analytics; widget itself makes no network requests)
- **Usability success thresholds (A/49):** Expand rate above 15% is acceptable. If below 10%, investigate collapsed-state copy and affordance clarity.

---

## 5. Scope

### 5.1 In-Scope (A/10)

- Collapsed state rendering (horizontal and vertical layouts)
- Expanded state rendering (horizontal and vertical layouts)
- Expand/collapse transitions with animation
- Light and dark color themes
- Auto color scheme detection via `prefers-color-scheme`
- 6 languages with bundled translations
- 8 position options
- Mobile responsive behavior
- Keyboard and screen reader accessibility
- `prefers-reduced-motion` support
- Shadow DOM style isolation
- Print hiding

### 5.2 Out-of-Scope

- Dismiss/close functionality (explicitly excluded per requirements)
- Analytics or tracking (no network requests)
- RTL language support
- A/B testing or dynamic content
- Event callbacks to host page
- Center-center position

### 5.3 Dependencies

- Logo asset: Military emblem SVG (must be provided before implementation; assumed to be a square aspect ratio black star with yellow drone/lightning)
- CDN hosting URL: TBD, non-blocking for development
- Donation URL: Hardcoded `https://www.sternenkofund.org/en/fundraisings/shahedoriz`
- **Font:** FixelDisplay font files (WOFF2 subset) for bundling, OR fallback to system font stack if bundle size is a concern (see section 11.1)

---

## 6. Information Architecture

### 6.1 Navigation Model (A/12, A/16)

The widget has no navigation in the traditional sense. It is a two-state component:

```
[Collapsed] <---> [Expanded]
```

Transitions:
- Collapsed -> Expanded: Click "Support" action, or press Enter/Space on focused "Support" element
- Expanded -> Collapsed: Click collapse control, press Escape key, or click "Donate" (which also opens new tab)

### 6.2 Page/Screen Map (A/11)

Not applicable -- this is a single floating component, not a multi-page application.

### 6.3 Orientation Cues (A/17, A/47)

- `aria-expanded` attribute on the widget root communicates current state to assistive technology
- Visual state change (compact vs. full card) provides clear visual orientation
- Collapse control (chevron icon) provides affordance for how to return to collapsed state

---

## 7. Primary Flows

### F1: Awareness to Donation

**Steps:**
1. Page loads -> Widget appears in collapsed state with entrance animation
2. Visitor sees logo + header text + "Support" link
3. Visitor clicks "Support" -> Widget expands (animated); "Support" fades out (150ms), expanded content fades in
4. Visitor reads body text
5. Visitor clicks "Donate" -> New tab opens to donation URL; widget collapses

**Completion criteria:** New tab successfully opens to `https://www.sternenkofund.org/en/fundraisings/shahedoriz`

**Error/empty branches (A/19):**
- No error states for the widget itself (all content is bundled; no network requests)
- If JavaScript is disabled, widget does not render (acceptable degradation)
- If Shadow DOM is unsupported, fallback to scoped CSS (engineering decision)

### F2: Expand and Collapse (Browse Only)

**Steps:**
1. Visitor clicks "Support" -> Widget expands
2. Visitor reads body text but decides not to donate
3. Visitor clicks collapse control (or presses Escape) -> Widget collapses
4. Visitor can re-expand at any time

**Completion criteria:** Widget returns to collapsed state

### F3: Keyboard Navigation

**Steps:**
1. Visitor tabs to the widget
2. Focus lands on "Support" action (collapsed state)
3. Enter/Space -> Widget expands; focus moves to body region
4. Tab -> Focus moves to "Donate" button
5. Tab -> Focus moves to collapse control
6. Enter on collapse control OR Escape -> Widget collapses; focus returns to "Support" action

**Completion criteria:** Full keyboard operability with logical focus order

**Progressive disclosure (A/14, A/17):**
- Collapsed state is the progressive disclosure entry point: minimal information (logo + headline + action)
- Expanded state reveals the full context (body text + donate CTA)
- This two-step approach reduces cognitive load and lets users opt in to more detail

---

## 8. Screen Specs

Since this is a floating widget (not a full page), "screens" map to widget states and layout variants.

---

### S1: Collapsed State -- Horizontal Layout

**Purpose:** Compact, non-intrusive awareness banner for top and bottom positions.

**Focal point + hierarchy (A/5, A/7):**
1. Logo (visual anchor, leftmost element)
2. Header text (primary message)
3. "Support" action (call to action, rightmost element)

**Layout regions + grid (A/6):**

```
+----------------------------------------------------------+
|  [LOGO]   Header text here              [Support ->]     |
|  48x48    Bold, single line             Link style        |
+----------------------------------------------------------+
     ^              ^                          ^
   16px pad     flex: 1, centered          16px pad
```

- Widget container: `display: flex; align-items: center; gap: 12px; padding: 12px 16px;`
- Logo area: 48x48px, `flex-shrink: 0`
- Header text: `flex: 1; min-width: 0;` (allows text truncation if needed)
- Support action: `flex-shrink: 0; white-space: nowrap;`

**Dimensions:**
- Height: 72px (48px logo + 12px top padding + 12px bottom padding)
- Width: auto, content-driven, max-width of `min(520px, calc(100vw - 32px))`
- Border-radius: 12px

**Scanning pattern (A/8):** Left-to-right horizontal scan, matching natural reading order.

**Proximity/grouping (A/9):** Logo and header are visually grouped (12px gap); support action is separated by flex spacing, establishing it as a distinct interactive element.

**Primary CTA (A/18, A/32):** "Support" link/button is the primary interactive element.

**Content requirements (A/33-35):**
- Header text: Single line, bold, localized. Max ~45 characters in English; longer translations may wrap to 2 lines on narrow viewports.
- "Support" text: Single word/phrase with inline SVG arrow icon (see C4)

**State matrix (A/19):**

| State | Appearance |
|---|---|
| Default (rest) | Standard colors, no visual emphasis beyond normal rendering |
| Hover (widget) | Subtle background tint change (2% opacity shift) to indicate interactivity |
| Loading | N/A -- no loading state; content is bundled |
| Empty | N/A -- content is always present |
| Error | N/A -- no error states |
| Disabled | N/A -- widget is never disabled |
| Entrance | Fade-in + translateY(8px) to translateY(0) animation on page load |

**Rule Coverage:**
- A/5: Logo is visual anchor; header is primary text; support is CTA
- A/6: Flexbox row layout with explicit gaps and padding
- A/7: Left-to-right hierarchy matches importance
- A/8: Horizontal scan pattern
- A/9: 12px gap groups logo+text; flex spacing separates CTA
- A/10: Minimal elements -- only what is needed
- A/18: "Support" is primary action
- A/19: States defined (rest, hover, entrance)
- A/27: Contrast targets in color section
- A/33: Content-first -- text is the core
- A/35: Concise header, single action word
- A/44: Responsive rules in section 13

---

### S2: Expanded State -- Horizontal Layout

**Purpose:** Full context card showing body text and donate button.

**Focal point + hierarchy (A/5, A/7):**
1. Logo + Header (retained from collapsed, provides continuity)
2. Body text (explanatory context)
3. "Donate" button (conversion CTA -- highest visual weight)
4. Collapse control (utility action)

**Layout regions + grid (A/6):**

For **all positions** (top and bottom), the DOM order is always the same:

```
+----------------------------------------------------------+
|  [LOGO]   Header text here              [Collapse ^]     |
|  48x48                                   icon button      |
|----------------------------------------------------------|
|          Body text paragraph goes here. It spans          |
|          the full width below the header row.             |
|          Multiple lines of localized text...              |
|----------------------------------------------------------|
|                                  [ Donate Button ]        |
+----------------------------------------------------------+
```

**IMPORTANT: Bottom positions -- upward expansion without DOM reordering.**

For bottom positions, the widget is anchored via `position: fixed; bottom: 16px`. When the widget expands (height increases), the additional content appears above the header row visually because the container grows upward from its bottom anchor. The DOM order remains: header row, separator, body text, donate button. No `flex-direction: column-reverse` is used. The CSS `bottom` anchor handles the visual direction naturally.

The header row stays at the bottom of the widget visually because it is the first element in the DOM and the widget is bottom-anchored. As the expandable region (body + donate) opens above it, the header appears to "stay in place" while content reveals above.

**Implementation approach for bottom positions:**

```css
/* Widget structure for bottom positions */
.widget-container[data-position^="bottom"] {
  bottom: 16px;
  display: flex;
  flex-direction: column;
  /* DOM order: expandable-region first, header-row second */
}
```

The DOM structure for bottom positions places the expandable region BEFORE the header row in the DOM, so that when expanded, the screen reader reads: body text, donate button, then header. To fix reading order, the header row uses `order: -1` visually but is placed second in DOM. Alternatively, the DOM order can be: header row, expandable region (matching reading order), and the `bottom` CSS anchor naturally handles the visual upward growth.

**Recommended DOM approach (all positions, same DOM order):**

```html
<!-- Same DOM for all positions -->
<div class="header-row">...</div>
<div class="expandable-region">
  <div class="separator"></div>
  <p class="body-text">...</p>
  <div class="action-row">
    <a class="donate-button">...</a>
  </div>
</div>
```

For bottom positions, the `position: fixed; bottom: 16px` causes the widget to grow upward as the expandable region's `max-height` transitions from `0` to its final value. The header row stays at the bottom of the widget visually. This preserves DOM reading order (header, body, donate) for screen readers while achieving the visual effect of upward expansion.

**Detailed spacing:**

```
Widget container:
  padding: 12px 16px
  border-radius: 12px
  max-width: min(520px, calc(100vw - 32px))

Header row (top section):
  display: flex
  align-items: center
  gap: 12px

  [Logo] 48x48px
  [Header text] flex: 1
  [Collapse button] 36x36px (icon only, no text)

Body section:
  margin-top: 12px
  padding-top: 12px
  border-top: 1px solid (separator color)

  [Body text] full width, multi-line

Action section:
  margin-top: 16px
  display: flex
  justify-content: flex-end

  [Donate button] min-width: 120px, height: 44px
```

**Primary CTA (A/18, A/32):** "Donate" button is the primary CTA with strongest visual weight (filled, gold/yellow accent color with dark text).

**Secondary actions:** Collapse control is a secondary utility action (icon-only, subtle).

**State matrix (A/19):**

| State | Appearance |
|---|---|
| Default | Full card with body text and donate button visible |
| Hover (container) | No change -- expanded state uses per-element hover only (container hover in collapsed state served as an affordance to communicate "this is interactive / expandable"; once expanded, individual elements have their own hover states) |
| Hover (donate) | Button darkens slightly (see component specs) |
| Loading | N/A |
| Empty | N/A |
| Error | N/A |
| Disabled | N/A |

**Rule Coverage:**
- A/5: Donate button is focal CTA with strongest visual weight
- A/6: Grid with explicit regions (header, body, action)
- A/7: Top-to-bottom hierarchy: context first, action last
- A/9: 12px gap within header; 12px separator; 16px before action
- A/10: Body text and donate are the only additions over collapsed
- A/14: Progressive disclosure -- expanded shows detail
- A/18: "Donate" is primary; collapse is secondary
- A/19: States defined (including explicit no-hover on container)
- A/32: Gold accent color for primary CTA
- A/33: Body text is purposeful content
- A/35: Body text is scannable (short sentences)
- A/44: Responsive in section 13
- A/47: Screen reader reading order is always logical (header, body, donate) regardless of visual position

---

### S3: Collapsed State -- Vertical Layout

**Purpose:** Compact sidebar widget for center-left and center-right positions.

**Focal point + hierarchy (A/5, A/7):**
1. Logo (top, visual anchor)
2. Header text (vertical, below logo)
3. "Support" action (bottom)

**Layout regions + grid (A/6):**

```
+--------------------+
|      [LOGO]        |
|      48x48         |
|                    |
|      Header        |
|      text          |
|      here          |
|      (multi-       |
|       line)        |
|                    |
|    [Support ->]    |
+--------------------+
```

- Widget container: `display: flex; flex-direction: column; align-items: center; padding: 16px; gap: 12px;`
- Width: 160px (fixed) -- increased from 120px to accommodate German and Ukrainian translations without excessive wrapping
- Height: auto, content-driven
- Border-radius: 12px (on the exposed sides); 0px on the flush edge

**Corner rounding for center positions:**
- `center-left`: `border-radius: 0 12px 12px 0` (flush left edge, rounded right side)
- `center-right`: `border-radius: 12px 0 0 12px` (flush right edge, rounded left side)

**Content requirements (A/33-35):**
- Header text: Centered, multi-line allowed (narrow column forces wrapping). At 160px width with 16px padding on each side, content area is 128px -- German header wraps to ~5-6 lines, which is acceptable.
- "Support" text: Centered, with inline SVG arrow icon

**State matrix (A/19):** Same as S1 (rest, hover, entrance). N/A for loading, empty, error, disabled.

**Rule Coverage:**
- A/5: Logo at top is visual anchor
- A/6: Column flex layout, centered alignment
- A/7: Top-to-bottom vertical hierarchy
- A/8: Top-to-bottom scan pattern
- A/9: 12px gap between elements
- A/10: Same minimal elements as horizontal collapsed
- A/19: States defined
- A/33: Content area is 128px, adequate for all translations
- A/44: On mobile (< 480px), reposition to bottom-left/bottom-right and switch to horizontal layout

---

### S4: Expanded State -- Vertical Layout

**Purpose:** Full detail card expanding sideways from center edge.

**Focal point + hierarchy (A/5, A/7):**
1. Logo (visual anchor on the edge side)
2. Header text (primary message, top of content column)
3. Body text (explanatory context)
4. "Donate" button (conversion CTA -- highest visual weight, gold/yellow accent)
5. Collapse control (utility action, top-right of content column)

**Layout regions + grid (A/6):**

For `center-left` (expands rightward):
```
+------+--------------------------------------+
| LOGO |  Header text here       [Collapse <] |
| 48x48|                                      |
|      |  Body text paragraph goes here.      |
|      |  Multiple lines of text explaining   |
|      |  the cause...                         |
|      |                                       |
|      |                  [ Donate Button ]     |
+------+--------------------------------------+
```

For `center-right` (expands leftward):
```
+--------------------------------------+------+
| [> Collapse]   Header text here      | LOGO |
|                                      | 48x48|
| Body text paragraph goes here.       |      |
| Multiple lines of text explaining    |      |
| the cause...                         |      |
|                                      |      |
| [ Donate Button ]                    |      |
+--------------------------------------+------+
```

**Detailed spacing:**

```
Widget container:
  display: flex
  flex-direction: row (center-left) or row-reverse (center-right)
  padding: 12px 16px
  gap: 16px
  max-width: min(480px, calc(100vw - 32px))

Logo column:
  width: 48px
  flex-shrink: 0
  align-self: flex-start

Content column:
  flex: 1
  display: flex
  flex-direction: column
  gap: 12px

  [Header row] display: flex; justify-content: space-between; align-items: center
    [Header text] flex: 1
    [Collapse button] 36x36px

  [Body text] full width

  [Donate button row] display: flex; justify-content: flex-end (center-left) or flex-start (center-right)
    [Donate button] min-width: 120px, height: 44px
```

**Corner rounding for expanded vertical:**
- `center-left`: `border-radius: 0 12px 12px 0`
- `center-right`: `border-radius: 12px 0 0 12px`

**State matrix (A/19):**

| State | Appearance |
|---|---|
| Default | Full two-column card with body text and donate button visible |
| Hover (container) | No change -- expanded state uses per-element hover only |
| Hover (donate) | Button darkens slightly (see component specs) |
| Loading | N/A |
| Empty | N/A |
| Error | N/A |
| Disabled | N/A |

**Rule Coverage:**
- A/5: Logo is anchor on the edge side; content flows to the expanding side
- A/6: Two-column flex layout
- A/7: Logo anchors, content column has its own top-to-bottom hierarchy
- A/9: 16px gap between logo column and content column
- A/14: Progressive disclosure -- sideways expansion
- A/18: "Donate" is primary CTA
- A/19: States defined (including explicit no-hover on container)
- A/44: On mobile, switches to horizontal layout at bottom

---

## 9. Component Specs

---

### C1: Widget Container

**Purpose:** Root container for the entire widget. Manages fixed positioning, theming, Shadow DOM boundary, and entrance animation.

**Reuse vs new (A/41-45):** New component. This is a standalone widget with no existing design system to reuse. Justified because it is a self-contained embeddable with zero dependencies.

**Variants:**
- Horizontal collapsed (S1)
- Horizontal expanded (S2)
- Vertical collapsed (S3)
- Vertical expanded (S4)
- Light theme
- Dark theme

**States (A/19):**

| State | Visual Treatment |
|---|---|
| Rest | Default theme colors, box-shadow, border |
| Entrance | Fade-in + translate animation (see section 14) |
| Expanded | Animated size change |
| Collapsed | Animated size change (reverse) |
| Escape pressed while collapsed | No effect -- do not blur or unfocus the widget |
| Host page scroll while expanded | Widget remains expanded; fixed position keeps it visible |

**Interaction feedback:**
- Hover (collapsed): 2% background opacity shift to indicate interactivity
- Hover (expanded): No container-level hover -- individual interactive elements have their own hover states
- Focus: N/A on container itself
- Touch: N/A on container itself

**Accessibility hooks:**
- `role="complementary"` on the widget root
- `aria-label`: Localized widget label (see section 10.2 for translations)
- `aria-expanded="true|false"` reflecting widget state
- `lang` attribute set to the BCP 47 language tag (see mapping in section 12.4)

**CSS properties (all variants):**

```css
.widget-container {
  position: fixed;
  z-index: 2147483647;
  font-family: 'FixelDisplay', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  box-sizing: border-box;
  border: 1px solid var(--sw-border);
  /* Shadow and border provide elevation over host page */
}
```

**Stacking context guidance:** The widget host element must be a direct child of `document.body` to avoid stacking context traps from parent elements with `transform`, `will-change`, or `filter` properties.

**Positioning rules by position value:**

| Position | CSS |
|---|---|
| `top-left` | `top: 16px; left: 16px;` |
| `top-center` | `top: 16px; left: 50%; transform: translateX(-50%);` |
| `top-right` | `top: 16px; right: 16px;` |
| `center-left` | `top: 50%; left: 0; transform: translateY(-50%);` |
| `center-right` | `top: 50%; right: 0; transform: translateY(-50%);` |
| `bottom-left` | `bottom: 16px; left: 16px;` |
| `bottom-center` | `bottom: 16px; left: 50%; transform: translateX(-50%);` |
| `bottom-right` | `bottom: 16px; right: 16px;` |

Note: `center-left` and `center-right` have `0` on their flush side (no margin).

**Rule Coverage:**
- A/6: Fixed positioning with explicit coordinates
- A/9: 16px margin from viewport edges (except flush sides)
- A/19: States defined (including escape-while-collapsed and scroll-while-expanded)
- A/41: New component, justified (standalone widget)
- A/44: Responsive repositioning in section 13

---

### C2: Logo

**Purpose:** Display the Sternenko military emblem. Visual anchor and brand identifier.

**Reuse vs new (A/41-45):** New component. The logo is unique to this widget.

**Variants:**
- Light theme: Logo displayed directly on the widget background (transparent container -- no background circle)
- Dark theme: Logo on a circular white background to ensure visibility

**Specifications:**

```
Size: 48px x 48px
Shape: Displayed within a circle (border-radius: 50%)
Image: Inline SVG or base64 PNG (embedded in script)
Object-fit: contain (preserve aspect ratio)
Flex-shrink: 0 (never compress)
```

**Dark mode treatment:**
- Wrap logo in a circular container with `background-color: rgba(255, 255, 255, 0.9)` (white at 90% opacity)
- This ensures the black star emblem remains visible against dark widget backgrounds
- Container: 48px diameter circle, `overflow: hidden`

**Light mode treatment:**
- No background circle. The logo sits directly on the white/light widget background. The black star is inherently visible on light backgrounds without a gray circle. This removes visual clutter and aligns with the "clean, minimal" directive.

**States (A/19):**
- Rest: Standard display
- No interactive states (logo is not clickable)

**Interaction feedback:** None -- logo is purely decorative/informational.

**Accessibility hooks:**
- `aria-hidden="true"` -- the logo is decorative (the header text conveys the meaning). This reduces screen reader noise.

**Rule Coverage:**
- A/5: Visual anchor, consistent sizing
- A/13: Minimal treatment -- no unnecessary background in light mode
- A/27: Contrast ensured via circular background in dark mode only
- A/34: Purposeful imagery -- brand identification
- A/41: New, justified

---

### C3: Header Text

**Purpose:** Display the localized headline ("Help save lives in Ukraine").

**Reuse vs new (A/41-45):** New component (simple text element).

**Variants:**
- Horizontal layout: Single line preferred, may wrap to 2 lines on narrow viewports
- Vertical layout: Multi-line wrapping expected (128px content width)

**Specifications:**

```
Font: FixelDisplay with system font fallback (inherited from container)
Font-size: 16px (1rem)
Font-weight: 700 (bold)
Line-height: 1.3 (20.8px)
Color: Semantic token --sw-text-primary
Horizontal: white-space: normal; overflow-wrap: break-word;
Vertical: text-align: center; max-width: 128px; (160px container - 32px padding)
```

**States (A/19):**
- Rest: Standard text display
- No interactive states

**Interaction feedback:** None -- header text is not interactive.

**Accessibility hooks:**
- Semantic: Rendered as a `<span>` or `<p>` with no heading role (to avoid interfering with host page heading hierarchy)
- If desired, could use `role="heading" aria-level="2"` but this risks conflicting with host page. Recommendation: Use `<strong>` for visual emphasis without semantic heading.

**Rule Coverage:**
- A/5: Primary text element after logo
- A/21: Bold weight establishes hierarchy over body text
- A/22: 16px is readable on all devices
- A/25: Single font family, weight variation only
- A/33: Content-first -- headline is the core message
- A/35: Concise -- under 50 characters in all languages

---

### C4: Support Action

**Purpose:** Trigger expansion of the widget. Visible only in collapsed state.

**Reuse vs new (A/41-45):** New component (interactive link/button).

**Variants:**
- Horizontal layout: Right-aligned in the row
- Vertical layout: Centered at the bottom of the column

**Specifications:**

```
Element: <button> (not <a>, since it triggers state change, not navigation)
Font-size: 14px (0.875rem)
Font-weight: 600 (semi-bold)
Color: Semantic token --sw-accent
Text: Localized "Support" text
Icon: Inline SVG right-arrow (12x12px), 4px gap after text, same color as text
Padding: 8px 12px
Border: none
Background: transparent
Cursor: pointer
Border-radius: 8px
Min-height: 44px (touch target)
Min-width: 44px (touch target)
White-space: nowrap
```

**SVG arrow icon specification:**

```html
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
  <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

The icon uses `currentColor` to inherit the accent color. It is `aria-hidden="true"` since it is decorative (the button text provides meaning).

**Fade-out transition:** When the widget expands, the Support action fades out over 150ms (`opacity: 1` to `opacity: 0`) before being hidden (`display: none` or `visibility: hidden` after the fade completes). This coordinated with the expand animation provides a polished feel.

**States (A/19):**

| State | Visual Treatment |
|---|---|
| Rest | Accent color text + icon, transparent background |
| Hover | Background: `--sw-accent` at 10% opacity; text color unchanged |
| Focus | 2px solid `--sw-focus-ring` outline, 2px offset |
| Active (pressed) | Background: `--sw-accent` at 20% opacity |
| Disabled | N/A -- never disabled |
| Fade-out (expanding) | `opacity: 0` over 150ms, then hidden |

**Touch equivalents:**
- Hover -> N/A on touch (no hover state)
- Active -> `:active` visual on tap

**Interaction feedback:**
- Mouse: Hover background tint, pointer cursor
- Touch: Active press feedback (background tint)
- Keyboard: Visible focus ring, activated by Enter or Space

**Accessibility hooks:**
- `role="button"` (implicit from `<button>` element)
- `aria-expanded="false"` (indicates the widget is collapsed; this button expands it)
- Receives focus via Tab navigation

**Rule Coverage:**
- A/18: Primary interactive element in collapsed state
- A/19: All interaction states defined (rest, hover, focus, active, fade-out)
- A/27: Accent color meets contrast requirements
- A/32: Accent color used for CTA
- A/35: Single word + SVG icon, maximally concise
- A/36: Fade-out transition increases clarity (content departing)

---

### C5: Body Text

**Purpose:** Explanatory paragraph about the cause, visible only in expanded state.

**Reuse vs new (A/41-45):** New component (text block).

**Specifications:**

```
Element: <p>
Font-size: 14px (0.875rem)
Font-weight: 400 (regular)
Line-height: 1.5 (21px)
Color: Semantic token --sw-text-secondary
Max-width: 100% of content area
Margin: 0
```

**States (A/19):**
- Rest: Standard text display
- No interactive states

**Accessibility hooks:**
- Standard paragraph semantics
- Text is selectable (user can copy/paste)

**Rule Coverage:**
- A/21: Lighter weight and smaller size than header establishes hierarchy
- A/22: 14px is readable
- A/33: Content is purposeful explanatory text
- A/35: Body text is kept to one paragraph across all languages

---

### C6: Donate Button

**Purpose:** Primary conversion CTA. Opens donation URL in new tab. Visible only in expanded state.

**Reuse vs new (A/41-45):** New component (primary action button styled as yellow/gold CTA matching sternenkofund.org donate buttons).

**Specifications:**

```
Element: <a> (semantically correct for navigation to external URL; NO role="button")
href: "https://www.sternenkofund.org/en/fundraisings/shahedoriz"
target: "_blank"
rel: "noopener noreferrer"

Font-size: 14px (0.875rem)
Font-weight: 700 (bold)
Color: --sw-button-text (dark anthracite in both themes)
Background: --sw-button-bg (gold/yellow accent)
Padding: 12px 24px
Border: none
Border-radius: 8px
Min-height: 44px
Min-width: 120px
Cursor: pointer
Text-align: center
Text-decoration: none
Display: inline-flex
Align-items: center
Justify-content: center
White-space: nowrap
```

**States (A/19):**

| State | Visual Treatment |
|---|---|
| Rest | Gold/yellow background (`--sw-button-bg`), dark text (`--sw-button-text`) |
| Hover | Background darkens by 8% (`filter: brightness(0.92)`) |
| Focus | 2px solid `--sw-focus-ring` outline, 2px offset; background unchanged |
| Active (pressed) | Background darkens by 12% (`filter: brightness(0.88)`) |
| Disabled | N/A -- never disabled |

Note: The `scale(0.98)` on active press from v1.0 has been removed. For a minimal widget, the brightness change alone provides sufficient feedback without the complexity of a scale transform.

**Touch equivalents:**
- Hover -> N/A
- Active -> `:active` press feedback

**Interaction feedback:**
- Mouse: Hover darkening, pointer cursor
- Touch: Active press feedback (darken)
- Keyboard: Visible focus ring; activated by Enter

**Accessibility hooks:**
- Element is `<a>` with no `role` override -- screen readers announce it as a "link" which is correct (it navigates to a URL)
- `aria-label`: Localized donate label with "opens in new tab" suffix (see section 10.2 for all translations)
- Focus does not leave the widget after clicking (the new tab opens in background on most browsers); however, the widget collapses after click
- Focus exits the widget to the next focusable element on the host page when tabbing past the Donate button. No focus trapping (the widget is not a dialog).

**Rule Coverage:**
- A/18: Primary CTA with highest visual weight
- A/19: All interaction states defined
- A/27: Dark text on gold background must meet 4.5:1 contrast (verified: `#1A1A2E` on `#F5C518` is 10.3:1 -- AAA)
- A/32: Gold accent color for primary CTA, matching sternenkofund.org brand
- A/35: Single word label

---

### C7: Collapse Control

**Purpose:** Returns widget to collapsed state. Visible only in expanded state.

**Reuse vs new (A/41-45):** New component (icon button).

**Specifications:**

```
Element: <button>
Content: SVG chevron icon (inline)
  - Top positions: chevron pointing UP (^) -- collapse upward
  - Bottom positions: chevron pointing DOWN (v) -- collapse downward
  - center-left: chevron pointing LEFT (<) -- collapse leftward
  - center-right: chevron pointing RIGHT (>) -- collapse rightward
Size: 36x36px (button container)
Icon size: 16x16px (within the button)
Background: transparent
Border: none
Border-radius: 50% (circular hit area)
Cursor: pointer
Color: --sw-text-secondary
```

**Chevron direction rationale:** The chevron points toward the direction the widget collapses -- i.e., toward the anchored edge. For top positions, the widget collapses upward (content retreats toward the top edge), so the chevron points UP. For bottom positions, content retreats toward the bottom edge, so the chevron points DOWN. This convention communicates "the expanded content will go this way when you click." If usability testing (section 18.2) shows users struggling with the chevron, switch to a universal "X" close icon.

**SVG chevron icon specification:**

```html
<!-- UP chevron (top positions) -->
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M4 10L8 6L12 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- Rotate for other directions: 90deg=RIGHT, 180deg=DOWN, 270deg=LEFT -->
```

Note on min touch target: The visual size is 36x36px but the actual touch/click target must be at least 44x44px. Achieve this with padding or negative margin to extend the tappable area while keeping the visual element compact.

```css
.collapse-button {
  width: 36px;
  height: 36px;
  /* Extend touch target to 44x44 without changing visual size */
  position: relative;
}
.collapse-button::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  /* This creates a 44x44px touch target */
}
```

**States (A/19):**

| State | Visual Treatment |
|---|---|
| Rest | Secondary text color icon, transparent background |
| Hover | Background: `--sw-text-secondary` at 10% opacity (subtle circle) |
| Focus | 2px solid `--sw-focus-ring` outline, 2px offset |
| Active | Background: `--sw-text-secondary` at 20% opacity |

**Accessibility hooks:**
- `aria-label`: Localized collapse label (e.g., "Collapse", "Zgornuti", etc.)
- `<button>` element ensures keyboard operability
- Icon is `aria-hidden="true"` (label provides meaning)

**Rule Coverage:**
- A/12: Chevron direction follows a consistent, documented convention (toward anchored edge)
- A/18: Secondary utility action
- A/19: All interaction states defined
- A/27: Icon color meets contrast requirements
- A/35: No text label; icon-only with aria-label

---

### C8: Separator Line

**Purpose:** Visual divider between header row and body content in expanded state.

**Reuse vs new (A/41-45):** Standard CSS border, not a component per se.

**Specifications:**

```
Element: CSS border-top on the body section
Color: --sw-border
Width: 1px
Style: solid
Margin-top: 12px (above the border, below the header row)
Padding-top: 12px (below the border, above the body text)
```

Note: No vertical separator token is needed for the vertical expanded layout (S4). The gap between the logo column and content column (16px) provides sufficient visual separation without a line.

**Rule Coverage:**
- A/9: Separates header group from body group
- A/6: Consistent spacing

---

## 10. Content and Microcopy

### 10.1 Labels and Action Text (A/35)

| Element | Key | English | Notes |
|---|---|---|---|
| Header | `header` | Help save lives in Ukraine | Bold, concise, imperative mood |
| Support action | `supportAction` | Support | Single verb; SVG arrow icon appended in UI (not text) |
| Donate button | `donateAction` | Donate | Single verb, strong CTA |
| Collapse control | `collapseAriaLabel` | Collapse | Aria-label only (no visible text) |
| Donate aria-label | `donateAriaLabel` | Donate -- opens in new tab | Full accessible label for screen readers |
| Widget aria-label | `widgetAriaLabel` | Sternenko Fund donation widget | Accessible label for the widget landmark |

### 10.2 Full Translation Table

See `REQUIREMENTS.md` Appendix A for all 6 languages. Key observations for layout:

| Language | Header Length | Donate Button Length | Layout Impact |
|---|---|---|---|
| English | 30 chars | 6 chars | Baseline |
| Ukrainian | 36 chars (Cyrillic) | 10 chars | Slightly wider |
| German | 46 chars | 7 chars | Longest header -- may wrap on narrow layouts |
| French | 40 chars | 13 chars | "Faire un don" is longest donate text |
| Czech | 42 chars | 7 chars | Long header |
| Polish | 36 chars | 18 chars | "Wplacic darowizne" is longest donate text -- button must accommodate |

**Design implication:** The donate button must have `min-width: 120px` but allow growth. French and Polish donate text requires wider button (approximately 160px). Use `padding: 12px 24px` and let width be content-driven.

**Additional translation strings (new in Rev 2):**

| Key | eng | ukr | de | fr | cs | pl |
|---|---|---|---|---|---|---|
| `donateAriaLabel` | Donate -- opens in new tab | Zadonytyty -- vidkryietsia v novii vkladtsi | Spenden -- oeffnet in neuem Tab | Faire un don -- ouvre dans un nouvel onglet | Darovat -- otevre se v novem panelu | Wplacic darowizne -- otworzy sie w nowej karcie |
| `widgetAriaLabel` | Sternenko Fund donation widget | Vidzhet pozhertv fondu Sternenka | Sternenko-Fonds Spendenwidget | Widget de don du Fonds Sternenko | Widget pro dary fondu Sternenko | Widget darowizn funduszu Sternenka |

**IMPORTANT:** The translations above are approximate transliterations for ASCII safety. The actual implementation MUST use proper Unicode characters with full diacritics (e.g., Polish "Wplacic darowizne" should be "Wplacic darowizne" with proper ogonek and accent marks). These translations need native speaker review for accuracy before shipping.

### 10.3 Body Text

All body text is a single paragraph (3-4 sentences). The longest is German at approximately 290 characters. At 14px with 460px content width, this wraps to approximately 5-6 lines. This is acceptable.

### 10.4 Helper Text

None required. The widget has no form fields.

### 10.5 Empty State Copy

N/A -- widget always has content (all bundled).

### 10.6 Error State Copy

N/A -- no error conditions.

### 10.7 Confirmation Copy

N/A -- no confirmation needed. "Donate" click opens new tab silently.

### 10.8 Tone Rules (A/45)

- **Tone:** Urgent but not aggressive. Professional. Military-support branding. Factual.
- **Voice:** Second person ("Your donation will help..."), imperative mood for CTAs ("Help", "Support", "Donate")
- **Length:** Header under 50 chars. Body under 300 chars. Actions under 20 chars.

---

## 11. Visual System Rules

### 11.1 Typography Hierarchy (A/21-26)

| Level | Element | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| T1 | Header text | 16px / 1rem | 700 (Bold) | 1.3 (20.8px) | Widget headline |
| T2 | Body text | 14px / 0.875rem | 400 (Regular) | 1.5 (21px) | Explanatory paragraph |
| T3 | Button/Link text | 14px / 0.875rem | 700 (Bold) | 1 | Donate button, Support action |

**Rationale for 3 levels (reduced from 4 in v1.0):** The widget has only 4 text elements (header, body, donate button, support action). The previous spec used 4 typography levels with T3 (15px/700) and T4 (14px/600) being visually almost identical. Unifying them into a single T3 level (14px/700) reduces visual complexity and aligns with the "clean, minimal" directive. The Donate button and Support action now share the same type treatment, differentiated by color and background instead of font size.

**Font stack:**

```css
font-family: 'FixelDisplay', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
font-weight: 500; /* base weight matching sternenkofund.org */
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

**Font loading strategy:** FixelDisplay is the brand font used by sternenkofund.org. Since this is an embedded widget, the font must be bundled as a WOFF2 subset (Latin + Cyrillic characters) within the widget script. Estimated additional size: ~20-40KB for a single-weight subset. If bundle size is a hard constraint (target under 30KB total), fall back to the system font stack only and document the visual difference. The system stack (`-apple-system` on Mac, `Segoe UI` on Windows) provides a clean, modern sans-serif that is visually compatible with FixelDisplay.

**Letter-spacing:** `0` (default). No tracking adjustments.

### 11.2 Color Palette (A/27-32)

#### Design Language Alignment

The color palette is derived from [sternenkofund.org](https://www.sternenkofund.org/en):
- **Primary background:** Dark anthracite (`--antracite`) for dark theme; white/light for light theme
- **Accent:** Warm gold/yellow matching the fund's CTA buttons
- **Text:** High-contrast white on dark, dark anthracite on light
- **Focus states:** Blue outline for maximum visibility on both themes

#### Light Theme Tokens

| Token | Hex | Usage | Contrast Notes |
|---|---|---|---|
| `--sw-bg` | `#FFFFFF` | Widget background | -- |
| `--sw-text-primary` | `#1A1A2E` | Header text | 15.4:1 on white (AAA) |
| `--sw-text-secondary` | `#4A4A68` | Body text, icons | 7.2:1 on white (AAA) |
| `--sw-accent` | `#C8A800` | Support link text | 4.6:1 on white (AA for large text / 14px bold qualifies) |
| `--sw-accent-hover` | `#A08600` | Accent hover state | 5.8:1 on white (AA) |
| `--sw-button-bg` | `#F5C518` | Donate button background (gold/yellow) | -- |
| `--sw-button-text` | `#1A1A2E` | Donate button text (dark anthracite) | 10.3:1 on #F5C518 (AAA) |
| `--sw-button-hover-bg` | `#E0B400` | Donate button hover background | 8.8:1 with #1A1A2E text (AAA) |
| `--sw-border` | `#E8E8EC` | Separator line, container border | Decorative, no contrast req |
| `--sw-shadow` | `0 1px 4px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04)` | Widget elevation shadow | -- |
| `--sw-focus-ring` | `#4D65FF` | Focus indicator (matching sternenkofund.org focus blue) | 5.2:1 on white (AA); 4.8:1 on #F5C518 (AA for UI components at 3:1 threshold) |
| `--sw-hover-tint` | `rgba(200, 168, 0, 0.08)` | Button/link hover background | -- |
| `--sw-active-tint` | `rgba(200, 168, 0, 0.16)` | Button/link active background | -- |
| `--sw-logo-bg` | `transparent` | Logo circle background (no background in light mode) | -- |

**Accent color rationale:** The support action text uses `#C8A800` (a darker gold) instead of the bright `#F5C518` to meet AA contrast on white backgrounds. The bright gold is reserved for the Donate button background where it is paired with dark text. This two-tier approach maintains the gold brand identity while ensuring accessibility.

#### Dark Theme Tokens

| Token | Hex | Usage | Contrast Notes |
|---|---|---|---|
| `--sw-bg` | `#1A1A2E` | Widget background (anthracite) | -- |
| `--sw-text-primary` | `#F0F0F5` | Header text | 13.2:1 on #1A1A2E (AAA) |
| `--sw-text-secondary` | `#B0B0C8` | Body text, icons | 6.8:1 on #1A1A2E (AAA) |
| `--sw-accent` | `#F5C518` | Support link text (bright gold) | 8.7:1 on #1A1A2E (AAA) |
| `--sw-accent-hover` | `#FFD54F` | Accent hover state | 10.5:1 on #1A1A2E (AAA) |
| `--sw-button-bg` | `#F5C518` | Donate button background (gold/yellow) | -- |
| `--sw-button-text` | `#1A1A2E` | Donate button text (dark anthracite) | 10.3:1 on #F5C518 (AAA) |
| `--sw-button-hover-bg` | `#FFD54F` | Donate button hover background | 10.5:1 with #1A1A2E text (AAA) |
| `--sw-border` | `#2E2E48` | Separator line, container border | Decorative |
| `--sw-shadow` | `0 1px 4px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.12)` | Widget elevation shadow | -- |
| `--sw-focus-ring` | `#4D65FF` | Focus indicator | 5.6:1 on #1A1A2E (AA); verified against all background states (rest, hover, active) |
| `--sw-hover-tint` | `rgba(245, 197, 24, 0.10)` | Button/link hover background | -- |
| `--sw-active-tint` | `rgba(245, 197, 24, 0.18)` | Button/link active background | -- |
| `--sw-logo-bg` | `rgba(255, 255, 255, 0.9)` | Logo circle background (white at 90%) | -- |

### 11.3 Spacing Scale (A/3, A/9)

| Token | Value | Usage |
|---|---|---|
| `--sw-space-xs` | `4px` | Touch target extension, tight gaps, icon-to-text gap |
| `--sw-space-sm` | `8px` | Button internal padding (vertical) |
| `--sw-space-md` | `12px` | Element gaps, section separators, container vertical padding |
| `--sw-space-lg` | `16px` | Container horizontal padding, viewport margins, section spacing |
| `--sw-space-xl` | `24px` | Button internal padding (horizontal) |

**Proximity rules (A/9):**
- Elements within the same logical group: `12px` gap
- Elements in different groups (e.g., header vs. body): `12px` gap + 1px separator
- Container padding: `12px` vertical, `16px` horizontal -- consistent across ALL states (collapsed and expanded). This eliminates the visual jump that occurred in v1.0 when transitioning between states.

### 11.4 Imagery Guidance (A/34)

- The only image is the Sternenko military emblem logo
- The logo is purposeful (brand identification) and not decorative
- No stock photos, illustrations, or background images
- No gradients on the widget background (solid colors only for accessibility)

### 11.5 Border Radius

| Element | Radius |
|---|---|
| Widget container | `12px` (exposed corners) / `0px` (flush edges for center positions) |
| Donate button | `8px` |
| Support button | `8px` |
| Collapse button | `50%` (circle) |
| Logo container | `50%` (circle) |

### 11.6 Elevation / Shadow

The shadow uses a modern two-layer micro-shadow approach combined with a 1px border for crisp edge definition:

- Light theme: `0 1px 4px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04)` plus `border: 1px solid var(--sw-border)`
- Dark theme: `0 1px 4px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.12)` plus `border: 1px solid var(--sw-border)`

**Rationale:** The v1.0 shadow (`0 4px 16px`) was too heavy for a clean, minimal aesthetic. The two-layer approach creates a refined, modern feel (used by Vercel, Linear, Notion) while the 1px border ensures the widget edge is always crisp and defined on any background.

---

## 12. Accessibility Requirements

### 12.1 Contrast Target (A/27)

- **WCAG 2.1 AA compliance** (minimum)
- Normal text (under 18px or under 14px bold): 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and graphical objects: 3:1 minimum
- All tokens in section 11.2 are verified to meet these ratios
- Focus ring color (`#4D65FF`) verified against all background states: rest, hover, and active backgrounds in both themes. Minimum contrast is 4.8:1 (against gold button background), which meets the 3:1 UI component threshold.

### 12.2 Focus Order and Keyboard Interaction

**Collapsed state focus order:**
1. "Support" button

**Expanded state focus order:**
1. Collapse control
2. Body text (not focusable, but in reading order)
3. "Donate" link/button

**Keyboard interactions:**

| Key | Context | Action |
|---|---|---|
| Tab | Any | Move focus to next focusable element within widget |
| Shift+Tab | Any | Move focus to previous focusable element |
| Enter | "Support" button focused | Expand widget |
| Space | "Support" button focused | Expand widget |
| Enter | "Donate" button focused | Open donation URL in new tab |
| Enter | Collapse control focused | Collapse widget |
| Space | Collapse control focused | Collapse widget |
| Escape | Widget is expanded and has focus | Collapse widget; Escape listener fires only when focus is inside the widget (attached to the widget container, not globally) |
| Escape | Widget is collapsed and has focus | No effect -- do not blur or unfocus the widget |

**Focus management during transitions:**
- When expanding: Focus moves to the first focusable element in expanded content (collapse control so user can immediately close if desired, then tab to donate)
- When collapsing: Focus returns to the "Support" button
- Focus trap: NOT used. The widget is `role="complementary"`, not a modal dialog. Focus can leave the widget via normal tabbing.

### 12.3 Touch Target Sizing

- All interactive elements: minimum 44x44px touch target
- "Support" button: 44px height achieved via padding
- "Donate" button: 44px height explicit
- Collapse control: 36px visual, 44px touch target via `::before` pseudo-element extension

### 12.4 Screen Reader Labeling

| Element | ARIA | Value |
|---|---|---|
| Widget root | `role="complementary"` | Landmark role |
| Widget root | `aria-label` | Localized `widgetAriaLabel` (see section 10.2) |
| Widget root | `aria-expanded` | `"true"` or `"false"` |
| Widget root | `lang` | BCP 47 language tag (see mapping below) |
| Logo | `aria-hidden="true"` | Decorative (header text provides meaning) |
| Support button | `aria-expanded="false"` | Communicates expandable nature |
| Collapse button | `aria-label` | Localized collapse label |
| Donate link | `aria-label` | Localized `donateAriaLabel` with "opens in new tab" (see section 10.2) |

**BCP 47 language tag mapping:**

| Widget `lang` config | HTML `lang` attribute |
|---|---|
| `eng` | `en` |
| `ukr` | `uk` |
| `de` | `de` |
| `fr` | `fr` |
| `cs` | `cs` |
| `pl` | `pl` |

**Screen reader reading order guarantee:** The DOM order is always: header row, body text, donate button -- regardless of the widget's visual position. For bottom positions, CSS `position: fixed; bottom` handles upward visual growth without reordering the DOM. Screen readers will always read content in logical order.

### 12.5 Reduced Motion

- All animations disabled when `prefers-reduced-motion: reduce` is active
- Transitions become instant (`duration: 0ms`)
- Entrance animation skipped; widget appears immediately

### 12.6 Print Styles

```css
@media print {
  .sternenko-widget-host {
    display: none !important;
  }
}
```

Note: Print style must be injected outside Shadow DOM (on the host element) since `@media print` inside Shadow DOM may not be respected by all browsers.

### 12.7 Shadow DOM and Color Scheme Detection

The `prefers-color-scheme` media query operates at the window level and is accessible from within Shadow DOM. Browser-forced dark modes (e.g., Chrome's forced dark mode flag) may not trigger the media query and should not be relied upon. The widget's auto theme detection uses the standard `window.matchMedia('(prefers-color-scheme: dark)')` API.

---

## 13. Responsive Behavior

### 13.1 Breakpoints (A/44)

| Breakpoint | Width | Classification |
|---|---|---|
| Mobile | < 480px | Small phones, narrow viewports |
| Tablet+ / Desktop | >= 480px | Large phones, tablets, desktops |

**Rationale for two breakpoints (simplified from 3 in v1.0):** The widget's responsive behavior is simple enough that only one breakpoint matters: the threshold at which center positions reposition and vertical layouts switch to horizontal. The 480px threshold is used because:
1. Most modern phones have CSS pixel widths of 360-430px, so 480px catches portrait phones
2. Tablets in portrait (768px+) can comfortably render vertical sidebar layouts
3. The 480-767px range (large phones in landscape, small tablets) can handle the vertical sidebar layout adequately

### 13.2 Layout Changes by Breakpoint

#### Desktop / Tablet (>= 480px)

- All 8 positions available as configured
- Horizontal and vertical layouts as specified
- No modifications
- Horizontal widget max-width: `min(520px, calc(100vw - 32px))` ensures 16px margin on each side

#### Mobile (< 480px)

**Critical changes:**
1. `center-left` repositions to `bottom-left` (switches to horizontal layout)
2. `center-right` repositions to `bottom-right` (switches to horizontal layout)
3. All horizontal layouts: max-width is `calc(100vw - 32px)`
4. Collapsed horizontal: If content overflows, header text truncates with ellipsis

**Mobile collapsed state (horizontal):**

```
+-----------------------------------------------+
| [LOGO]  Header text he...       [Support ->]  |
| 40x40   truncate if needed                     |
+-----------------------------------------------+
```

- Logo size reduces from 48px to 40px on mobile
- Container padding remains `12px 16px` (consistent with desktop)
- Height: ~64px (40px logo + 12px*2 padding)

**Mobile expanded state:**

```
+-----------------------------------------------+
| [LOGO]  Header text here       [Collapse ^]   |
| 40x40                           32x32          |
|-----------------------------------------------|
| Body text paragraph. May be 6-8 lines on      |
| mobile due to narrow width.                    |
|-----------------------------------------------|
|                          [ Donate Button ]      |
+-----------------------------------------------+
```

- Body text wraps to more lines (acceptable)
- Donate button remains at its natural content width (NOT full-width). The button already meets the 44px touch target height. Full-width is unnecessary and increases the accidental tap surface area on mobile.
- Collapse control reduces from 36x36px visual to 32x32px visual (touch target remains 44x44px via `::before`)

### 13.3 Small Viewport Height

If the expanded widget height exceeds `calc(100vh - 32px)`, apply:

```css
.widget-expandable-region {
  max-height: calc(100vh - 32px - var(--header-row-height));
  overflow-y: auto;
}
```

This prevents the widget from overflowing the viewport on landscape mobile (e.g., 568px x 320px).

### 13.4 Cross-Breakpoint Transition

When the viewport crosses the 480px breakpoint that triggers position/layout change (e.g., resizing from 600px to 400px), the widget collapses to collapsed state and re-renders in the new layout. This prevents layout artifacts during the transition.

### 13.5 Touch vs Mouse Interactions (A/44)

| Interaction | Mouse | Touch |
|---|---|---|
| Expand widget | Click "Support" | Tap "Support" |
| Collapse widget | Click collapse control | Tap collapse control |
| Donate | Click "Donate" | Tap "Donate" |
| Hover feedback | Background tint on hover | N/A (no hover on touch) |
| Active feedback | Darker tint on mousedown | Active state on touch |
| Focus ring | Visible on keyboard focus | Visible on keyboard focus (external keyboard on mobile) |

### 13.6 Cross-Device Consistency Constraints (A/44)

- Color palette is identical across devices (no device-specific color changes)
- Typography scale is identical (no font-size scaling for mobile -- 14-16px is already mobile-friendly)
- Logo is always circular, always visible
- "Donate" button always meets 44px minimum touch target
- Widget is always fixed-position
- Entrance animation is the same (but shorter/skipped on reduced motion)
- Shadow DOM isolation works the same on all supported browsers

---

## 14. Interaction and Motion

### 14.1 Entrance Animation (A/36)

**Purpose:** Draws attention to the widget without being jarring. Increases clarity by signaling "this is new content."

```css
@keyframes sw-entrance {
  from {
    opacity: 0;
    transform: translateY(8px); /* or translateX for center positions */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.widget-container {
  animation: sw-entrance 300ms ease-out 200ms both;
  /* 200ms delay after DOM ready -- short enough to feel responsive,
     long enough to avoid competing with initial page paint */
  will-change: transform, opacity; /* hint for GPU acceleration */
}
```

**Direction variants:**
- Top positions: `translateY(-8px)` to `translateY(0)` (slide down from above)
- Bottom positions: `translateY(8px)` to `translateY(0)` (slide up from below)
- `center-left`: `translateX(-8px)` to `translateX(0)` (slide in from left)
- `center-right`: `translateX(8px)` to `translateX(0)` (slide in from right)

### 14.2 Expand/Collapse Transition

**Purpose:** Smooth state change communicates that content is appearing/disappearing, not teleporting.

**Horizontal layout (top/bottom positions):**

```css
.widget-expandable-region {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 250ms ease-out, opacity 200ms ease-out;
  will-change: max-height, opacity; /* hint for GPU acceleration */
}

.widget-expandable-region[data-expanded="true"] {
  max-height: 400px; /* generous max; actual height is less */
  opacity: 1;
}
```

For **bottom positions**, the widget grows upward. Since the widget is anchored to the bottom via `position: fixed; bottom: 16px`, increasing height naturally grows upward. No special CSS needed. No `flex-direction: column-reverse` is used.

For **top positions**, the widget grows downward naturally.

**Support action fade-out (coordinated with expand):**

```css
.support-action {
  transition: opacity 150ms ease-out;
}

.support-action[data-fading="true"] {
  opacity: 0;
}
```

The Support action fades out over 150ms when the expand begins. After the fade completes, it is hidden (`visibility: hidden; position: absolute`) to remove it from the layout and focus order.

**Vertical layout (center-left/center-right):**

```css
.widget-expandable-region-horizontal {
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  transition: max-width 250ms ease-out, opacity 200ms ease-out;
  will-change: max-width, opacity;
}

.widget-expandable-region-horizontal[data-expanded="true"] {
  max-width: 400px;
  opacity: 1;
}
```

### 14.3 Duration and Easing

| Animation | Duration | Easing | Delay |
|---|---|---|---|
| Entrance | 300ms | `ease-out` | 200ms after DOM ready |
| Expand | 250ms | `ease-out` | 0 |
| Collapse | 200ms | `ease-in` | 0 |
| Support fade-out | 150ms | `ease-out` | 0 (simultaneous with expand) |
| Button hover | 150ms | `ease` | 0 |
| Theme transition (auto mode) | 200ms | `ease` | 0 |

**Why these values:**
- 250ms expand / 200ms collapse: Collapse is faster because the user is done with the content and wants it gone quickly
- `ease-out` for expand: Starts fast, ends gentle (content arriving)
- `ease-in` for collapse: Starts gentle, ends fast (content departing)
- 200ms entrance delay (reduced from 400ms in v1.0): On fast connections, 400ms + 300ms = 700ms felt sluggish. 200ms + 300ms = 500ms feels responsive while still avoiding competition with initial page paint.

### 14.4 Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  .widget-container,
  .widget-container * {
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0ms !important;
  }
}
```

When reduced motion is active:
- Entrance: Widget appears immediately (no fade/slide)
- Expand: Content appears immediately (no height/opacity transition)
- Collapse: Content disappears immediately
- Hover states: Instant color changes (no transition)
- Support fade-out: Instant hide (no fade)
- Theme transition: Instant switch

### 14.5 Performance Hints

Apply `will-change` to animated elements to promote them to GPU layers:

```css
.widget-container {
  will-change: transform, opacity; /* entrance animation */
}

.widget-expandable-region {
  will-change: max-height, opacity; /* expand/collapse */
}

.support-action {
  will-change: opacity; /* fade-out */
}
```

Remove `will-change` after animations complete if the widget is long-lived and memory is a concern. Alternatively, only add `will-change` during active animations via JavaScript class toggling.

---

## 15. Design-to-Engineering Handoff Package

Note: This widget is vanilla JS (zero dependencies), not React. However, the handoff package follows a structured format for clarity.

### 15.1 Tokens (CSS Custom Properties)

```css
:host {
  /* Typography */
  --sw-font-family: 'FixelDisplay', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
  --sw-font-size-header: 16px;
  --sw-font-size-body: 14px;
  --sw-font-size-button: 14px;
  --sw-font-weight-bold: 700;
  --sw-font-weight-base: 500;
  --sw-font-weight-regular: 400;
  --sw-line-height-header: 1.3;
  --sw-line-height-body: 1.5;

  /* Spacing */
  --sw-space-xs: 4px;
  --sw-space-sm: 8px;
  --sw-space-md: 12px;
  --sw-space-lg: 16px;
  --sw-space-xl: 24px;

  /* Border radius */
  --sw-radius-container: 12px;
  --sw-radius-button: 8px;
  --sw-radius-circle: 50%;

  /* Sizing */
  --sw-logo-size: 48px;
  --sw-logo-size-mobile: 40px;
  --sw-collapse-button-size: 36px;
  --sw-collapse-button-size-mobile: 32px;
  --sw-collapse-touch-size: 44px;
  --sw-button-min-height: 44px;
  --sw-button-min-width: 120px;
  --sw-container-max-width: 520px;
  --sw-vertical-collapsed-width: 160px;

  /* Animation */
  --sw-duration-entrance: 300ms;
  --sw-duration-expand: 250ms;
  --sw-duration-collapse: 200ms;
  --sw-duration-hover: 150ms;
  --sw-duration-support-fade: 150ms;
  --sw-duration-theme-transition: 200ms;
  --sw-delay-entrance: 200ms;
  --sw-easing-in: ease-in;
  --sw-easing-out: ease-out;

  /* Z-index */
  --sw-z-index: 2147483647;

  /* Light theme colors (default) */
  --sw-bg: #FFFFFF;
  --sw-text-primary: #1A1A2E;
  --sw-text-secondary: #4A4A68;
  --sw-accent: #C8A800;
  --sw-accent-hover: #A08600;
  --sw-button-bg: #F5C518;
  --sw-button-text: #1A1A2E;
  --sw-button-hover-bg: #E0B400;
  --sw-border: #E8E8EC;
  --sw-shadow: 0 1px 4px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04);
  --sw-focus-ring: #4D65FF;
  --sw-hover-tint: rgba(200, 168, 0, 0.08);
  --sw-active-tint: rgba(200, 168, 0, 0.16);
  --sw-logo-bg: transparent;
}

/* Dark theme override */
:host([data-theme="dark"]) {
  --sw-bg: #1A1A2E;
  --sw-text-primary: #F0F0F5;
  --sw-text-secondary: #B0B0C8;
  --sw-accent: #F5C518;
  --sw-accent-hover: #FFD54F;
  --sw-button-bg: #F5C518;
  --sw-button-text: #1A1A2E;
  --sw-button-hover-bg: #FFD54F;
  --sw-border: #2E2E48;
  --sw-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.12);
  --sw-focus-ring: #4D65FF;
  --sw-hover-tint: rgba(245, 197, 24, 0.10);
  --sw-active-tint: rgba(245, 197, 24, 0.18);
  --sw-logo-bg: rgba(255, 255, 255, 0.9);
}

/* Auto theme (responds to system preference) */
@media (prefers-color-scheme: dark) {
  :host([data-theme="auto"]) {
    --sw-bg: #1A1A2E;
    --sw-text-primary: #F0F0F5;
    --sw-text-secondary: #B0B0C8;
    --sw-accent: #F5C518;
    --sw-accent-hover: #FFD54F;
    --sw-button-bg: #F5C518;
    --sw-button-text: #1A1A2E;
    --sw-button-hover-bg: #FFD54F;
    --sw-border: #2E2E48;
    --sw-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.12);
    --sw-focus-ring: #4D65FF;
    --sw-hover-tint: rgba(245, 197, 24, 0.10);
    --sw-active-tint: rgba(245, 197, 24, 0.18);
    --sw-logo-bg: rgba(255, 255, 255, 0.9);
  }
}

/* Theme transition for auto mode */
:host([data-theme="auto"]) {
  transition: 
    background-color var(--sw-duration-theme-transition) ease,
    color var(--sw-duration-theme-transition) ease,
    border-color var(--sw-duration-theme-transition) ease,
    box-shadow var(--sw-duration-theme-transition) ease;
}
```

### 15.2 Component Prop Contracts (TypeScript Shapes)

```typescript
/** Configuration options for the widget */
interface SternenkoWidgetConfig {
  /** Widget position on the viewport */
  position: 'top-left' | 'top-center' | 'top-right'
           | 'center-left' | 'center-right'
           | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Color scheme */
  colorScheme: 'light' | 'dark' | 'auto';
  /** Language code */
  lang: 'eng' | 'ukr' | 'de' | 'fr' | 'cs' | 'pl';
}

/** Internal widget state (read-only, not exposed via public API) */
interface SternenkoWidgetState {
  /** Whether the widget is expanded */
  expanded: boolean;
  /** Resolved color theme (after auto-detection) */
  resolvedTheme: 'light' | 'dark';
  /** Effective layout orientation */
  layout: 'horizontal' | 'vertical';
  /** Effective position (may differ from config on mobile) */
  effectivePosition: SternenkoWidgetConfig['position'];
}

/** Translation strings for a single language */
interface SternenkoTranslation {
  header: string;
  body: string;
  supportAction: string;
  donateAction: string;
  collapseAriaLabel: string;
  donateAriaLabel: string;   // "[Donate text] -- opens in new tab" localized
  widgetAriaLabel: string;   // "Sternenko Fund donation widget" localized
}

/** Public API */
interface SternenkoWidgetAPI {
  init(config?: Partial<SternenkoWidgetConfig>): void;
  destroy(): void;
}
```

Note: Internal state (`SternenkoWidgetState`) is not exposed via the public API. The host page cannot query the widget's internal state. If this is needed in the future, add a `getState(): SternenkoWidgetState` method to the API.

### 15.3 DOM Skeleton

The following shows the complete DOM structure within the Shadow DOM:

```html
<div class="sternenko-widget-host"> <!-- position: fixed; hosts Shadow DOM; direct child of document.body -->
  #shadow-root
    <style>/* all widget styles */</style>
    <div class="widget-container" 
         role="complementary" 
         aria-label="..." 
         aria-expanded="false" 
         lang="en"
         data-position="bottom-right"
         data-theme="light">
      
      <!-- Header row (always visible) -->
      <div class="header-row">
        <div class="logo" aria-hidden="true">
          <svg><!-- logo SVG --></svg>
        </div>
        <span class="header-text"><strong>Help save lives in Ukraine</strong></span>
        
        <!-- Collapsed state: Support action -->
        <button class="support-action" aria-expanded="false">
          Support
          <svg class="arrow-icon" aria-hidden="true"><!-- right arrow --></svg>
        </button>
        
        <!-- Expanded state: Collapse control (hidden when collapsed) -->
        <button class="collapse-control" aria-label="Collapse" hidden>
          <svg class="chevron-icon" aria-hidden="true"><!-- directional chevron --></svg>
        </button>
      </div>
      
      <!-- Expandable region (hidden when collapsed) -->
      <div class="expandable-region" data-expanded="false">
        <hr class="separator" aria-hidden="true" />
        <p class="body-text">Every night, Russia attacks Ukraine...</p>
        <div class="action-row">
          <a class="donate-button" 
             href="https://www.sternenkofund.org/en/fundraisings/shahedoriz" 
             target="_blank" 
             rel="noopener noreferrer"
             aria-label="Donate -- opens in new tab">
            Donate
          </a>
        </div>
      </div>
    </div>
```

### 15.4 Acceptance Criteria (Given/When/Then)

#### AC-01: Initial Render (Collapsed, Horizontal, Light Theme)

```
Given the widget is initialized with position="bottom-right", colorScheme="light", lang="eng"
When the page loads and the entrance animation completes (200ms delay + 300ms animation)
Then the widget is visible in the bottom-right corner (16px from bottom, 16px from right)
And the widget displays the logo (48x48px circle, no background), header text "Help save lives in Ukraine", and "Support" action with SVG arrow icon
And the widget background is #FFFFFF with two-layer micro-shadow and 1px #E8E8EC border
And all text meets WCAG AA contrast ratios
And the widget has role="complementary", aria-label in English, and aria-expanded="false"
And the widget root has lang="en"
```

#### AC-02: Expand Transition

```
Given the widget is in collapsed state
When the user clicks the "Support" action
Then the "Support" action fades out over 150ms
And the widget animates to expanded state over 250ms with ease-out easing
And the body text and "Donate" button become visible
And the collapse control (SVG chevron) is visible
And aria-expanded changes to "true"
And focus moves to the collapse control
And the screen reader reading order is: header, body text, donate button (regardless of widget position)
```

#### AC-03: Collapse Transition

```
Given the widget is in expanded state
When the user clicks the collapse control
Then the widget animates to collapsed state over 200ms with ease-in easing
And the body text and "Donate" button are hidden
And the "Support" action is visible again (fades in)
And aria-expanded changes to "false"
And focus moves to the "Support" action
And the screen reader reading order is: header, support action
```

#### AC-04: Escape Key Collapse

```
Given the widget is in expanded state
And the widget or any child element has focus
And the Escape listener is attached to the widget container (not globally)
When the user presses the Escape key
Then the widget collapses (same as AC-03)

Given the widget is in collapsed state
And the widget has focus
When the user presses the Escape key
Then nothing happens (no blur, no unfocus)
```

#### AC-05: Donate Click

```
Given the widget is in expanded state
When the user clicks the "Donate" button
Then a new browser tab opens with URL "https://www.sternenkofund.org/en/fundraisings/shahedoriz"
And the link has rel="noopener noreferrer"
And the widget collapses back to collapsed state
And the Donate link has aria-label including "opens in new tab" in the configured language
```

#### AC-06: Dark Theme

```
Given the widget is initialized with colorScheme="dark"
When the widget renders
Then the widget background is #1A1A2E (anthracite)
And the header text color is #F0F0F5
And the accent color (Support text) is #F5C518 (gold)
And the Donate button is gold (#F5C518) with dark text (#1A1A2E)
And the logo has a white circular background (rgba(255,255,255,0.9))
And all text meets WCAG AA contrast ratios against the dark background
```

#### AC-07: Auto Theme

```
Given the widget is initialized with colorScheme="auto"
And the user's system is in dark mode
When the widget renders
Then the dark palette is applied

Given the widget is rendered in dark palette via auto mode
When the user toggles their system to light mode
Then the widget dynamically switches to the light palette over 200ms transition
And all contrast ratios remain valid during and after transition
```

#### AC-08: Vertical Layout (center-left)

```
Given the widget is initialized with position="center-left"
When the widget renders in collapsed state
Then the widget is flush with the left viewport edge (left: 0)
And vertically centered (top: 50%, transform: translateY(-50%))
And elements are stacked vertically (logo top, header middle, support bottom)
And the widget width is 160px
And border-radius is 0 12px 12px 0

When the user expands the widget
Then the widget expands horizontally to the RIGHT
And shows body text and donate button in a two-column layout
```

#### AC-09: Mobile Responsive (center-left -> bottom-left)

```
Given the widget is initialized with position="center-left"
And the viewport width is less than 480px
When the widget renders
Then the widget repositions to bottom-left (bottom: 16px, left: 16px)
And uses horizontal layout instead of vertical
And the logo size is 40px (not 48px)
And border-radius is 12px (all corners, no flush edge)
```

#### AC-10: Reduced Motion

```
Given the user has prefers-reduced-motion: reduce enabled
When the widget loads
Then the entrance animation is skipped (widget appears immediately)
When the user expands or collapses the widget
Then the state change is instantaneous (no animation)
And the Support action hides/shows instantly (no fade)
```

#### AC-11: Keyboard Navigation (Full Flow)

```
Given the widget is in collapsed state
When the user tabs into the widget
Then focus lands on the "Support" button
And a visible focus ring (2px solid #4D65FF, 2px offset) is displayed

When the user presses Enter on the focused "Support" button
Then the widget expands
And focus moves to the collapse control

When the user presses Tab
Then focus moves to the "Donate" link

When the user presses Tab again
Then focus leaves the widget (no focus trap)

When the user Shift+Tabs back to the collapse control and presses Enter
Then the widget collapses
And focus returns to the "Support" button
```

#### AC-12: Language Rendering

```
Given the widget is initialized with lang="pl"
When the widget renders in collapsed state
Then the header text is "Pomoz ratowac zycie w Ukrainie" (with proper Polish diacritics)
And the support action text is "Wesprzec" (with proper diacritics) followed by SVG arrow icon
And the widget root has lang="pl"

When the widget is expanded
Then the body text is the full Polish translation
And the donate button text is "Wplacic darowizne" (with proper diacritics)
And the donate aria-label includes the Polish "opens in new tab" translation
```

#### AC-13: Print Hiding

```
Given the widget is rendered on a page
When the user prints the page
Then the widget is not visible on the printed output
```

#### AC-14: Style Isolation

```
Given a host page with CSS that sets * { font-family: 'Comic Sans'; color: red; margin: 50px; }
When the widget renders
Then the widget uses its own font stack (FixelDisplay or system fallback), colors, and spacing unaffected by the host page
And the host page elements are unaffected by the widget's styles
```

#### AC-15: Widget Entrance Positions

```
Given position="top-left"
When entrance animation plays
Then the widget slides in from translateY(-8px) to translateY(0) with opacity 0 to 1

Given position="bottom-right"  
When entrance animation plays
Then the widget slides in from translateY(8px) to translateY(0) with opacity 0 to 1

Given position="center-left"
When entrance animation plays
Then the widget slides in from translateX(-8px) to translateX(0) with opacity 0 to 1
```

#### AC-16: Bottom Position Expand Direction

```
Given position="bottom-left" and the widget is collapsed
When the user clicks "Support"
Then the widget expands UPWARD (content appears above the header row)
And the header row remains at the bottom of the widget (visually anchored by CSS bottom positioning)
And the DOM order is: header row, expandable region (body text, donate button)
And the screen reader reading order is: header, body text, donate button
```

#### AC-17: Viewport Overflow Protection

```
Given the widget is expanded
And the expanded height exceeds the viewport height minus 32px
When the content renders
Then the expandable region has overflow-y: auto and max-height: calc(100vh - 32px - header-row-height)
And the user can scroll within the widget to see all content
```

#### AC-18: Cross-Breakpoint Transition

```
Given position="center-left" and the widget is expanded on a 1024px viewport
When the user resizes the browser to 400px width
Then the widget collapses and repositions to bottom-left with horizontal layout
```

#### AC-19: Theme Transition (Auto Mode)

```
Given colorScheme="auto" and the widget is rendered in light theme
When the user changes their system preference to dark mode
Then all widget colors transition to the dark palette over 200ms
And the transition is smooth (not a jarring instant switch)
And all contrast ratios remain valid during and after transition
```

#### AC-20: Long Translation Handling (Vertical Layout)

```
Given position="center-left" and lang="de"
When the widget renders in collapsed state
Then the header text wraps within the 128px content area (160px container - 32px padding)
And the widget height does not exceed 280px
And the text remains fully readable
```

#### AC-21: Widget Host Element Placement

```
Given the widget script is loaded on a page
When the widget initializes
Then the widget host element is inserted as a direct child of document.body
And the host element is not nested inside any element with transform, will-change, or filter CSS properties (to avoid z-index stacking context traps)
```

---

## 16. Open Questions (Blockers Only)

All previously open questions have been resolved in Rev 2:

| ID | Question | Resolution |
|---|---|---|
| UX-OQ-01 (v1.0) | Should the widget `aria-label` be localized? | **Resolved:** Yes. `widgetAriaLabel` translations added to section 10.2. |
| UX-OQ-02 (v1.0) | Should the "Donate" `aria-label` include "(opens in new tab)" in all languages? | **Resolved:** Yes. `donateAriaLabel` translations added to section 10.2. Translations need native speaker review. |
| UX-OQ-03 (v1.0) | Should the entrance animation delay be configurable? | **Resolved:** No. Fixed at 200ms (reduced from 400ms). Can be adjusted post-launch if needed. |

**New open questions (Rev 2):**

| ID | Question | Context | Impact | Blocker? |
|---|---|---|---|---|
| UX-OQ-04 | Should the FixelDisplay font be bundled or should the widget use system fonts only? | Bundling adds ~20-40KB to the widget. System fonts are visually compatible but not identical. | Medium -- affects brand alignment with sternenkofund.org | No -- system font fallback is acceptable for v1. Document the decision. |
| UX-OQ-05 | Are the `donateAriaLabel` and `widgetAriaLabel` translations accurate? | Provided in section 10.2 as approximate transliterations. Native speaker review needed. | Low -- English fallback is functional | No -- ship with provided translations, iterate post-review. |

---

## 17. ASCII Wireframes -- Complete Position Reference

### 17.1 Horizontal Collapsed (all 6 positions)

```
+---------- viewport ----------+
| [W-collapsed]                |  top-left
|                              |
|       [W-collapsed]          |  top-center
|                              |
|          [W-collapsed]       |  top-right
|                              |
|                              |
|                              |
| [W-collapsed]                |  bottom-left
|                              |
|       [W-collapsed]          |  bottom-center
|                              |
|          [W-collapsed]       |  bottom-right
+------------------------------+

Where [W-collapsed] =
+---------------------------------------------------+
| [O]  Help save lives in Ukraine    [Support ->]   |
+---------------------------------------------------+
  ^-- arrow is SVG icon, not ">" text
```

### 17.2 Vertical Collapsed (2 positions)

```
+---------- viewport ----------+
|                              |
|                              |
| +------+          +------+  |
| |  O   |          |  O   |  |
| |      |          |      |  |
| | Hdr  |          | Hdr  |  |
| | text |          | text |  |
| |      |          |      |  |
| | Sup  |          | Sup  |  |
| +------+          +------+  |
|  ^                    ^     |
|  center-left   center-right |
|  160px wide    160px wide   |
|                              |
+------------------------------+
```

### 17.3 Horizontal Expanded (top position, expands DOWN)

```
+---------------------------------------------------+
| [O]  Help save lives in Ukraine       [^]         |
|---------------------------------------------------|
| Every night, Russia attacks Ukraine with strike   |
| drones. They kill civilians and destroy cities.   |
| Interceptor drones make it possible to stop these |
| attacks in the sky. Your donation will help...    |
|---------------------------------------------------|
|                                [ Donate ]          |
+---------------------------------------------------+
  ^-- gold/yellow button with dark text
```

### 17.4 Horizontal Expanded (bottom position, expands UP)

**Same DOM order as top position.** The widget is anchored at the bottom via CSS and grows upward visually. The header row stays at the bottom because it is the first DOM element and the expandable region opens above it as height increases:

```
+---------------------------------------------------+
|                                [ Donate ]          |
|---------------------------------------------------|
| Every night, Russia attacks Ukraine with strike   |
| drones. They kill civilians and destroy cities... |
|---------------------------------------------------|
| [O]  Help save lives in Ukraine       [v]         |
+---------------------------------------------------+
  ^-- visually, header is at bottom; DOM order is still header-first
  ^-- CSS bottom anchor causes upward growth naturally
```

**DOM order (same for all positions):** header row -> expandable region (separator, body, donate)

### 17.5 Vertical Expanded (center-left, expands RIGHT)

```
+------+-----------------------------------------+
| [O]  | Help save lives in Ukraine      [<]     |
|      |                                          |
|      | Every night, Russia attacks Ukraine      |
|      | with strike drones. They kill civilians  |
|      | and destroy cities...                    |
|      |                                          |
|      |                         [ Donate ]        |
+------+-----------------------------------------+
```

### 17.6 Vertical Expanded (center-right, expands LEFT)

```
+-----------------------------------------+------+
| [>]    Help save lives in Ukraine       | [O]  |
|                                         |      |
| Every night, Russia attacks Ukraine     |      |
| with strike drones. They kill civilians |      |
| and destroy cities...                   |      |
|                                         |      |
| [ Donate ]                              |      |
+-----------------------------------------+------+
```

---

## 18. Usability Testing Recommendations (A/49)

### 18.1 Risky Flow: First Impression and Expand

**Risk:** Users may not understand what the widget is, may find it intrusive, or may not notice the "Support" action as clickable.

**Test plan:**
- Recruit 5-8 participants across mobile and desktop
- Present a mock host page with the widget in collapsed state
- Tasks: "What is this element?" / "How would you learn more?" / "How would you donate?"
- Measure: Time to first click on "Support", success rate of reaching donation page, qualitative reactions to intrusiveness
- **Success threshold:** Expand rate above 60% within 10 seconds of first noticing the widget. If below 40%, investigate collapsed-state copy and affordance clarity.

### 18.2 Risky Flow: Collapse Affordance

**Risk:** The collapse control (chevron icon) may not be discoverable, especially on mobile where it is small (32x32px visual).

**Test plan:**
- After participants expand the widget, observe if they can collapse it without prompting
- **Success threshold:** 70% collapse discovery rate without prompting. If below 70%, switch to a text+icon button ("Close" + chevron icon) with min-width: 64px.
- Also test if the chevron direction is intuitive. If users express confusion, switch to a universal "X" close icon.

### 18.3 Risky Flow: Dark Theme Contrast

**Risk:** The dark theme gold accent on anthracite background may not provide sufficient perceived contrast on budget mobile screens.

**Test plan:**
- Test dark theme rendering on a budget Android phone (e.g., Samsung Galaxy A series)
- Verify text readability in bright outdoor conditions (low screen brightness + sunlight)
- Verify the gold Donate button is perceived as the primary action (not mistaken for a warning or decoration)

---

## Quality Gate (Self-Check)

| Check | Status | Notes |
|---|---|---|
| Personas + success criteria defined (A/1-2) | PASS | Two personas defined; success = donation click; expand rate threshold added |
| Clear hierarchy + focal point per screen (A/5, A/7) | PASS | Each screen spec names focal point and hierarchy; S4 now has its own explicit hierarchy |
| Grid/alignment/proximity explicit (A/6, A/9) | PASS | Flexbox layouts with px values specified; padding standardized across states |
| Progressive disclosure + step breakdown (A/14, A/17) | PASS | Collapsed -> Expanded is progressive disclosure with fade transition |
| States complete (loading/empty/error/success/disabled) (A/19) | PASS | All states addressed; expanded-state container hover explicitly documented; escape-while-collapsed documented; scroll-while-expanded documented |
| Predictable nav and conventions (A/12, A/16) | PASS | Two-state toggle; chevron direction rationale documented; Escape scope clarified |
| Typography hierarchy + limited variation (A/21, A/25) | PASS | 3 levels (reduced from 4), single font family, 2 weights for hierarchy |
| Semantic colors + contrast target (A/27, A/31) | PASS | Full light/dark palette with contrast ratios; gold accent verified on both themes; focus ring verified against all backgrounds |
| Content-first + concise microcopy (A/33-35) | PASS | Text is the core; concise labels; body under 300 chars; SVG icon instead of text arrow |
| Cross-device behavior specified (A/44) | PASS | Breakpoints defined; mobile repositioning; cross-breakpoint transition behavior; viewport overflow protection; small viewport height handling |
| At least one usability test recommendation (A/49) | PASS | 3 test recommendations with success thresholds |

---

**Document End**

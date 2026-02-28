# Sternenko Widget -- Product Requirements Document

**Document version:** 1.0
**Date:** 2026-02-27
**Status:** Draft -- Pending Clarification on Open Questions
**Author:** Product / BA

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Classification](#2-feature-classification)
3. [Problem Statement](#3-problem-statement)
4. [Business Objectives and KPIs](#4-business-objectives-and-kpis)
5. [Target Users and Stakeholders](#5-target-users-and-stakeholders)
6. [User Stories](#6-user-stories)
7. [Widget States and Transitions](#7-widget-states-and-transitions)
8. [User Journey Mapping](#8-user-journey-mapping)
9. [Layout Specifications](#9-layout-specifications)
10. [Color Scheme Specifications](#10-color-scheme-specifications)
11. [Internationalization](#11-internationalization)
12. [Configuration API](#12-configuration-api)
13. [Integration Guide](#13-integration-guide)
14. [Functional Requirements](#14-functional-requirements)
15. [Non-Functional Requirements](#15-non-functional-requirements)
16. [Edge Cases and Constraints](#16-edge-cases-and-constraints)
17. [Assumptions](#17-assumptions)
18. [Risks](#18-risks)
19. [Open Questions](#19-open-questions)
20. [Appendix A -- Translation Reference Table](#appendix-a----translation-reference-table)
21. [Appendix B -- Jira-Ready Stories](#appendix-b----jira-ready-stories)

---

## 1. Executive Summary

The **sternenko-widget** is a standalone, embeddable JavaScript popup widget that websites can add with a single `<script>` tag to promote Sternenko's drone fund for the Armed Forces of Ukraine. The widget floats over the host page in a configurable position, displays a localized call-to-action, and links visitors to the charity donation page.

The widget has two visual states: a compact **collapsed** state showing the logo, a headline, and a "Support" action; and an **expanded** state showing additional context about why donations matter plus a "Donate" button that opens the charity website.

The library must be framework-agnostic, lightweight, self-contained (zero runtime dependencies), and configurable via HTML data attributes or a JavaScript API.

---

## 2. Feature Classification

**Classification:** UI-facing (end-user interactive widget)

This is a client-side UI component that renders visual elements on top of a host website and responds to user interaction. User Journey Mapping is **mandatory**.

---

## 3. Problem Statement

### What problem are we solving?

Websites sympathetic to Ukraine's cause currently have no turnkey solution to promote Sternenko's drone fund. Site owners who want to show solidarity must build custom UI, manage translations, and maintain the integration themselves. This friction reduces the number of sites that actively promote the fund, resulting in lower donation visibility and fewer contributions.

### Current behavior

Website owners who want to promote the fund must either: (a) build a custom banner/popup from scratch, (b) add a static link with no visual prominence, or (c) do nothing.

### Desired behavior

A website owner adds a single `<script>` tag (with optional configuration attributes) and a branded, localized, accessible popup appears on their site -- driving visitors to the donation page with minimal integration effort.

### Consequence of inaction

Lower visibility for the drone fund across the web, fewer donations, and missed opportunity to build a network effect where multiple sites amplify the same cause.

---

## 4. Business Objectives and KPIs

| Objective | KPI | Target |
|---|---|---|
| Maximize donation page visits | Click-through rate on "Donate" button | Track via UTM or referrer analytics (target TBD) |
| Minimize integration friction | Time to integrate for a website owner | Under 5 minutes |
| Broad language reach | Number of supported languages | 5-6 at launch (see Open Questions on Polish) |
| High adoption across sites | Number of sites embedding the widget | Not directly measurable by the widget itself |
| Minimal performance impact on host site | Bundle size, load time overhead | See Non-Functional Requirements |

---

## 5. Target Users and Stakeholders

### Persona 1: Website Owner (Integrator)

- **Role:** Developer or site administrator who decides to embed the widget
- **Goal:** Add the widget to their site with minimal effort, customized to their site's look and position preferences
- **Technical skill:** Basic HTML knowledge (can add a script tag and set data attributes); optionally, JavaScript proficiency for programmatic control

### Persona 2: Website Visitor (End User)

- **Role:** Person browsing a website that has the widget embedded
- **Goal:** Learn about the cause and optionally donate
- **Technical skill:** General web user; no technical skill required

### Stakeholders

- **Sternenko Foundation / Fund organizers:** Want maximum reach and donation conversion
- **Widget maintainers:** Need a clean, maintainable codebase for ongoing translation and feature updates

---

## 6. User Stories

### Website Owner (Integrator) Stories

**US-I-01: Basic Integration**
As a website owner, I want to embed the widget by adding a single `<script>` tag to my HTML so that the widget appears on my site with sensible defaults and no additional coding.

**US-I-02: Position Configuration**
As a website owner, I want to choose where the widget appears on the page (e.g., bottom-right, top-left, center-left) so that it does not conflict with my site's existing UI elements.

**US-I-03: Color Scheme Configuration**
As a website owner, I want to select a color scheme (light, dark, or auto) so that the widget visually harmonizes with my site's design.

**US-I-04: Language Configuration**
As a website owner, I want to specify the widget's language so that it displays content appropriate for my audience.

**US-I-05: Programmatic Control**
As a website owner, I want to initialize and control the widget via a JavaScript API (in addition to data attributes) so that I can integrate it into dynamic single-page applications.

**US-I-06: Programmatic Destruction**
As a website owner, I want to destroy/remove the widget programmatically so that I can clean up resources when navigating away in an SPA or conditionally showing the widget.

### Website Visitor (End User) Stories

**US-V-01: See the Widget**
As a website visitor, I want to see a non-intrusive floating popup with a logo and headline so that I become aware of the Ukrainian drone fund.

**US-V-02: Learn More**
As a website visitor, I want to click "Support" to expand the widget and read more about why donations matter so that I can make an informed decision.

**US-V-03: Donate**
As a website visitor, I want to click "Donate" in the expanded widget so that I am taken to the charity donation page in a new tab.

**US-V-04: Collapse the Widget**
As a website visitor, I want to collapse the expanded widget back to its compact state so that it no longer obstructs the page content.

**US-V-05: Dismiss the Widget** *(see Open Question OQ-06)*
As a website visitor, I want to dismiss/close the widget entirely so that it no longer appears during my browsing session.

**US-V-06: Read in My Language**
As a website visitor, I want the widget to display text in a language I understand so that I can engage with the content.

---

## 7. Widget States and Transitions

### 7.1 States

#### State 1: Collapsed (Default)

Visible elements:
1. **Logo** -- The military emblem (black star with yellow drone/lightning)
2. **Header text** -- Localized (e.g., "Help save lives in Ukraine")
3. **"Support" action** -- A clickable link/button that triggers expansion

#### State 2: Expanded

Visible elements:
1. **Logo** -- Same as collapsed state
2. **Header text** -- Same as collapsed state
3. **Body text** -- A localized paragraph explaining the cause and why donations matter
4. **"Donate" button** -- Opens the charity donation URL in a new browser tab
5. **Collapse control** -- A mechanism to return to collapsed state (e.g., a close/chevron icon, or clicking the header area)

Hidden elements:
- The "Support" link/button is **not shown** in expanded state

*Note: There is no "Dismissed" state. The widget is always present and cannot be fully hidden by the user.*

### 7.2 State Transitions

```
                    [Page Load]
                        |
                        v
                  +-----------+
                  | Collapsed |<---------+
                  +-----------+          |
                        |                |
              (click "Support")   (click collapse
                        |          control)
                        v                |
                  +-----------+          |
                  | Expanded  |----------+
                  +-----------+
                        |
              (click "Donate")
                        |
                        v
               [New tab opens to
                donation URL;
                widget collapses
                back to Collapsed state]
```

If dismiss functionality is included (see OQ-06):

```
  Collapsed ---(click dismiss)---> Dismissed
  Expanded  ---(click dismiss)---> Dismissed
```

### 7.3 Animations

- **Collapse to Expand:** The widget should smoothly animate (e.g., height/opacity transition) from collapsed to expanded. Recommended duration: 200-300ms with ease-out timing.
- **Expand to Collapse:** Reverse animation, same duration.
- **Initial appearance:** The widget should fade in or slide in on page load (not appear abruptly). Recommended: a subtle fade-in with slight translate, 300-400ms delay after DOM ready.
- **Dismiss:** Fade out and/or slide away.

All animations must respect `prefers-reduced-motion: reduce` -- when the user has this OS-level preference enabled, animations should be instantaneous (duration: 0).

---

## 8. User Journey Mapping

### Journey 1: Website Visitor -- Awareness to Donation

**Persona:** Website Visitor (End User)

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1. Entry point | Visitor loads a page with the widget embedded | Widget renders in collapsed state at configured position, with a subtle entrance animation | Widget must not block critical page content |
| 2. Awareness | Visitor notices the floating widget with logo and headline | -- | Logo and headline must be visually distinct but not aggressive |
| 3. Interest | Visitor clicks the "Support" link/button | Widget smoothly expands to show body text and "Donate" button; "Support" link hides | Transition should feel polished, not jarring |
| 4. Decision point | Visitor reads the body text | -- | Text must be compelling but concise; localized correctly |
| 5a. Convert | Visitor clicks "Donate" | New browser tab opens to charity donation URL; widget collapses back to compact state on original page | Visitor can return to original tab and re-expand if needed |
| 5b. Decline / Later | Visitor clicks the collapse control | Widget smoothly collapses back to compact state | Visitor can re-expand later by clicking "Support" again |
| 5c. Dismiss (if supported) | Visitor clicks a close/dismiss control | Widget disappears entirely | See OQ-06 for persistence behavior |
| 6. Exit | Visitor navigates away or closes the tab | Widget state is lost (unless persistence is implemented) | -- |

**Friction points:**
- If the widget covers important page content, the visitor may be annoyed rather than engaged
- If the body text is too long, visitors may not read it
- If there is no way to dismiss the widget, it may cause frustration on repeated visits

**Drop-off risks:**
- Visitor ignores the widget entirely (mitigated by good visual design and positioning)
- Visitor expands but does not click "Donate" (mitigated by compelling copy)
- Visitor is annoyed and leaves the host site (mitigated by non-intrusive design and dismiss option)

**Critical business moment:** The click on "Donate" -- this is the conversion event.

### Journey 2: Website Owner -- Integration

**Persona:** Website Owner (Integrator)

| Step | User Action | System Response | Notes |
|------|-------------|-----------------|-------|
| 1. Discovery | Owner finds the widget (via documentation, social media, or word of mouth) | -- | Distribution channel is outside widget scope |
| 2. Integration | Owner adds `<script src="...">` tag to their HTML | Script loads asynchronously | Should not block page rendering |
| 3. Configuration | Owner adds data attributes to customize position, color, language | Widget reads configuration and applies it | Invalid values fall back to defaults |
| 4. Verification | Owner previews their site | Widget appears correctly in chosen position, color scheme, and language | -- |
| 5. Maintenance | Owner can update configuration by changing data attributes | Widget respects updated config on next page load | No server-side changes needed |

---

## 9. Layout Specifications

### 9.1 Position Options

The widget supports 8 positions. The `position` parameter determines both WHERE the widget is placed and WHICH layout orientation it uses.

| Position Value | Screen Placement | Layout Orientation |
|---|---|---|
| `top-left` | Top-left corner | Horizontal |
| `top-center` | Top-center edge | Horizontal |
| `top-right` | Top-right corner | Horizontal |
| `center-left` | Middle of left edge | **Vertical** |
| `center-right` | Middle of right edge | **Vertical** |
| `bottom-left` | Bottom-left corner | Horizontal |
| `bottom-center` | Bottom-center edge | Horizontal |
| `bottom-right` | Bottom-right corner | Horizontal |

### 9.2 Horizontal Layout (6 positions)

Used for: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`

**Collapsed state arrangement:**
- Elements arranged in a horizontal row: `[Logo] [Header Text] [Support Link]`
- Widget spans horizontally; height is compact (single row)

**Expanded state arrangement:**
- Body text and Donate button appear below the header row
- Widget expands vertically downward (for top positions) or upward (for bottom positions)
- The overall shape is a horizontal card that grows in height

### 9.3 Vertical Layout (2 positions)

Used for: `center-left`, `center-right`

**Collapsed state arrangement:**
- Elements stacked vertically: Logo on top, Header Text below, "Support" link below that
- Widget is narrow and tall, flush against the left or right edge of the viewport

**Expanded state arrangement:**
- Body text and Donate button appear below the stacked elements
- For `center-left`: widget expands horizontally to the **right**
- For `center-right`: widget expands horizontally to the **left**
- The overall shape is a narrow vertical card that grows in width when expanded

### 9.4 Margin and Spacing

- The widget should maintain a margin from viewport edges (recommended: 16px) for corner and edge positions
- `center-left` and `center-right` should have 0px margin on the side they are flush with and 16px on the opposite axis
- Internal padding should be consistent across layouts (recommended: 16px internal padding)

### 9.5 Fixed Positioning

- The widget uses CSS `position: fixed` so it stays in place during scrolling
- It must not move when the user scrolls the host page

---

## 10. Color Scheme Specifications

### 10.1 Options

| Value | Behavior |
|---|---|
| `light` | Widget uses the light color palette regardless of system/browser setting |
| `dark` | Widget uses the dark color palette regardless of system/browser setting |
| `auto` | Widget detects system preference via `prefers-color-scheme` media query and applies the matching palette. Changes dynamically if the user toggles their OS dark mode. |

### 10.2 Color Palettes

> **Note:** Exact color values are a UX/design decision and are NOT defined in this requirements document. The following describes the intent and constraints; exact hex/RGB values will be specified in the design phase.

**Light palette intent:**
- Background: Light/white
- Text: Dark/black
- Accent colors: Derived from the logo palette (black + yellow) or the reference blue
- Must have sufficient contrast for WCAG AA compliance (see Non-Functional Requirements)

**Dark palette intent:**
- Background: Dark/near-black
- Text: Light/white
- Accent colors: Same brand colors, adjusted for dark background contrast
- Must have sufficient contrast for WCAG AA compliance

### 10.3 Auto Mode Behavior

- On initial load, the widget reads `window.matchMedia('(prefers-color-scheme: dark)')` and applies the corresponding palette
- The widget must listen for changes (`matchMedia.addEventListener('change', ...)`) and switch palette dynamically without page reload
- If the media query is not supported by the browser, fall back to `light`

### 10.4 Logo Treatment

The logo (black star with yellow drone/lightning emblem) must remain visually identifiable in both light and dark palettes. If the logo has a transparent background, the widget background provides sufficient contrast. If the logo has an opaque background that clashes with the dark palette, a variant or outline treatment may be needed -- this is a design decision (see OQ-10).

---

## 11. Internationalization

### 11.1 Supported Languages

| Language Code | Language Name | Status |
|---|---|---|
| `eng` | English | Supported |
| `ukr` | Ukrainian | Supported |
| `de` | German | Supported |
| `fr` | French | Supported |
| `cs` | Czech | Supported |
| `pl` | Polish | Supported |

### 11.2 Translation Strings

The widget requires the following translatable strings per language:

| String Key | Purpose | Notes |
|---|---|---|
| `header` | Headline text shown in both collapsed and expanded states | Provided for all languages |
| `body` | Explanatory paragraph shown in expanded state only | Provided for all languages |
| `supportAction` | Text for the "Support" link/button in collapsed state | Provided for all languages |
| `donateAction` | Text for the "Donate" button in expanded state | Provided for all languages |
| `collapseAriaLabel` | Accessible label for the collapse control | Provided for all languages |

### 11.3 Provided Translations -- Header Text

| Language | Header Text |
|---|---|
| English | Help save lives in Ukraine |
| Ukrainian | Допоможіть врятувати життя в Україні |
| German | Helfen Sie, Leben in der Ukraine zu retten |
| Polish | Pomóż ratować życie w Ukrainie |
| Czech | Pomozte zachranovat zivoty na Ukrajine |
| French | Aidez a sauver des vies en Ukraine |

*(Full Unicode versions with diacritics are in Appendix A.)*

### 11.4 Provided Translations -- Body Text

See **Appendix A** for the full body text in all languages.

### 11.5 Collapse Aria Label Translations

| Language | Code | Collapse Label |
|---|---|---|
| English | `eng` | Collapse |
| Ukrainian | `ukr` | Згорнути |
| German | `de` | Einklappen |
| Polish | `pl` | Zwinąć |
| Czech | `cs` | Sbalit |
| French | `fr` | Réduire |

### 11.6 Right-to-Left (RTL) Languages

No RTL languages are in scope. If RTL support is needed in the future, it should be planned as a separate enhancement.

---

## 12. Configuration API

### 12.1 Configuration Parameters

| Parameter | Data Attribute | JS API Property | Type | Allowed Values | Default | Required |
|---|---|---|---|---|---|---|
| Position | `data-position` | `position` | String | `top-left`, `top-center`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right` | `bottom-right` | No |
| Color scheme | `data-color-scheme` | `colorScheme` | String | `light`, `dark`, `auto` | `auto` | No |
| Language | `data-lang` | `lang` | String | `eng`, `ukr`, `de`, `fr`, `cs`, `pl` | `eng` | No |

### 12.2 Data Attribute API

```html
<script
  src="https://cdn.example.com/sternenko-widget.js"
  data-position="bottom-right"
  data-color-scheme="auto"
  data-lang="eng"
></script>
```

Configuration is read from the `<script>` tag's data attributes at load time.

### 12.3 JavaScript API

```javascript
// Initialize with options
SternenkoWidget.init({
  position: 'bottom-right',
  colorScheme: 'auto',
  lang: 'eng'
});

// Destroy the widget and clean up
SternenkoWidget.destroy();
```

### 12.4 Validation and Defaults

- If a parameter value is not in the allowed set, the widget must fall back to the default value silently (no error thrown, but a `console.warn` should be emitted in development).
- If both data attributes and JS API are used, the JS API call takes precedence and overrides data attribute values.
- If neither data attributes nor JS API are used, all defaults apply.

### 12.5 Donation URL

The donation URL is **not configurable** by the integrator. It is hardcoded into the widget to ensure it always points to the legitimate charity page: `https://www.sternenkofund.org/en/fundraisings/shahedoriz`

---

## 13. Integration Guide

### 13.1 Minimal Integration (Data Attributes)

```html
<!-- Add before </body> -->
<script
  src="https://cdn.example.com/sternenko-widget.js"
  data-position="bottom-right"
  data-color-scheme="auto"
  data-lang="eng"
  async
></script>
```

This is the recommended approach for static websites. The widget initializes automatically when the script loads.

### 13.2 Programmatic Integration (JS API)

```html
<script src="https://cdn.example.com/sternenko-widget.js" async></script>
<script>
  // Wait for the widget script to load
  window.addEventListener('sternenko-widget:ready', function() {
    SternenkoWidget.init({
      position: 'top-right',
      colorScheme: 'dark',
      lang: 'ukr'
    });
  });
</script>
```

This approach is recommended for SPAs or sites that need programmatic control.

### 13.3 SPA Lifecycle

```javascript
// Mount
SternenkoWidget.init({ position: 'bottom-left', lang: 'fr' });

// Unmount (clean up DOM elements and event listeners)
SternenkoWidget.destroy();
```

### 13.4 Hosting and CDN

The built widget file will be a single JavaScript file hosted on a CDN. The exact CDN URL is TBD. The file should be served with appropriate CORS headers so any website can load it.

---

## 14. Functional Requirements

### FR-01: Script Loading and Initialization

- **FR-01.1:** The widget must be loadable via a single `<script>` tag with no additional dependencies.
- **FR-01.2:** The script must support the `async` and `defer` attributes without breaking initialization.
- **FR-01.3:** When loaded via data attributes, the widget must auto-initialize after the script loads.
- **FR-01.4:** When the JS API `SternenkoWidget.init()` is called, the widget must render with the provided options.
- **FR-01.5:** The widget must dispatch a custom event `sternenko-widget:ready` on `window` when the script is loaded and the API is available.
- **FR-01.6:** If the widget is already initialized and `init()` is called again, the existing instance must be destroyed before creating a new one (no duplicate widgets).

### FR-02: Collapsed State Rendering

- **FR-02.1:** The collapsed state must display the logo image.
- **FR-02.2:** The collapsed state must display the header text in the configured language.
- **FR-02.3:** The collapsed state must display a "Support" action (link or button) with localized text.
- **FR-02.4:** The collapsed state must use the layout orientation (horizontal or vertical) determined by the configured position (see Section 9).

### FR-03: Expanded State Rendering

- **FR-03.1:** The expanded state must display the logo image.
- **FR-03.2:** The expanded state must display the header text in the configured language.
- **FR-03.3:** The expanded state must display the body text in the configured language.
- **FR-03.4:** The expanded state must display a "Donate" button with localized text.
- **FR-03.5:** The "Support" action must be hidden in the expanded state.
- **FR-03.6:** The expanded state must include a visible, interactive control to collapse the widget back to collapsed state.

### FR-04: State Transitions

- **FR-04.1:** Clicking the "Support" action in collapsed state must transition the widget to expanded state.
- **FR-04.2:** Clicking the collapse control in expanded state must transition the widget to collapsed state.
- **FR-04.3:** Transitions must be animated (see Section 7.3) unless `prefers-reduced-motion: reduce` is active.
- **FR-04.4:** The widget must default to collapsed state on page load.

### FR-05: Donate Action

- **FR-05.1:** Clicking the "Donate" button must open the charity donation URL in a new browser tab (`target="_blank"`).
- **FR-05.2:** The opened link must include `rel="noopener noreferrer"` for security.
- **FR-05.3:** After clicking "Donate", the widget must collapse back to the collapsed state on the original page.

### FR-06: Positioning

- **FR-06.1:** The widget must be rendered with CSS `position: fixed`.
- **FR-06.2:** The widget must appear at the viewport location specified by the `position` parameter.
- **FR-06.3:** The widget must remain visible and in position during page scrolling.
- **FR-06.4:** Horizontal layout must be used for all positions except `center-left` and `center-right`.
- **FR-06.5:** Vertical layout must be used for `center-left` and `center-right`.

### FR-07: Color Scheme

- **FR-07.1:** The widget must render in the light palette when `colorScheme` is `light`.
- **FR-07.2:** The widget must render in the dark palette when `colorScheme` is `dark`.
- **FR-07.3:** When `colorScheme` is `auto`, the widget must detect the user's system preference and apply the matching palette.
- **FR-07.4:** In `auto` mode, the widget must listen for system preference changes and update the palette dynamically without page reload.
- **FR-07.5:** If `prefers-color-scheme` is not supported by the browser, `auto` must fall back to `light`.

### FR-08: Language and Localization

- **FR-08.1:** The widget must display all text strings (header, body, action labels) in the language specified by the `lang` parameter.
- **FR-08.2:** If an unsupported language code is provided, the widget must fall back to English (`eng`).
- **FR-08.3:** All translations must be bundled within the widget script (no external translation file requests).

### FR-09: Configuration Validation

- **FR-09.1:** Invalid `position` values must fall back to `bottom-right`.
- **FR-09.2:** Invalid `colorScheme` values must fall back to `auto`.
- **FR-09.3:** Invalid `lang` values must fall back to `eng`.
- **FR-09.4:** A `console.warn` should be emitted when an invalid configuration value is detected.

### FR-10: Destruction

- **FR-10.1:** `SternenkoWidget.destroy()` must remove all widget DOM elements from the page.
- **FR-10.2:** `SternenkoWidget.destroy()` must remove all event listeners registered by the widget.
- **FR-10.3:** After destruction, calling `SternenkoWidget.init()` must create a fresh widget instance.

### FR-11: Style Isolation

- **FR-11.1:** The widget's CSS must not leak into or be affected by the host page's styles.
- **FR-11.2:** The widget should use Shadow DOM or namespaced/scoped CSS to achieve style isolation.
- **FR-11.3:** The widget must not inject global CSS that could affect host page elements.

### FR-12: Logo

- **FR-12.1:** The logo must be the military emblem (black star with yellow drone/lightning bolt).
- **FR-12.2:** The logo must be embedded within the widget script (e.g., inline SVG or base64-encoded image) to avoid external asset requests.
- **FR-12.3:** The logo must be rendered at a consistent size regardless of widget state or layout orientation.

---

## 15. Non-Functional Requirements

### NFR-01: Performance

- **NFR-01.1:** The total widget bundle size (JS + embedded assets) should not exceed **30 KB gzipped**.
- **NFR-01.2:** The widget must not block the host page's critical rendering path (must support `async` loading).
- **NFR-01.3:** Time from script load to widget visible must be under **100ms** (excluding network transfer time).
- **NFR-01.4:** The widget must not cause layout shifts on the host page (CLS impact = 0, since it uses fixed positioning).

### NFR-02: Browser Support

- **NFR-02.1:** The widget must work in the latest two major versions of: Chrome, Firefox, Safari, Edge.
- **NFR-02.2:** The widget must work on mobile browsers: Chrome for Android, Safari for iOS (latest two major versions).
- **NFR-02.3:** The widget should degrade gracefully in older browsers (it may not render, but must not throw errors or break the host page).

### NFR-03: Accessibility

- **NFR-03.1:** All interactive elements must be keyboard-focusable and operable (Tab, Enter, Escape).
- **NFR-03.2:** The widget must have appropriate ARIA roles and labels (e.g., `role="dialog"` or `role="complementary"`, `aria-label`, `aria-expanded`).
- **NFR-03.3:** Color contrast ratios must meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text).
- **NFR-03.4:** The widget must respect `prefers-reduced-motion: reduce` (disable animations).
- **NFR-03.5:** Focus must be managed during state transitions (e.g., when expanding, focus should move to the expanded content; when collapsing, focus should return to the "Support" action).
- **NFR-03.6:** Pressing Escape while the widget is expanded should collapse it.

### NFR-04: Security

- **NFR-04.1:** The donation URL must be hardcoded and not configurable by the integrator to prevent misuse (phishing).
- **NFR-04.2:** All external links must use `rel="noopener noreferrer"`.
- **NFR-04.3:** The widget must not use `eval()`, `innerHTML` with user-provided content, or other XSS-prone patterns.
- **NFR-04.4:** The widget must be served over HTTPS.

### NFR-05: Zero Dependencies

- **NFR-05.1:** The widget must have zero runtime dependencies (no React, jQuery, etc.).
- **NFR-05.2:** Build-time dependencies (bundlers, transpilers) are acceptable.
- **NFR-05.3:** The widget must be written in **TypeScript** as the primary language, compiled to JavaScript for distribution.

### NFR-06: No External Network Requests

- **NFR-06.1:** The widget must not make any network requests (no analytics, no external asset loading, no API calls).
- **NFR-06.2:** All assets (logo, translations, styles) must be bundled inline.

---

## 16. Edge Cases and Constraints

### EC-01: Mobile Behavior

- On small viewports (< 480px width), the widget may need responsive adjustments. Horizontal layout widgets should ensure they do not overflow the viewport width.
- Touch interactions must work for all tap targets (minimum tap target size: 44x44px per WCAG).
- The widget must not interfere with mobile browser chrome (address bar, bottom navigation bar).
- On mobile viewports, `center-left` repositions to `bottom-left` and `center-right` repositions to `bottom-right` (switching from vertical to horizontal layout).

### EC-02: Z-Index

- The widget must use a high z-index to float above most page content (recommended: `z-index: 2147483647` or a similarly high value).
- If the host page uses modal dialogs or other high-z-index overlays, the widget may appear on top of them. This is generally acceptable for a charity widget but should be documented.

### EC-03: Scroll Behavior

- The widget must remain fixed in the viewport regardless of scroll position.
- The widget must not prevent or interfere with scrolling the host page.

### EC-04: Multiple Instances

- Only one widget instance should exist on a page at a time.
- If the script tag is included multiple times, only the first instance should initialize; subsequent loads should be no-ops (or destroy + reinitialize).

### EC-05: Content Security Policy (CSP)

- The widget uses inline styles and/or Shadow DOM. If the host page has a strict CSP that blocks inline styles (`style-src 'self'`), the widget may not render correctly.
- The widget should document CSP requirements for integrators (e.g., may need `style-src 'unsafe-inline'` or a nonce-based approach).
- If Shadow DOM is used, styles inside Shadow DOM are generally exempt from CSP `style-src` restrictions.

### EC-06: Viewport Resize

- If the browser window is resized, the widget must remain correctly positioned and not overflow the viewport.

### EC-07: Print Styles

- The widget should be hidden when the page is printed (`@media print { display: none; }`).

### EC-08: Host Page Interference

- The host page's CSS reset or global styles must not break the widget's rendering (mitigated by style isolation -- FR-11).
- The host page's JavaScript must not accidentally interfere with the widget (mitigated by using a unique global namespace `SternenkoWidget` and Shadow DOM).

---

## 17. Assumptions

| ID | Assumption | Impact if Wrong |
|---|---|---|
| A-01 | The donation URL is a single, stable URL that does not change frequently | If it changes, a new version of the widget must be deployed |
| A-02 | The logo can be embedded as inline SVG (it is a vector graphic, not a photograph) | If it is a raster image, base64 encoding will increase bundle size |
| A-03 | The widget does not need to track or report analytics (click events, impressions) | If analytics are needed, network request requirements and privacy considerations must be revisited |
| A-04 | There is no need for A/B testing or dynamic content changes | If needed, the architecture must be rethought |
| A-05 | All translations are final and do not need dynamic updates without a new widget release | If translations need to update independently, an external translation endpoint would be required |
| A-06 | The widget is intended for desktop and mobile web browsers only, not for native apps or email | If native embedding is needed, a different approach is required |
| A-07 | The "center" position (center-center, i.e. dead center of the screen) is intentionally excluded from the position options | If it should be supported, it needs to be added to the specification |

---

## 18. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-01 | Host page CSS or JS breaks the widget | Widget renders incorrectly or is non-functional | Medium | Use Shadow DOM for style isolation; unique global namespace |
| R-02 | Widget is perceived as spam or malware by users | Users close it immediately; negative brand perception | Medium | Professional design; non-aggressive behavior; dismiss option |
| R-03 | Ad blockers may block the widget | Widget does not appear for a segment of users | Medium | Use a non-ad-like script name and hosting domain; avoid tracking patterns |
| R-04 | CSP restrictions on host pages prevent rendering | Widget does not appear on security-conscious sites | Low-Medium | Document CSP requirements; use Shadow DOM for style isolation |
| R-05 | Bundle size exceeds target due to embedded logo/translations | Slower load times; performance impact on host page | Low | Optimize SVG; minify translations; tree-shake unused code |
| R-06 | Charity URL becomes invalid or changes | "Donate" button leads to a dead link | Low | Monitor URL; version the widget; consider a redirect URL |
| R-07 | Missing accessibility label translations delay launch | Cannot ship a fully accessible product | Low | Resolve OQ-04 before implementation begins; can default to English |

---

## 19. Open Questions

These must be resolved before implementation begins. Items marked **[BLOCKER]** prevent implementation of the affected feature area.

| ID | Question | Context | Blocked Area |
|---|---|---|---|
| ~~**OQ-01**~~ | ~~Should Polish (`pl`) be included?~~ **RESOLVED: Yes, Polish is included.** | -- | -- |
| ~~**OQ-02**~~ | ~~What is the "Support" action text in each language?~~ **RESOLVED: eng=Support, ukr=Підтримати, de=Unterstützen, fr=Soutenir, cs=Podpořit, pl=Wesprzeć** | -- | -- |
| ~~**OQ-03**~~ | ~~What is the "Donate" button text in each language?~~ **RESOLVED: eng=Donate, ukr=Задонатити, de=Spenden, fr=Faire un don, cs=Darovat, pl=Wpłacić darowiznę** | -- | -- |
| ~~**OQ-04**~~ | ~~Accessibility labels for interactive controls~~ **RESOLVED: Collapse labels provided in all languages (eng=Collapse, ukr=Згорнути, de=Einklappen, pl=Zwinąć, cs=Sbalit, fr=Réduire). No dismiss control needed.** | -- | -- |
| ~~**OQ-05**~~ | ~~What is the exact English header text?~~ **RESOLVED: "Help save lives in Ukraine"** | -- | -- |
| ~~**OQ-06**~~ | ~~Should the widget support dismissal?~~ **RESOLVED: No. The widget is always present and cannot be dismissed.** | -- | -- |
| ~~**OQ-07**~~ | ~~What is the exact donation URL?~~ **RESOLVED: `https://www.sternenkofund.org/en/fundraisings/shahedoriz`** | -- | -- |
| ~~**OQ-08**~~ | ~~CDN hosting URL~~ **RESOLVED: TBD — some CDN, to be determined later. Non-blocking for development.** | -- | -- |
| ~~**OQ-09**~~ | ~~Expand direction~~ **RESOLVED: Top positions expand downward, bottom positions expand upward, center-left expands rightward, center-right expands leftward.** | -- | -- |
| ~~**OQ-10**~~ | ~~Dark-mode logo variant~~ **RESOLVED: Add a contrasting background behind the logo in dark mode (no separate logo variant).** | -- | -- |
| ~~**OQ-11**~~ | ~~Mobile behavior for center positions~~ **RESOLVED: On mobile, `center-left` repositions to `bottom-left`, `center-right` repositions to `bottom-right` (switching to horizontal layout).** | -- | -- |
| ~~**OQ-12**~~ | ~~Event callbacks~~ **RESOLVED: No. No event callbacks for now.** | -- | -- |
| ~~**OQ-13**~~ | ~~Language code format~~ **RESOLVED: Use ISO standard. Czech is `cs` (not `cz`).** | -- | -- |

---

## Appendix A -- Translation Reference Table

### Header Text

| Language | Code | Header Text |
|---|---|---|
| English | `eng` | Help save lives in Ukraine |
| Ukrainian | `ukr` | Допоможіть врятувати життя в Україні |
| German | `de` | Helfen Sie, Leben in der Ukraine zu retten |
| French | `fr` | Aidez à sauver des vies en Ukraine |
| Czech | `cs` | Pomozte zachraňovat životy na Ukrajině |
| Polish | `pl` | Pomóż ratować życie w Ukrainie |

### Body Text

| Language | Code | Body Text |
|---|---|---|
| English | `eng` | Every night, Russia attacks Ukraine with strike drones. They kill civilians and destroy cities. Interceptor drones make it possible to stop these attacks in the sky. Your donation will help the Ukrainian army shoot down enemy drones and save lives. Support the Armed Forces of Ukraine! |
| Ukrainian | `ukr` | Щоночі Росія атакує Україну ударними дронами. Вони вбивають мирних людей і руйнують міста. Дрони-перехоплювачі дозволяють зупиняти ці атаки в небі. Ваш донат допоможе українській армії збивати ворожі дрони і рятувати життя. Підтримайте ЗСУ! |
| German | `de` | Jede Nacht greift Russland die Ukraine mit Angriffsdrohnen an. Sie töten Zivilisten und zerstören Städte. Abfangdrohnen ermöglichen es, diese Angriffe am Himmel zu stoppen. Ihre Spende hilft der ukrainischen Armee, feindliche Drohnen abzuschießen und Leben zu retten. Unterstützen Sie die Streitkräfte der Ukraine! |
| French | `fr` | Chaque nuit, la Russie attaque l'Ukraine avec des drones d'attaque. Ils tuent des civils et détruisent des villes. Les drones intercepteurs permettent d'arrêter ces attaques dans le ciel. Votre don aidera l'armée ukrainienne à abattre les drones ennemis et à sauver des vies. Soutenez les Forces armées ukrainiennes ! |
| Czech | `cs` | Každou noc Rusko útočí na Ukrajinu údernými drony. Zabíjejí civilisty a ničí města. Záchytné drony umožňují tyto útoky zastavit na obloze. Váš dar pomůže ukrajinské armádě sestřelovat nepřátelské drony a zachraňovat životy. Podpořte Ozbrojené síly Ukrajiny! |
| Polish | `pl` | Każdej nocy Rosja atakuje Ukrainę dronami uderzeniowymi. Zabijają one cywilów i niszczą miasta. Drony przechwytujące pozwalają zatrzymać te ataki na niebie. Twoja darowizna pomoże ukraińskiej armii zestrzeliwać wrogie drony i ratować życie. Wesprzyj Siły Zbrojne Ukrainy! |

### Action Text

| Language | Code | "Support" Action | "Donate" Button |
|---|---|---|---|
| English | `eng` | Support | Donate |
| Ukrainian | `ukr` | Підтримати | Задонатити |
| German | `de` | Unterstützen | Spenden |
| French | `fr` | Soutenir | Faire un don |
| Czech | `cs` | Podpořit | Darovat |
| Polish | `pl` | Wesprzeć | Wpłacić darowiznę |

---

## Appendix B -- Jira-Ready Stories

> **Note:** These stories can be created once all **[BLOCKER]** open questions are resolved. They are structured for immediate import into Jira.

### Epic: Sternenko Widget

**Epic Description:** Build and deploy a standalone, embeddable JavaScript widget that promotes Sternenko's drone fund for the Armed Forces of Ukraine. The widget is a localized popup with collapsed/expanded states, configurable position and color scheme, distributed as a single script file.

---

### Story 1: Widget Script Initialization and Auto-Configuration

**Title:** Widget auto-initializes from script tag data attributes

**Description:**
As a website owner, I want the widget to automatically initialize when the script tag loads, reading configuration from data attributes, so that I can embed it without writing any JavaScript.

**Acceptance Criteria:**
```
Given a page with <script src="sternenko-widget.js" data-position="bottom-right" data-color-scheme="auto" data-lang="eng">
When the script loads
Then the widget renders in the bottom-right corner, with auto color scheme, in English, in collapsed state

Given a page with <script src="sternenko-widget.js"> (no data attributes)
When the script loads
Then the widget renders with defaults: bottom-right, auto color scheme, English

Given a page with <script src="sternenko-widget.js" data-position="invalid-value">
When the script loads
Then the widget renders at bottom-right (default) and a console.warn is emitted
```

**Definition of Done:**
- Script loads without blocking host page rendering
- Data attributes are correctly parsed
- Invalid values fall back to defaults with console warning
- `sternenko-widget:ready` event is dispatched on window
- Unit tests cover all configuration parsing scenarios

**Labels:** `widget`, `initialization`, `configuration`

---

### Story 2: Collapsed State Rendering

**Title:** Widget displays collapsed state with logo, header, and support action

**Description:**
As a website visitor, I want to see a compact widget with a logo, headline, and "Support" link so that I become aware of the drone fund without it being intrusive.

**Acceptance Criteria:**
```
Given the widget is in collapsed state
When the visitor views the page
Then the widget displays the logo, localized header text, and "Support" action

Given the widget is in collapsed state with lang="ukr"
When the visitor views the page
Then the header text is "Допоможіть врятувати життя в Україні"

Given the widget is in collapsed state at position "center-left"
When the visitor views the page
Then the widget uses vertical layout (elements stacked)

Given the widget is in collapsed state at position "bottom-right"
When the visitor views the page
Then the widget uses horizontal layout (elements in a row)
```

**Definition of Done:**
- Logo renders correctly in both light and dark schemes
- Header text renders in all supported languages
- Layout switches between horizontal and vertical based on position
- Widget is keyboard-accessible
- Visual tests confirm rendering across browsers

**Labels:** `widget`, `ui`, `collapsed-state`

---

### Story 3: Expanded State Rendering and Transitions

**Title:** Widget expands to show body text and donate button when "Support" is clicked

**Description:**
As a website visitor, I want to click "Support" and see more information about the cause plus a "Donate" button so that I can learn more and decide whether to donate.

**Acceptance Criteria:**
```
Given the widget is in collapsed state
When the visitor clicks "Support"
Then the widget smoothly animates to expanded state showing logo, header, body text, and "Donate" button
And the "Support" action is hidden
And a collapse control is visible

Given the widget is in expanded state
When the visitor clicks the collapse control
Then the widget smoothly animates back to collapsed state

Given the user has prefers-reduced-motion: reduce enabled
When any state transition occurs
Then the transition is instantaneous (no animation)

Given the widget is in expanded state
When the visitor presses the Escape key
Then the widget collapses
```

**Definition of Done:**
- Expand/collapse animations work smoothly (200-300ms)
- prefers-reduced-motion is respected
- Focus management works correctly during transitions
- ARIA attributes update (e.g., aria-expanded)
- Tests cover transition behavior

**Labels:** `widget`, `ui`, `expanded-state`, `animation`

---

### Story 4: Donate Button Behavior

**Title:** Donate button opens charity URL in a new tab

**Description:**
As a website visitor, I want to click "Donate" and be taken to the charity donation page in a new tab so that I can contribute without losing my place on the current site.

**Acceptance Criteria:**
```
Given the widget is in expanded state
When the visitor clicks "Donate"
Then a new browser tab opens to the hardcoded donation URL
And the link has rel="noopener noreferrer"
And the widget collapses back to the collapsed state on the original page

Given any configuration
When the widget renders
Then the donation URL is not configurable via data attributes or JS API
```

**Definition of Done:**
- New tab opens with correct URL
- Security attributes are present
- Widget state is preserved after click
- URL is hardcoded and not externally configurable

**Labels:** `widget`, `donate`, `security`

---

### Story 5: Color Scheme Support

**Title:** Widget supports light, dark, and auto color schemes

**Description:**
As a website owner, I want to configure the widget's color scheme so that it matches my site's visual design.

**Acceptance Criteria:**
```
Given colorScheme is "light"
When the widget renders
Then the light palette is applied regardless of system preference

Given colorScheme is "dark"
When the widget renders
Then the dark palette is applied regardless of system preference

Given colorScheme is "auto" and the user's system is in dark mode
When the widget renders
Then the dark palette is applied

Given colorScheme is "auto" and the user toggles system dark mode
When the system preference changes
Then the widget dynamically switches palette without page reload
```

**Definition of Done:**
- Both palettes meet WCAG AA contrast requirements
- Auto mode responds to system changes in real time
- Fallback to light when prefers-color-scheme is unsupported
- Visual tests for both palettes

**Labels:** `widget`, `ui`, `theming`

---

### Story 6: Positioning and Layout

**Title:** Widget renders at configured position with correct layout orientation

**Description:**
As a website owner, I want to choose from 8 positions so that the widget does not conflict with my site's UI elements.

**Acceptance Criteria:**
```
Given position is "bottom-right"
When the widget renders
Then it appears fixed to the bottom-right of the viewport with horizontal layout

Given position is "center-left"
When the widget renders
Then it appears fixed to the middle of the left edge with vertical layout

Given the user scrolls the page
When the widget is visible
Then the widget remains in its fixed position

Given the browser window is resized
When the widget is visible
Then the widget repositions correctly and does not overflow the viewport
```

**Definition of Done:**
- All 8 positions render correctly
- Horizontal layout for 6 positions, vertical for 2
- Fixed positioning survives scroll
- Responsive to viewport resize
- No viewport overflow on reasonable screen sizes

**Labels:** `widget`, `ui`, `positioning`, `layout`

---

### Story 7: JavaScript API

**Title:** Widget exposes SternenkoWidget.init() and SternenkoWidget.destroy() API

**Description:**
As a website owner building an SPA, I want to programmatically initialize and destroy the widget so that I can control its lifecycle within my application.

**Acceptance Criteria:**
```
Given the script is loaded
When SternenkoWidget.init({ position: 'top-left', colorScheme: 'dark', lang: 'de' }) is called
Then the widget renders with those options

Given the widget is already initialized
When SternenkoWidget.init() is called again
Then the previous instance is destroyed and a new one is created

Given the widget is initialized
When SternenkoWidget.destroy() is called
Then all widget DOM elements are removed and all event listeners are cleaned up

Given JS API options and data attributes both exist
When the widget initializes
Then JS API options take precedence
```

**Definition of Done:**
- init() and destroy() work correctly
- No memory leaks after destroy()
- Re-initialization works cleanly
- API priority over data attributes is verified
- Unit tests cover all API scenarios

**Labels:** `widget`, `api`, `spa`

---

### Story 8: Style Isolation

**Title:** Widget styles are isolated from host page

**Description:**
As a website owner, I want the widget's styles to be fully isolated so that it does not break my site's design and my site's styles do not break the widget.

**Acceptance Criteria:**
```
Given a host page with aggressive CSS resets (e.g., * { margin: 0; padding: 0; box-sizing: border-box; })
When the widget renders
Then the widget appears correctly, unaffected by the host's reset

Given the widget is rendered
When the host page inspects its own elements' styles
Then no widget styles have leaked into host page elements
```

**Definition of Done:**
- Shadow DOM or equivalent isolation is implemented
- Widget renders correctly on pages with Bootstrap, Tailwind, and CSS resets
- No global CSS side effects
- Integration tests on diverse host pages

**Labels:** `widget`, `css`, `isolation`

---

### Story 9: Internationalization

**Title:** Widget displays all text in the configured language

**Description:**
As a website owner, I want to set the widget's language so that my audience sees content in their language.

**Acceptance Criteria:**
```
Given lang="ukr"
When the widget renders in collapsed state
Then header text and support action are in Ukrainian

Given lang="ukr"
When the widget is in expanded state
Then body text and donate button are in Ukrainian

Given lang="invalid"
When the widget renders
Then it falls back to English with a console.warn

Given all supported languages
When the widget renders for each
Then all text strings are correctly displayed with proper Unicode characters (diacritics, Cyrillic, etc.)
```

**Definition of Done:**
- All provided translations render correctly
- Fallback behavior works
- All Unicode characters display correctly
- Text does not overflow widget bounds in any language

**Labels:** `widget`, `i18n`, `translations`

---

*End of Jira-ready stories. Additional stories for dismiss functionality, mobile responsiveness, and accessibility hardening should be created once the corresponding open questions are resolved.*

---

**Document End**

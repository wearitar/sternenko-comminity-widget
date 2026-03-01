# Sternenko Widget

Embeddable charity promotion widget for the [Sternenko Community Foundation](https://www.sternenkofund.org/). Raises awareness and drives donations to fund interceptor drones that protect Ukrainian civilians from nightly Russian drone attacks.

## Features

- **Zero dependencies** — single self-contained JS file (~45KB minified, ~14KB gzipped)
- **Shadow DOM isolation** — styles never leak into or out of the host page
- **8 viewport positions** — top/bottom/center edges and corners
- **Light, dark, and auto color schemes** — auto follows `prefers-color-scheme`
- **6 languages** — English, Ukrainian, German, French, Czech, Polish
- **Dismissable** — users can dismiss the widget; it reappears after 12 hours
- **Responsive** — adapts layout (horizontal/vertical) based on position; mobile-friendly
- **Accessible** — ARIA roles, keyboard navigation, focus management, reduced-motion support
- **Print-friendly** — hidden when printing

## Quick Start

Add a single `<script>` tag before `</body>`:

```html
<script src="https://your-cdn.com/sternenko-widget.js?position=bottom-right&colorScheme=auto&lang=eng"></script>
```

The widget auto-initializes and appears immediately.

## Configuration

Configuration is passed via **URL query parameters** on the script `src`. Data attributes on the `<script>` tag can also be used as overrides.

### Options

| Option | Query Param | Data Attribute | Values | Default |
|---|---|---|---|---|
| Position | `position` | `data-position` | `top-left`, `top-center`, `top-right`, `center-left`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right` | `bottom-right` |
| Color Scheme | `colorScheme` | `data-color-scheme` | `light`, `dark`, `auto` | `auto` |
| Language | `lang` | `data-lang` | `eng`, `ukr`, `de`, `fr`, `cs`, `pl` | `eng` |

### Examples

```html
<!-- Bottom-right, dark theme, Ukrainian -->
<script src="widget.js?position=bottom-right&colorScheme=dark&lang=ukr"></script>

<!-- Top-left, auto theme, German -->
<script src="widget.js?position=top-left&colorScheme=auto&lang=de"></script>

<!-- Using data attributes (override query params) -->
<script
  src="widget.js?position=bottom-right&colorScheme=auto&lang=eng"
  data-position="top-center"
></script>
```

### Layout Behavior

- **Corner and edge positions** (`top-left`, `bottom-right`, etc.) — horizontal layout, expands downward/upward
- **Center-left / center-right** — vertical layout, expands sideways
- **Center positions on mobile** — reposition to bottom edge automatically

## Dismiss Behavior

Users can dismiss the widget by clicking the subtle "x" button in the top-right corner (visible on hover). Once dismissed:

- The widget is removed from the page
- A timestamp is stored in `localStorage` (`sternenko-widget-dismissed`)
- The widget will not appear again for **12 hours**
- After 12 hours, the widget reappears on the next page load

## JavaScript API

The widget exposes `window.SternenkoWidget` after initialization:

```js
// Re-initialize with different config
window.SternenkoWidget.init({
  position: 'top-center',
  colorScheme: 'dark',
  lang: 'ukr',
});

// Remove widget from the page
window.SternenkoWidget.destroy();

// Access current widget instance
window.SternenkoWidget.instance;
```

### Events

```js
// Fires when the widget is mounted and ready
window.addEventListener('sternenko-widget:ready', () => {
  console.log('Widget loaded');
});
```

## Development

### Prerequisites

- Node.js 18+
- Yarn

### Setup

```bash
yarn install
```

### Commands

| Command | Description |
|---|---|
| `yarn build` | Production build (minified + sourcemap), copies to `docs/` |
| `yarn build:dev` | Development build (unminified + sourcemap), copies to `docs/` |
| `yarn watch` | Watch mode with auto-rebuild |
| `yarn type-check` | TypeScript type checking |
| `yarn demo` | Serve demo page at `http://localhost:3333` |

### Project Structure

```
sternenko-widget/
  src/
    index.ts          # Entry point, auto-init logic
    widget.ts         # Widget class (orchestrator, dismiss logic)
    dom.ts            # Shadow DOM construction
    types.ts          # TypeScript interfaces
    config.ts         # Config resolution & defaults
    constants.ts      # Donate URL, animation timings, dismiss TTL
    translations.ts   # All 6 language translations
    position.ts       # Position CSS, border-radius, entrance animations
    logo.ts           # Sternenko Fund emblem SVG
    icons.ts          # UI icons (chevron, dismiss, arrow)
    styles/
      index.ts        # Style aggregator
      tokens.ts       # CSS custom properties (light/dark themes)
      base.ts         # Resets, print, reduced-motion
      layout.ts       # Widget dimensions, expand/collapse transitions
      components.ts   # Buttons, text, logo, dismiss styling
      responsive.ts   # Mobile breakpoint overrides
  docs/
    index.html        # Interactive configuration & preview page (GitHub Pages)
    .nojekyll         # Bypasses Jekyll processing
  dist/               # Build output (git-ignored)
    sternenko-widget.js
    sternenko-widget.js.map
```

## How It Works

1. The `<script>` tag loads and calls `autoInit()` on DOMContentLoaded
2. Config is parsed from query params, then data attributes (as overrides)
3. If the widget was dismissed within the last 12 hours, initialization is skipped
4. A `<div>` host element is appended to `<body>` with an attached Shadow DOM
5. All styles and DOM are encapsulated inside the shadow root
6. The widget shows a collapsed banner with the fund logo, header text, and a "Details" button
7. Clicking "Details" expands the widget to show the full description and a "Donate" button
8. "Donate" opens the [Sternenko Fund donation page](https://www.sternenkofund.org/en/fundraisings/shahedoriz) in a new tab
9. The collapse button (or Escape key) closes the expanded view
10. The dismiss button (top-right corner, visible on hover) removes the widget for 12 hours

## Deployment

The `docs/` folder is configured for [GitHub Pages](https://pages.github.com/). Build outputs are automatically copied there by `yarn build`.

To deploy:
1. Run `yarn build`
2. Commit and push — GitHub Pages serves from the `docs/` folder on the `main` branch

## Browser Support

ES2020+ — all modern browsers (Chrome, Firefox, Safari, Edge). No IE11 support.

## License

MIT

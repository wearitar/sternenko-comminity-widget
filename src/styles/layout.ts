import type { WidgetPosition } from '../types';
import {
  getPositionCSS,
  getEntranceTransforms,
  getChevronRotation,
  getBorderRadius,
  isVerticalPosition,
} from '../position';
import { lightTokens, darkTokens } from './tokens';

/** Host-level positioning, theming, and entrance animation */
export function buildHostStyles(position: WidgetPosition): string {
  const posCSS = getPositionCSS(position);
  const entrance = getEntranceTransforms(position);

  return `
:host {
  ${lightTokens}
  display: block;
  position: fixed;
  ${posCSS}
  z-index: 2147483647;
  pointer-events: none;
}

:host([data-theme="dark"]) { ${darkTokens} }

@media (prefers-color-scheme: dark) {
  :host([data-theme="auto"]) { ${darkTokens} }
}

:host([data-theme="auto"]) .widget {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}

@keyframes sw-entrance {
  from { opacity: 0; transform: ${entrance.from}; }
  to   { opacity: 1; transform: ${entrance.to}; }
}
`;
}

/** Widget container and header row layout */
export function buildContainerStyles(position: WidgetPosition): string {
  const isVertical = isVerticalPosition(position);
  const radius = getBorderRadius(position);
  const chevronRot = getChevronRotation(position);

  return `
.widget {
  position: relative;
  pointer-events: auto;
  font-family: 'FixelDisplay', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  background: var(--sw-bg);
  color: var(--sw-text-primary);
  border: 1px solid var(--sw-border);
  border-radius: ${radius};
  box-shadow: var(--sw-shadow);
  animation: sw-entrance 300ms ease-out 200ms both;
  ${isVertical ? 'width: 10rem;' : 'width: 22.5rem; max-width: calc(100vw - 2rem);'}
  overflow: hidden;
}

.widget:hover:not([data-expanded="true"]) {
  background: color-mix(in srgb, var(--sw-bg) 98%, var(--sw-accent) 2%);
}

.header-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
}

.collapse-control .chevron-icon {
  width: 1rem;
  height: 1rem;
  transform: rotate(${chevronRot}deg);
}
`;
}

/** Expandable region styles */
export function buildExpandableStyles(isVertical: boolean): string {
  if (isVertical) {
    // Vertical: base styles only — buildVerticalStyles overrides with max-width animation
    return `
.expandable-region {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 250ms ease-out, opacity 200ms ease-out;
}
.expandable-region[data-expanded="true"] {
  max-height: none;
  opacity: 1;
  overflow-y: auto;
}
`;
  }

  // Horizontal: widget has fixed width, simple max-height animation
  return `
.expandable-region {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 250ms ease-out, opacity 200ms ease-out;
}
.expandable-region[data-expanded="true"] {
  max-height: min(31.25rem, calc(100vh - 7.5rem));
  opacity: 1;
  overflow-y: auto;
}
`;
}

/** Vertical-specific layout overrides for center-left / center-right */
export function buildVerticalStyles(position: WidgetPosition): string {
  if (!isVerticalPosition(position)) return '';

  const isLeft = position === 'center-left';

  return `
/* Vertical collapsed */
.widget:not([data-expanded="true"]) .header-row {
  flex-direction: column;
  text-align: center;
  padding: 1rem;
}
.widget:not([data-expanded="true"]) .header-text {
  max-width: 8rem;
}

/* Vertical expanded — two-column */
.widget[data-expanded="true"] {
  display: flex;
  flex-direction: ${isLeft ? 'row' : 'row-reverse'};
  width: auto;
  max-width: min(30rem, calc(100vw - 2rem));
}
.widget[data-expanded="true"] .header-row {
  flex-direction: column;
  width: 5rem;
  padding: 1rem 0.75rem;
  gap: 0.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}
.widget[data-expanded="true"] .header-text { display: none; }
.widget[data-expanded="true"] .support-action { display: none; }
.widget[data-expanded="true"] .collapse-control { display: flex; }

/* Override expandable region to use max-width instead of max-height */
.expandable-region {
  max-height: 0;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 250ms ease-out, max-height 250ms ease-out, opacity 200ms ease-out;
}
.expandable-region[data-expanded="true"] {
  max-height: none;
  max-width: 25rem;
  opacity: 1;
}
.expandable-region .expanded-content {
  width: 20rem;
  padding: 1rem;
}
.expandable-region .expanded-content .expanded-header {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--sw-text-primary);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.expandable-region .expanded-content .body-text {
  padding: 0;
  margin-bottom: 1rem;
}
.expandable-region .expanded-content .action-row {
  padding: 0;
  justify-content: ${isLeft ? 'flex-end' : 'flex-start'};
}
.expandable-region .separator { display: none; }
`;
}

import type { WidgetPosition } from '../types';
import { isVerticalPosition } from '../position';

/** Mobile breakpoint styles (<30rem / 480px) */
export function buildMobileStyles(position: WidgetPosition): string {
  const isVertical = isVerticalPosition(position);
  const isLeft = position === 'center-left';
  const isCenterH = position === 'top-center' || position === 'bottom-center';

  return `
@media (max-width: 29.99rem) {
  ${isVertical ? buildVerticalMobileOverrides(isLeft) : ''}
  ${isCenterH ? buildCenterHorizontalMobileOverrides() : ''}
}
`;
}

/** Top-center/bottom-center: drop centering on narrow screens */
function buildCenterHorizontalMobileOverrides(): string {
  return `
  :host {
    left: 1rem !important;
    transform: none !important;
  }
  .widget {
    max-width: calc(100vw - 2rem);
  }
  `;
}

/** Center-left/center-right positions reposition on mobile */
function buildVerticalMobileOverrides(isLeft: boolean): string {
  return `
  :host {
    top: auto !important;
    ${isLeft ? 'left: 1rem !important;' : 'right: 1rem !important;'}
    bottom: 1rem !important;
    transform: none !important;
  }
  .widget {
    border-radius: 0.75rem;
    width: auto;
  }
  .widget:not([data-expanded="true"]) .header-row {
    flex-direction: row;
    text-align: left;
    padding: 0.75rem 1rem;
  }
  .widget:not([data-expanded="true"]) .header-text {
    max-width: none;
  }
  .widget[data-expanded="true"] {
    flex-direction: column;
    max-width: calc(100vw - 2rem);
  }
  .widget[data-expanded="true"] .header-row {
    flex-direction: row;
    width: auto;
    padding: 0.75rem 1rem;
    justify-content: flex-start;
  }
  .widget[data-expanded="true"] .header-text { display: block; }
  .expandable-region {
    max-width: none !important;
    max-height: 0;
    transition: max-height 250ms ease-out, opacity 200ms ease-out;
  }
  .expandable-region[data-expanded="true"] {
    max-width: none !important;
    max-height: min(31.25rem, calc(100vh - 7.5rem));
  }
  .expandable-region .expanded-content { width: auto; }
  .expandable-region .expanded-content .expanded-header { display: none; }
  .expandable-region .separator { display: block; }
  .expandable-region .expanded-content .body-text { padding: 0.75rem 1rem 0; }
  .expandable-region .expanded-content .action-row { padding: 1rem 1rem 0.75rem; justify-content: flex-end; }
  `;
}

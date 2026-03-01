import type { Translation } from './types';
import { LOGO_SVG } from './logo';
import { ARROW_SVG, CHEVRON_SVG, DISMISS_SVG } from './icons';
import { DONATE_URL } from './constants';

/** References to key DOM elements inside the widget */
export interface WidgetElements {
  host: HTMLElement;
  shadow: ShadowRoot;
  widget: HTMLElement;
  supportBtn: HTMLButtonElement;
  collapseBtn: HTMLButtonElement;
  dismissBtn: HTMLButtonElement;
  expandableRegion: HTMLElement;
}

interface BuildDomOptions {
  translation: Translation;
  langTag: string;
  position: string;
  colorScheme: string;
  isVertical: boolean;
  styles: string;
  onExpand: () => void;
  onCollapse: () => void;
  onDonate: () => void;
  onDismiss: () => void;
}

/** Create the full widget DOM tree with Shadow DOM isolation */
export function buildWidgetDom(opts: BuildDomOptions): WidgetElements {
  const { translation: t, langTag, position, colorScheme, isVertical, styles } = opts;

  // Host + Shadow DOM
  const host = document.createElement('div');
  host.classList.add('sternenko-widget-host');
  const shadow = host.attachShadow({ mode: 'open' });
  host.setAttribute('data-theme', colorScheme);

  // Styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  // Widget container
  const widget = document.createElement('div');
  widget.classList.add('widget');
  widget.setAttribute('role', 'complementary');
  widget.setAttribute('aria-label', t.widgetAriaLabel);
  widget.setAttribute('aria-expanded', 'false');
  widget.setAttribute('lang', langTag);
  widget.setAttribute('data-position', position);

  // Header row
  const headerRow = buildHeaderRow(t, opts.onExpand, opts.onCollapse);
  widget.appendChild(headerRow.row);

  // Expandable region
  const expandableRegion = isVertical
    ? buildVerticalExpandable(t, position, opts.onDonate)
    : buildHorizontalExpandable(t, opts.onDonate);
  widget.appendChild(expandableRegion);

  shadow.appendChild(widget);

  // Dismiss button (outside .widget to avoid overflow clipping)
  const dismissBtn = buildDismissButton(t, opts.onDismiss);
  shadow.appendChild(dismissBtn);

  return {
    host,
    shadow,
    widget,
    supportBtn: headerRow.supportBtn,
    collapseBtn: headerRow.collapseBtn,
    dismissBtn,
    expandableRegion,
  };
}

function buildHeaderRow(
  t: Translation,
  onExpand: () => void,
  onCollapse: () => void,
): { row: HTMLElement; supportBtn: HTMLButtonElement; collapseBtn: HTMLButtonElement } {
  const row = document.createElement('div');
  row.classList.add('header-row');

  // Logo
  const logo = document.createElement('div');
  logo.classList.add('logo');
  logo.setAttribute('aria-hidden', 'true');
  logo.innerHTML = LOGO_SVG;
  row.appendChild(logo);

  // Header text
  const headerText = document.createElement('strong');
  headerText.classList.add('header-text');
  headerText.textContent = t.header;
  row.appendChild(headerText);

  // Support action
  const supportBtn = document.createElement('button');
  supportBtn.classList.add('support-action');
  supportBtn.setAttribute('aria-expanded', 'false');
  supportBtn.innerHTML = `${t.supportAction} <span class="arrow-icon">${ARROW_SVG}</span>`;
  supportBtn.addEventListener('click', onExpand);
  row.appendChild(supportBtn);

  // Collapse control
  const collapseBtn = document.createElement('button');
  collapseBtn.classList.add('collapse-control');
  collapseBtn.setAttribute('aria-label', t.collapseAriaLabel);
  collapseBtn.hidden = true;
  collapseBtn.innerHTML = CHEVRON_SVG;
  collapseBtn.addEventListener('click', onCollapse);
  row.appendChild(collapseBtn);

  return { row, supportBtn, collapseBtn };
}

function buildDismissButton(t: Translation, onDismiss: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.classList.add('dismiss-control');
  btn.setAttribute('aria-label', t.dismissAriaLabel);
  btn.innerHTML = DISMISS_SVG;
  btn.addEventListener('click', onDismiss);
  return btn;
}

function buildHorizontalExpandable(t: Translation, onDonate: () => void): HTMLElement {
  const region = document.createElement('div');
  region.classList.add('expandable-region');
  region.setAttribute('data-expanded', 'false');

  const sep = createSeparator();
  region.appendChild(sep);

  const body = document.createElement('p');
  body.classList.add('body-text');
  body.textContent = t.body;
  region.appendChild(body);

  const actionRow = document.createElement('div');
  actionRow.classList.add('action-row');
  actionRow.appendChild(createDonateLink(t, onDonate));
  region.appendChild(actionRow);

  return region;
}

function buildVerticalExpandable(t: Translation, position: string, onDonate: () => void): HTMLElement {
  const region = document.createElement('div');
  region.classList.add('expandable-region');
  region.setAttribute('data-expanded', 'false');

  const sep = createSeparator();
  region.appendChild(sep);

  const content = document.createElement('div');
  content.classList.add('expanded-content');

  // Header (visible in vertical expanded)
  const header = document.createElement('div');
  header.classList.add('expanded-header');
  const headerSpan = document.createElement('span');
  headerSpan.textContent = t.header;
  header.appendChild(headerSpan);
  content.appendChild(header);

  const body = document.createElement('p');
  body.classList.add('body-text');
  body.textContent = t.body;
  content.appendChild(body);

  const actionRow = document.createElement('div');
  actionRow.classList.add('action-row');
  actionRow.appendChild(createDonateLink(t, onDonate));
  content.appendChild(actionRow);

  region.appendChild(content);
  return region;
}

function createSeparator(): HTMLHRElement {
  const sep = document.createElement('hr');
  sep.classList.add('separator');
  sep.setAttribute('aria-hidden', 'true');
  return sep;
}

function createDonateLink(t: Translation, onDonate: () => void): HTMLAnchorElement {
  const link = document.createElement('a');
  link.classList.add('donate-button');
  link.href = DONATE_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', t.donateAriaLabel);
  link.textContent = t.donateAction;
  link.addEventListener('click', onDonate);
  return link;
}

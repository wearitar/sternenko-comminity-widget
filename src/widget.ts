import type { SternenkoWidgetConfig, SternenkoWidgetState } from './types';
import { translations, langToBcp47 } from './translations';
import { resolveConfig, resolveTheme } from './config';
import { isVerticalPosition } from './position';
import { buildStyles } from './styles/index';
import { buildWidgetDom, type WidgetElements } from './dom';
import { ANIMATION } from './constants';

export class SternenkoWidget {
  private config: SternenkoWidgetConfig;
  private state: SternenkoWidgetState;
  private els: WidgetElements | null = null;
  private mediaQuery: MediaQueryList | null = null;
  private mobileQuery: MediaQueryList | null = null;
  private onThemeChange: (() => void) | null = null;
  private onMobileChange: (() => void) | null = null;

  constructor(config?: Partial<SternenkoWidgetConfig>) {
    this.config = resolveConfig(config);
    this.state = {
      expanded: false,
      resolvedTheme: resolveTheme(this.config.colorScheme),
      layout: isVerticalPosition(this.config.position) ? 'vertical' : 'horizontal',
      effectivePosition: this.config.position,
    };
  }

  init(): void {
    if (this.els) return;

    const t = translations[this.config.lang];
    const isVertical = isVerticalPosition(this.config.position);

    this.els = buildWidgetDom({
      translation: t,
      langTag: langToBcp47[this.config.lang],
      position: this.config.position,
      colorScheme: this.config.colorScheme,
      isVertical,
      styles: buildStyles(this.config.position),
      onExpand: () => this.expand(),
      onCollapse: () => this.collapse(),
      onDonate: () => requestAnimationFrame(() => this.collapse()),
    });

    // Escape key to collapse
    this.els.widget.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.state.expanded) {
        e.stopPropagation();
        this.collapse();
      }
    });

    document.body.appendChild(this.els.host);
    this.setupMediaListeners(isVertical);

    window.dispatchEvent(new CustomEvent('sternenko-widget:ready'));
  }

  private setupMediaListeners(isVertical: boolean): void {
    // Auto theme: listen for system preference changes
    if (this.config.colorScheme === 'auto') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.onThemeChange = () => {
        this.state.resolvedTheme = resolveTheme(this.config.colorScheme);
      };
      this.mediaQuery.addEventListener('change', this.onThemeChange);
    }

    // Center positions: collapse on mobile breakpoint change
    if (isVertical) {
      this.mobileQuery = window.matchMedia('(max-width: 479px)');
      this.onMobileChange = () => {
        if (this.state.expanded) this.collapse();
      };
      this.mobileQuery.addEventListener('change', this.onMobileChange);
    }
  }

  private expand(): void {
    if (this.state.expanded || !this.els) return;
    this.state.expanded = true;

    const { supportBtn, collapseBtn, expandableRegion, widget } = this.els;

    // Fade out support, then hide
    supportBtn.setAttribute('data-fading', 'true');
    setTimeout(() => {
      supportBtn.hidden = true;
      supportBtn.removeAttribute('data-fading');
    }, ANIMATION.supportFadeDuration);

    collapseBtn.hidden = false;
    expandableRegion.setAttribute('data-expanded', 'true');
    widget.setAttribute('aria-expanded', 'true');
    widget.setAttribute('data-expanded', 'true');

    setTimeout(() => collapseBtn.focus(), ANIMATION.expandDuration + 10);
  }

  private collapse(): void {
    if (!this.state.expanded || !this.els) return;
    this.state.expanded = false;

    const { supportBtn, collapseBtn, expandableRegion, widget } = this.els;

    expandableRegion.setAttribute('data-expanded', 'false');
    collapseBtn.hidden = true;
    supportBtn.hidden = false;
    widget.setAttribute('aria-expanded', 'false');
    widget.removeAttribute('data-expanded');

    setTimeout(() => supportBtn.focus(), ANIMATION.collapseDuration + 10);
  }

  destroy(): void {
    if (this.mediaQuery && this.onThemeChange) {
      this.mediaQuery.removeEventListener('change', this.onThemeChange);
    }
    if (this.mobileQuery && this.onMobileChange) {
      this.mobileQuery.removeEventListener('change', this.onMobileChange);
    }
    this.els?.host.remove();
    this.els = null;
  }
}

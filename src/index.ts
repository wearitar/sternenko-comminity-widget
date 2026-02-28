import type { SternenkoWidgetConfig, WidgetPosition, ColorScheme, Language } from './types';
import { SternenkoWidget } from './widget';

export type { SternenkoWidgetConfig, WidgetPosition, ColorScheme, Language };
export { SternenkoWidget };

// Auto-initialize from script tag query params (or data attributes as fallback)
function autoInit(): void {
  const scripts = document.querySelectorAll('script[src*="sternenko-widget"]');
  const scriptEl = scripts[scripts.length - 1] as HTMLScriptElement | undefined;

  const config: Partial<SternenkoWidgetConfig> = {};

  if (scriptEl) {
    // Try URL query params first
    try {
      const url = new URL(scriptEl.src);
      const pos = url.searchParams.get('position');
      if (pos) config.position = pos as WidgetPosition;
      const scheme = url.searchParams.get('colorScheme');
      if (scheme) config.colorScheme = scheme as ColorScheme;
      const lang = url.searchParams.get('lang');
      if (lang) config.lang = lang as Language;
    } catch { /* ignore parse errors */ }

    // Data attributes override query params
    const pos = scriptEl.getAttribute('data-position');
    if (pos) config.position = pos as WidgetPosition;
    const scheme = scriptEl.getAttribute('data-color-scheme');
    if (scheme) config.colorScheme = scheme as ColorScheme;
    const lang = scriptEl.getAttribute('data-lang');
    if (lang) config.lang = lang as Language;
  }

  const widget = new SternenkoWidget(config);
  widget.init();

  // Expose API on window
  (window as any).SternenkoWidget = {
    instance: widget,
    init: (cfg?: Partial<SternenkoWidgetConfig>) => {
      widget.destroy();
      const w = new SternenkoWidget(cfg);
      w.init();
      (window as any).SternenkoWidget.instance = w;
    },
    destroy: () => widget.destroy(),
  };
}

// Run auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

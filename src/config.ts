import type { SternenkoWidgetConfig, ColorScheme } from './types';
import { VALID_POSITIONS, VALID_SCHEMES, VALID_LANGS } from './constants';

const DEFAULTS: SternenkoWidgetConfig = {
  position: 'bottom-right',
  colorScheme: 'auto',
  lang: 'eng',
};

/** Merge partial config with defaults, validating each field */
export function resolveConfig(partial?: Partial<SternenkoWidgetConfig>): SternenkoWidgetConfig {
  const merged = { ...DEFAULTS, ...partial };

  if (!VALID_POSITIONS.includes(merged.position)) {
    console.warn(`[sternenko-widget] Invalid position "${merged.position}", falling back to "bottom-right".`);
    merged.position = 'bottom-right';
  }
  if (!VALID_SCHEMES.includes(merged.colorScheme)) {
    console.warn(`[sternenko-widget] Invalid colorScheme "${merged.colorScheme}", falling back to "auto".`);
    merged.colorScheme = 'auto';
  }
  if (!VALID_LANGS.includes(merged.lang)) {
    console.warn(`[sternenko-widget] Invalid lang "${merged.lang}", falling back to "eng".`);
    merged.lang = 'eng';
  }

  return merged;
}

/** Determine the effective theme based on scheme setting */
export function resolveTheme(scheme: ColorScheme): 'light' | 'dark' {
  if (scheme === 'dark') return 'dark';
  if (scheme === 'light') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

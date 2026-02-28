import type { WidgetPosition, ColorScheme, Language } from './types';

export const DONATE_URL = 'https://www.sternenkofund.org/en/fundraisings/shahedoriz';

export const VALID_POSITIONS: WidgetPosition[] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export const VALID_SCHEMES: ColorScheme[] = ['light', 'dark', 'auto'];

export const VALID_LANGS: Language[] = ['eng', 'ukr', 'de', 'fr', 'cs', 'pl'];

export const ANIMATION = {
  entranceDuration: 300,
  entranceDelay: 200,
  expandDuration: 250,
  collapseDuration: 200,
  supportFadeDuration: 150,
  hoverDuration: 150,
} as const;

export type WidgetPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type ColorScheme = 'light' | 'dark' | 'auto';

export type Language = 'eng' | 'ukr' | 'de' | 'fr' | 'cs' | 'pl';

export interface SternenkoWidgetConfig {
  position: WidgetPosition;
  colorScheme: ColorScheme;
  lang: Language;
}

export interface SternenkoWidgetState {
  expanded: boolean;
  resolvedTheme: 'light' | 'dark';
  layout: 'horizontal' | 'vertical';
  effectivePosition: WidgetPosition;
}

export interface Translation {
  header: string;
  body: string;
  supportAction: string;
  donateAction: string;
  collapseAriaLabel: string;
  dismissAriaLabel: string;
  donateAriaLabel: string;
  widgetAriaLabel: string;
}

export interface SternenkoWidgetAPI {
  init(config?: Partial<SternenkoWidgetConfig>): void;
  destroy(): void;
}

import type { WidgetPosition } from '../types';
import { isVerticalPosition } from '../position';
import { baseStyles } from './base';
import { componentStyles } from './components';
import { buildHostStyles, buildContainerStyles, buildExpandableStyles, buildVerticalStyles } from './layout';
import { buildMobileStyles } from './responsive';

/** Assemble all styles for a given widget position */
export function buildStyles(position: WidgetPosition): string {
  const isVertical = isVerticalPosition(position);

  return [
    buildHostStyles(position),
    baseStyles,
    buildContainerStyles(position),
    componentStyles,
    buildExpandableStyles(isVertical),
    buildVerticalStyles(position),
    buildMobileStyles(position),
  ].join('\n');
}

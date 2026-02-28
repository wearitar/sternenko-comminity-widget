import type { WidgetPosition } from './types';

export function isVerticalPosition(pos: WidgetPosition): boolean {
  return pos === 'center-left' || pos === 'center-right';
}

export function getPositionCSS(pos: WidgetPosition): string {
  const map: Record<WidgetPosition, string> = {
    'top-left': 'top:1rem;left:1rem;',
    'top-center': 'top:1rem;left:50%;transform:translateX(-50%);',
    'top-right': 'top:1rem;right:1rem;',
    'center-left': 'top:50%;left:0;transform:translateY(-50%);',
    'center-right': 'top:50%;right:0;transform:translateY(-50%);',
    'bottom-left': 'bottom:1rem;left:1rem;',
    'bottom-center': 'bottom:1rem;left:50%;transform:translateX(-50%);',
    'bottom-right': 'bottom:1rem;right:1rem;',
  };
  return map[pos] || map['bottom-right'];
}

export function getEntranceTransforms(pos: WidgetPosition): { from: string; to: string } {
  // These animate .widget inside the already-positioned :host — no centering transforms
  if (pos === 'top-center' || pos.startsWith('top')) {
    return { from: 'translateY(-0.5rem)', to: 'translateY(0)' };
  }
  if (pos === 'bottom-center' || pos.startsWith('bottom')) {
    return { from: 'translateY(0.5rem)', to: 'translateY(0)' };
  }
  if (pos === 'center-left') {
    return { from: 'translateX(-0.5rem)', to: 'translateX(0)' };
  }
  // center-right
  return { from: 'translateX(0.5rem)', to: 'translateX(0)' };
}

/** Chevron rotation in degrees: 0=up, 90=right, 180=down, 270=left */
export function getChevronRotation(pos: WidgetPosition): number {
  if (pos.startsWith('top')) return 0;
  if (pos.startsWith('bottom')) return 180;
  if (pos === 'center-left') return 270;
  return 90;
}

export function getBorderRadius(pos: WidgetPosition): string {
  if (!isVerticalPosition(pos)) return '0.75rem';
  if (pos === 'center-left') return '0 0.75rem 0.75rem 0';
  return '0.75rem 0 0 0.75rem';
}

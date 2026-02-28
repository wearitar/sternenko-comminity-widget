/** Global resets, print, and reduced-motion styles */
export const baseStyles = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0ms !important;
  }
}

@media print {
  :host { display: none !important; }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
`;

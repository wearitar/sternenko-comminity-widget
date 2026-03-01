/** Styles for individual widget components (logo, text, buttons, etc.) */
export const componentStyles = `
/* ---- LOGO ---- */
.logo {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sw-logo-bg);
}
.logo svg { width: 100%; height: 100%; }

/* ---- HEADER TEXT ---- */
.header-text {
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--sw-text-primary);
}

/* ---- SUPPORT ACTION ---- */
.support-action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  min-height: 2.75rem;
  min-width: 2.75rem;
  border: none;
  background: transparent;
  color: var(--sw-accent);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  border-radius: 0.5rem;
  white-space: nowrap;
  transition: background 150ms ease, color 150ms ease, opacity 150ms ease-out;
}
.support-action:hover {
  background: var(--sw-hover-tint);
  color: var(--sw-accent-hover);
}
.support-action:focus-visible {
  outline: 0.125rem solid var(--sw-focus-ring);
  outline-offset: 0.125rem;
}
.support-action:active { background: var(--sw-active-tint); }
.support-action .arrow-icon { width: 0.75rem; height: 0.75rem; flex-shrink: 0; }
.support-action[data-fading="true"] { opacity: 0; pointer-events: none; }
.support-action[hidden] { display: none; }

/* ---- COLLAPSE CONTROL ---- */
.collapse-control {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--sw-text-secondary);
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  transition: background 150ms ease;
}
.collapse-control::before {
  content: '';
  position: absolute;
  top: -0.25rem; left: -0.25rem; right: -0.25rem; bottom: -0.25rem;
}
.collapse-control:hover { background: var(--sw-hover-tint); }
.collapse-control:focus-visible {
  outline: 0.125rem solid var(--sw-focus-ring);
  outline-offset: 0.125rem;
}
.collapse-control:active { background: var(--sw-active-tint); }
.collapse-control[hidden] { display: none; }

/* ---- SEPARATOR ---- */
.separator {
  border: none;
  border-top: 1px solid var(--sw-border);
  margin: 0 1rem;
}

/* ---- BODY TEXT ---- */
.body-text {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--sw-text-secondary);
  padding: 0.75rem 1rem 0;
}

/* ---- ACTION ROW ---- */
.action-row {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1rem 0.75rem;
}

/* ---- DONATE BUTTON ---- */
.donate-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  min-height: 2.75rem;
  min-width: 7.5rem;
  background: var(--sw-button-bg);
  color: var(--sw-button-text);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 150ms ease, filter 150ms ease;
}
.donate-button:hover { background: var(--sw-button-hover-bg); }
.donate-button:focus-visible {
  outline: 0.125rem solid var(--sw-focus-ring);
  outline-offset: 0.125rem;
}
.donate-button:active { filter: brightness(0.88); }

/* ---- CLOSE (DISMISS) CONTROL ---- */
.dismiss-control {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--sw-surface);
  color: var(--sw-text-secondary);
  cursor: pointer;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 200ms ease, background 150ms ease, color 150ms ease;
  padding: 0;
  box-shadow: 0 0 0 1px var(--sw-border);
  z-index: 1;
}
.dismiss-control svg { width: 0.5rem; height: 0.5rem; }
.widget:hover .dismiss-control,
.dismiss-control:focus-visible { opacity: 0.6; }
.dismiss-control:hover { opacity: 1; background: var(--sw-hover-tint); color: var(--sw-text-primary); }
.dismiss-control:focus-visible {
  outline: 0.125rem solid var(--sw-focus-ring);
  outline-offset: 0.125rem;
  opacity: 1;
}
.dismiss-control:active { opacity: 1; background: var(--sw-active-tint); }
`;

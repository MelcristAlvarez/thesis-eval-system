/**
 * theme.js
 * Centralized design tokens for use inside JS/JSX components.
 * These mirror the CSS variables in global.css.
 */

export const colors = {
  bgBase:      "#0C0E13",
  bgSurface:   "#141720",
  bgElevated:  "#1C2030",
  bgOverlay:   "#232840",

  amber400:    "#F59E0B",
  amber300:    "#FCD34D",
  amber500:    "#D97706",
  amberGlow:   "rgba(245, 158, 11, 0.12)",
  amberBorder: "rgba(245, 158, 11, 0.25)",

  teal400:     "#2DD4BF",
  tealGlow:    "rgba(45, 212, 191, 0.10)",
  tealBorder:  "rgba(45, 212, 191, 0.20)",

  textPrimary:   "#F1F3F9",
  textSecondary: "#9AA3BC",
  textMuted:     "#5C6480",
  borderSubtle:  "rgba(255, 255, 255, 0.06)",
  borderDefault: "rgba(255, 255, 255, 0.10)",

  success:    "#22C55E",
  successBg:  "rgba(34, 197, 94, 0.10)",
  warning:    "#F59E0B",
  warningBg:  "rgba(245, 158, 11, 0.10)",
  danger:     "#EF4444",
  dangerBg:   "rgba(239, 68, 68, 0.10)",
  info:       "#60A5FA",
  infoBg:     "rgba(96, 165, 250, 0.10)",
};

export const typography = {
  display: "'Fraunces', Georgia, serif",
  body:    "'Plus Jakarta Sans', system-ui, sans-serif",
};

export const radius = {
  sm: "6px",
  md: "12px",
  lg: "18px",
  xl: "24px",
};

export const shadow = {
  sm:    "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
  md:    "0 4px 16px rgba(0,0,0,0.35)",
  lg:    "0 12px 40px rgba(0,0,0,0.45)",
  amber: "0 0 24px rgba(245, 158, 11, 0.15)",
};

export const layout = {
  sidebarWidth: "240px",
  headerHeight: "64px",
};

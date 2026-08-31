// Shared design tokens for the app.
// Screens and navigators import from here so colors/spacing stay consistent.

export const colors = {
  background: "#F5F1E8",
  navy: "#1B2A4A",
  primary: "#1B2A4A",
  accent: "#C9A24B",
  text: "#1A1A1A",
  textMuted: "#6B6B6B",
  white: "#FFFFFF",
  border: "#E0DCD1",
  error: "#B3261E",
  success: "#2E7D32",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  heading: { fontSize: 22, fontWeight: "700" },
  subheading: { fontSize: 16, fontWeight: "600" },
  body: { fontSize: 14, fontWeight: "400" },
};

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const font = {
  h1: { fontSize: 24, fontWeight: "700", color: colors.text },
  h3: { fontSize: 16, fontWeight: "600", color: colors.text },
  body: { fontSize: 14, fontWeight: "400", color: colors.text },
  muted: { fontSize: 13, fontWeight: "400", color: colors.textMuted },
};

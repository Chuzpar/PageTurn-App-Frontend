export const colors = {
  background: "#F5F1E8",
  card: "#FFFFFF",
  navy: "#1B2A4A",
  navyLight: "#2C3E63",
  gold: "#C9A227",
  text: "#20242E",
  textMuted: "#6B7280",
  border: "#E5DFD0",
  success: "#3E7A4F",
  danger: "#B3432B",
  white: "#FFFFFF",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radii = { sm: 6, md: 10, lg: 16, pill: 999 };

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
};

export const font = {
  h1: { fontSize: 26, fontWeight: "700", color: colors.navy },
  h2: { fontSize: 20, fontWeight: "700", color: colors.navy },
  h3: { fontSize: 16, fontWeight: "600", color: colors.navy },
  body: { fontSize: 14, color: colors.text },
  muted: { fontSize: 12, color: colors.textMuted },
};

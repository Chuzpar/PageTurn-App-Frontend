export const colors = {
	background: "#F7F9FC",
	card: "#FFFFFF",
	navy: "#17324D",
	gold: "#C9973E",
	text: "#18212B",
	textMuted: "#667382",
	border: "#DCE3EA",
	success: "#2E8B57",
	danger: "#C94C4C",
	white: "#FFFFFF",
};

export const spacing = {
	xs: 6,
	sm: 10,
	md: 16,
	lg: 24,
	xl: 36,
};

export const radii = {
	sm: 6,
	md: 10,
	pill: 999,
	lg: 14,
};

export const font = {
	h1: { fontSize: 28, fontWeight: "700", color: colors.navy },
	h3: { fontSize: 18, fontWeight: "700", color: colors.navy },
	body: { fontSize: 16, lineHeight: 24, color: colors.text },
	muted: { fontSize: 14, color: colors.textMuted },
};

export function formatCurrency(amount) {
	return `KSh ${Number(amount || 0).toLocaleString("en-KE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

export const colors = {
	background: "#F8F4EC",
	card: "#FFFFFF",
	navy: "#1F2F50",
	gold: "#B8873E",
	text: "#263044",
	textMuted: "#687184",
	border: "#E8DECC",
	success: "#26834C",
	danger: "#B44D38",
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
	h1: { fontFamily: "Georgia", fontSize: 28, fontWeight: "700", color: colors.navy },
	h3: { fontFamily: "Georgia", fontSize: 18, fontWeight: "700", color: colors.navy },
	body: { fontSize: 16, lineHeight: 24, color: colors.text },
	muted: { fontSize: 14, color: colors.textMuted },
};

export function formatCurrency(amount) {
	return `KSh ${Number(amount || 0).toLocaleString("en-KE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
}

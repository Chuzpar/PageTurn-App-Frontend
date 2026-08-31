import React from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { colors, font, radii, spacing } from "../theme";

export function Screen({ children, style }) {
	return (
		<ScrollView contentContainerStyle={[styles.screen, style]} keyboardShouldPersistTaps="handled">
			{children}
		</ScrollView>
	);
}

export function Field({ label, style, ...props }) {
	return (
		<View style={[styles.field, style]}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<TextInput
				{...props}
				style={styles.input}
				placeholderTextColor={colors.textMuted}
			/>
		</View>
	);
}

export function PrimaryButton({ title, loading = false, disabled, style, ...props }) {
	return (
		<Pressable
			{...props}
			disabled={disabled || loading}
			style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, style]}
		>
			{loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryText}>{title}</Text>}
		</Pressable>
	);
}

export function SecondaryButton({ title, style, ...props }) {
	return (
		<Pressable
			{...props}
			style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed, style]}
		>
			<Text style={styles.secondaryText}>{title}</Text>
		</Pressable>
	);
}

export function ErrorText({ children }) {
	return children ? <Text style={styles.error}>{children}</Text> : null;
}

export function EmptyState({ text }) {
	return <Text style={styles.empty}>{text}</Text>;
}

export function Card({ children, style }) {
	return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({ text, tone = "gold" }) {
	const toneColor = colors[tone] || colors.gold;
	return (
		<View style={[styles.badge, { backgroundColor: toneColor }]}>
			<Text style={styles.badgeText}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flexGrow: 1,
		padding: spacing.md,
		backgroundColor: colors.background,
	},
	field: { marginBottom: spacing.md },
	label: { ...font.muted, color: colors.text, marginBottom: spacing.xs },
	input: {
		minHeight: 46,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radii.sm,
		backgroundColor: colors.card,
		color: colors.text,
		paddingHorizontal: spacing.md,
		fontSize: 15,
	},
	primaryButton: {
		minHeight: 46,
		borderRadius: radii.sm,
		backgroundColor: colors.navy,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.md,
	},
	primaryText: { color: colors.white, fontWeight: "700", fontSize: 15 },
	secondaryButton: {
		minHeight: 46,
		borderRadius: radii.sm,
		borderWidth: 1,
		borderColor: colors.navy,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.md,
	},
	secondaryText: { color: colors.navy, fontWeight: "700", fontSize: 15 },
	pressed: { opacity: 0.75 },
	error: { color: colors.danger, marginBottom: spacing.md },
	empty: { ...font.muted, textAlign: "center", paddingVertical: spacing.xl },
	card: {
		backgroundColor: colors.card,
		borderRadius: radii.md,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
	},
	badge: { borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
	badgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
});

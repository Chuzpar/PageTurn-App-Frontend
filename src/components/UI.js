import React from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { colors, font, radii, spacing } from "../theme";

export function Screen({ children, style }) {
	return <View style={[styles.screen, style]}>{children}</View>;
}

export function Field({ label, style, ...props }) {
	return (
		<View style={[styles.field, style]}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<TextInput
				style={[styles.input, props.multiline && styles.multiline]}
				placeholderTextColor={colors.textMuted}
				{...props}
			/>
		</View>
	);
}

function Button({ title, onPress, loading, style, secondary, disabled }) {
	return (
		<Pressable
			accessibilityRole="button"
			disabled={loading || disabled}
			onPress={onPress}
			style={({ pressed }) => [
				styles.button,
				secondary ? styles.secondaryButton : styles.primaryButton,
				pressed && styles.pressed,
				(loading || disabled) && styles.disabled,
				style,
			]}
		>
			{loading ? (
				<ActivityIndicator color={secondary ? colors.navy : colors.white} />
			) : (
				<Text style={secondary ? styles.secondaryButtonText : styles.buttonText}>{title}</Text>
			)}
		</Pressable>
	);
}

export function PrimaryButton(props) {
	return <Button {...props} />;
}

export function SecondaryButton(props) {
	return <Button {...props} secondary />;
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
		flex: 1,
		width: "100%",
		maxWidth: 760,
		alignSelf: "center",
		padding: spacing.lg,
		backgroundColor: colors.background,
	},
	field: { marginBottom: spacing.md },
	label: { ...font.body, fontWeight: "600", marginBottom: spacing.xs },
	input: {
		minHeight: 46,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radii.sm,
		paddingHorizontal: spacing.sm,
		backgroundColor: colors.card,
		color: colors.text,
		fontSize: 16,
	},
	multiline: { minHeight: 100, textAlignVertical: "top", paddingTop: spacing.sm },
	button: {
		minHeight: 46,
		borderRadius: radii.sm,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: spacing.md,
		marginBottom: spacing.sm,
	},
	primaryButton: { backgroundColor: colors.navy },
	secondaryButton: { borderWidth: 1, borderColor: colors.navy, backgroundColor: colors.card },
	buttonText: { color: colors.white, fontWeight: "700", fontSize: 15 },
	secondaryButtonText: { color: colors.navy, fontWeight: "700", fontSize: 15 },
	pressed: { opacity: 0.75 },
	disabled: { opacity: 0.5 },
	error: { color: colors.danger, marginBottom: spacing.md },
	empty: { ...font.muted, textAlign: "center", paddingVertical: spacing.xl },
	card: {
		backgroundColor: colors.card,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radii.md,
		padding: spacing.md,
	},
	badge: { alignSelf: "flex-start", borderRadius: radii.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
	badgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
});

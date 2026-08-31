import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radii, spacing } from "../theme";

export default function BookCard({ book, onPress }) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
			<View style={styles.cover}>
				<Text style={styles.initial}>{book.title?.charAt(0) || "?"}</Text>
			</View>
			<Text style={font.h3} numberOfLines={2}>{book.title}</Text>
			<Text style={font.muted} numberOfLines={1}>{book.author}</Text>
			{book.price != null ? <Text style={styles.price}>${Number(book.price).toFixed(2)}</Text> : null}
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: {
		width: "48%",
		marginBottom: spacing.md,
		padding: spacing.sm,
		borderRadius: radii.md,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.card,
	},
	cover: {
		aspectRatio: 0.72,
		marginBottom: spacing.sm,
		borderRadius: radii.sm,
		backgroundColor: colors.navy,
		alignItems: "center",
		justifyContent: "center",
	},
	initial: { color: colors.gold, fontSize: 48, fontWeight: "700" },
	price: { color: colors.navy, fontWeight: "700", marginTop: spacing.xs },
	pressed: { opacity: 0.75 },
});

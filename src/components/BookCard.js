import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radii, spacing } from "../theme";

export default function BookCard({ book, onPress }) {
	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
			<View style={styles.cover}><Text style={styles.initial}>{book.title?.[0] || "?"}</Text></View>
			<Text style={font.h3} numberOfLines={2}>{book.title}</Text>
			<Text style={font.muted} numberOfLines={1}>{book.author}</Text>
			<Text style={styles.price}>${Number(book.price || 0).toFixed(2)}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: { width: "48%", marginBottom: spacing.md, padding: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md },
	cover: { height: 120, marginBottom: spacing.sm, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy, borderRadius: radii.sm },
	initial: { color: colors.gold, fontSize: 42, fontWeight: "700" },
	price: { color: colors.navy, fontWeight: "700", marginTop: spacing.xs },
	pressed: { opacity: 0.75 },
});

import React from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { API_BASE_URL } from "../services/api";
import { colors, font, formatCurrency, radii, spacing } from "../theme";

const resolveBookImageSource = (book) => {
	const candidates = [
		book?.image,
		book?.cover_image,
		book?.coverImage,
		book?.image_url,
		book?.imageUrl,
		book?.cover_url,
		book?.coverUrl,
		book?.image_path,
		book?.imagePath,
	];

	for (const value of candidates) {
		if (!value) continue;

		if (typeof value === "string") {
			const uri = value.trim();
			if (!uri) continue;
			if (/^(https?:\/\/|data:)/i.test(uri)) return { uri };
			if (uri.startsWith("/")) return { uri: `${API_BASE_URL.replace(/\/api$/, "")}${uri}` };
			return { uri: `${API_BASE_URL.replace(/\/api$/, "")}/${uri}` };
		}

		if (typeof value === "object" && value?.uri) return value;
	}

	return null;
};

export default function BookCard({ book, onPress }) {
	const imageSource = resolveBookImageSource(book);

	return (
		<Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
			<View style={[styles.cover, !imageSource && styles.coverFallback]}>
				{imageSource ? (
					<Image source={imageSource} style={styles.coverImage} resizeMode="cover" />
				) : (
					<Text style={styles.initial}>{book.title?.[0] || "?"}</Text>
				)}
			</View>
			<Text style={font.h3} numberOfLines={2}>{book.title}</Text>
			<Text style={font.muted} numberOfLines={1}>{book.author}</Text>
			<Text style={styles.price}>{formatCurrency(book.price)}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	card: { width: "48%", marginBottom: spacing.md, padding: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md },
	cover: { height: 120, marginBottom: spacing.sm, backgroundColor: colors.navy, borderRadius: radii.sm, overflow: "hidden" },
	coverFallback: { alignItems: "center", justifyContent: "center" },
	coverImage: { width: "100%", height: "100%" },
	initial: { color: colors.gold, fontSize: 42, fontWeight: "700" },
	price: { color: colors.navy, fontWeight: "700", marginTop: spacing.xs },
	pressed: { opacity: 0.75 },
});

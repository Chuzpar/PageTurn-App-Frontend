import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, radii, font } from "../theme";

/**
 * BookCard
 * Compact card used in the Book Store grid (2 columns).
 * Shows cover, title, author, and price.
 */
export default function BookCard({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {book.cover_url ? (
        <Image source={{ uri: book.cover_url }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverPlaceholderText} numberOfLines={3}>
            {book.title}
          </Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.author}
      </Text>
      <Text style={styles.price}>${Number(book.price ?? 0).toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = "48%";

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  cover: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
    backgroundColor: colors.background,
  },
  coverPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
  },
  coverPlaceholderText: {
    ...font.muted,
    textAlign: "center",
  },
  title: {
    ...font.body,
    fontWeight: "600",
  },
  author: {
    ...font.muted,
  },
  price: {
    ...font.body,
    fontWeight: "700",
    color: colors.primary,
    marginTop: spacing.xs,
  },
});

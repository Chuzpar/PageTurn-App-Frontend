import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import StarRating from "./StarRating";
import { colors, radii, spacing, font, shadow } from "../theme";

export default function BookCard({ book, onPress, actionLabel, onAction }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {book.cover_url ? (
        <Image source={{ uri: book.cover_url }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.coverInitial}>{book.title?.[0] ?? "?"}</Text>
        </View>
      )}
      <Text numberOfLines={1} style={styles.title}>{book.title}</Text>
      <Text numberOfLines={1} style={styles.author}>{book.author}</Text>
      {book.rating > 0 ? (
        <StarRating rating={book.rating} size={11} />
      ) : (
        <Text style={styles.noRating}>No ratings yet</Text>
      )}
      <Text style={styles.price}>${book.price?.toFixed(2)}</Text>
      {actionLabel ? (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  cover: {
    height: 120,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  coverPlaceholder: {
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  coverInitial: { color: colors.gold, fontSize: 34, fontWeight: "700" },
  title: { ...font.h3, fontSize: 14 },
  author: { ...font.muted, marginBottom: 4 },
  noRating: { fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs, fontStyle: "italic" },
  price: { color: colors.navy, fontWeight: "700", fontSize: 13, marginTop: 4 },
  actionBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.navy,
    borderRadius: radii.sm,
    paddingVertical: 8,
    alignItems: "center",
  },
  actionText: { color: colors.white, fontSize: 12, fontWeight: "700" },
});

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import StarRating from "./StarRating";
import { colors, radii, spacing, font, shadow } from "../theme";

export default function BookCard({ book, onPress, actionLabel, onAction }) {
  const savedCover = book.cover_url || book.cover_image_url || book.cover_image || book.image_url || book.image;
  const [coverImage, setCoverImage] = useState(savedCover);
  const [loadingCover, setLoadingCover] = useState(!savedCover);

  useEffect(() => {
    let active = true;

    if (savedCover) {
      setCoverImage(savedCover);
      setLoadingCover(false);
      return () => { active = false; };
    }

    setCoverImage(null);
    setLoadingCover(true);
    const query = `intitle:${encodeURIComponent(book.title || "")}&inauthor:${encodeURIComponent(book.author || "")}`;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`)
      .then((response) => response.json())
      .then((data) => {
        const image = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail?.replace("http://", "https://");
        if (active) setCoverImage(image || null);
      })
      .catch(() => {
        if (active) setCoverImage(null);
      })
      .finally(() => {
        if (active) setLoadingCover(false);
      });

    return () => { active = false; };
  }, [book.author, book.title, savedCover]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cover}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" />
        ) : loadingCover ? (
          <ActivityIndicator color={colors.gold} />
        ) : (
          <Text style={styles.coverInitial}>{book.title?.[0] ?? "?"}</Text>
        )}
      </View>
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
    width: "100%",
    minHeight: 232,
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
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  coverImage: { width: "100%", height: "100%" },
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

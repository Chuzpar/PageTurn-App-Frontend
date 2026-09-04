import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, PrimaryButton, SecondaryButton, ErrorText } from "../components/UI";
import StarRating from "../components/StarRating";
import {
  fetchBook, addToCart, fetchReviews, submitReview, addFavorite, removeFavorite, fetchFavorites,
} from "../services/api";
import { useToast } from "../context/ToastContext";
import { colors, font, spacing, radii } from "../theme";

export default function BookDetailScreen({ route, navigation }) {
  const { bookId, mode = "purchase" } = route.params;
  const { showToast } = useToast();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = useCallback(async () => {
    try {
      const [{ book }, { reviews }, { favorites }] = await Promise.all([
        fetchBook(bookId),
        fetchReviews(bookId),
        fetchFavorites().catch(() => ({ favorites: [] })), // logged-out or transient failure: just show as not-favorited
      ]);
      setBook(book);
      setReviews(reviews);
      setIsFavorite(favorites.some((f) => f.book?.id === bookId));
    } catch (e) {
      setError(e.message);
    }
  }, [bookId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleAdd = async (cartType, lendingDays) => {
    setAdding(true);
    setError("");
    try {
      await addToCart({ book_id: bookId, cart_type: cartType, lending_days: lendingDays });
      showToast(cartType === "purchase" ? "Added to cart" : "Added to lending cart");
    } catch (e) {
      setError(e.message);
      showToast(e.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const toggleFavorite = async () => {
    setFavoriteBusy(true);
    try {
      if (isFavorite) {
        await removeFavorite(bookId);
        setIsFavorite(false);
        showToast("Removed from favorites");
      } else {
        await addFavorite(bookId);
        setIsFavorite(true);
        showToast("Added to favorites");
      }
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setFavoriteBusy(false);
    }
  };

  const handleSubmitReview = async () => {
    if (myRating === 0) {
      showToast("Pick a star rating first", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      const { book_rating } = await submitReview(bookId, { rating: myRating, comment: myComment.trim() || undefined });
      setBook((b) => ({ ...b, rating: book_rating }));
      const { reviews } = await fetchReviews(bookId);
      setReviews(reviews);
      showToast("Review posted — thanks!");
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!book) {
    return (
      <Screen style={{ justifyContent: "center", alignItems: "center" }}>
        {error ? <ErrorText>{error}</ErrorText> : <ActivityIndicator color={colors.navy} />}
      </Screen>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <Screen>
        <View style={styles.cover}>
          <Text style={styles.coverInitial}>{book.title[0]}</Text>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={toggleFavorite}
            disabled={favoriteBusy}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? colors.danger : colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={font.h1}>{book.title}</Text>
        <Text style={[font.body, { color: colors.textMuted, marginBottom: spacing.sm }]}>by {book.author}</Text>
        <StarRating rating={book.rating} size={16} showCount count={reviews.length} />

        <ErrorText>{error}</ErrorText>

        {mode === "purchase" ? (
          <>
            <Text style={styles.price}>${book.price?.toFixed(2)}</Text>
            <PrimaryButton title="Add to Cart" onPress={() => handleAdd("purchase")} loading={adding} />
            <SecondaryButton
              title="View Purchase Cart"
              onPress={() => navigation.navigate("Cart", { screen: "CartMain", params: { type: "purchase" } })}
              style={{ marginTop: spacing.sm }}
            />
          </>
        ) : (
          <>
            <Text style={[font.body, { marginTop: spacing.sm, marginBottom: spacing.sm }]}>
              {book.stock_for_lending > 0
                ? `${book.stock_for_lending} ${book.stock_for_lending === 1 ? "copy" : "copies"} available to borrow`
                : "Currently unavailable to borrow"}
            </Text>
            <PrimaryButton
              title="Borrow for 14 Days"
              onPress={() => handleAdd("lending", 14)}
              loading={adding}
              disabled={book.stock_for_lending <= 0}
            />
          </>
        )}

        <Text style={[font.h3, { marginTop: spacing.lg, marginBottom: spacing.xs }]}>Synopsis</Text>
        <Text style={font.body}>
          {book.description || "A timeless work, cherished across generations of PageTurn readers."}
        </Text>

        <Text style={[font.h3, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>Beloved Reviews</Text>
        <View style={styles.reviewForm}>
          <Text style={[font.body, { fontWeight: "600", marginBottom: spacing.xs }]}>Rate this book</Text>
          <StarRating rating={myRating} size={26} interactive onChange={setMyRating} />
          <TextInput
            style={styles.commentInput}
            placeholder="Share your thoughts (optional)"
            placeholderTextColor={colors.textMuted}
            value={myComment}
            onChangeText={setMyComment}
            multiline
          />
          <PrimaryButton title="Post Review" onPress={handleSubmitReview} loading={submittingReview} style={{ marginTop: spacing.sm }} />
        </View>

        {reviews.length === 0 ? (
          <Text style={[font.muted, { marginTop: spacing.md }]}>No reviews yet — be the first to share your thoughts.</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={font.h3}>{r.reviewer_name}</Text>
                <StarRating rating={r.rating} size={13} />
              </View>
              {r.comment ? <Text style={[font.body, { marginTop: 4 }]}>{r.comment}</Text> : null}
            </View>
          ))
        )}
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  coverInitial: { color: colors.gold, fontSize: 64, fontWeight: "700" },
  favoriteBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: radii.pill,
    padding: 8,
  },
  price: { ...font.h1, marginTop: spacing.md, marginBottom: spacing.md },
  reviewForm: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
    minHeight: 60,
    textAlignVertical: "top",
    color: colors.text,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});

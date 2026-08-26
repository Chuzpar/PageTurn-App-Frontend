import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Screen, PrimaryButton, SecondaryButton, ErrorText } from "../components/UI";
import { fetchBook, addToCart } from "../services/api";
import { colors, font, spacing, radii } from "../theme";

export default function BookDetailScreen({ route, navigation }) {
  const { bookId, mode = "purchase" } = route.params;
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);


  useEffect(() => {
    fetchBook(bookId)
      .then(({ book }) => setBook(book))
      .catch((e) => setError(e.message));
  }, [bookId]);

  const handleAdd = async (cartType, lendingDays) => {
    setAdding(true);
    setError("");
    try {
      await addToCart({ book_id: bookId, cart_type: cartType, lending_days: lendingDays });
      setAdded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
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
        </View>
        <Text style={font.h1}>{book.title}</Text>
        <Text style={[font.body, { color: colors.textMuted, marginBottom: spacing.sm }]}>by {book.author}</Text>
        <Text style={styles.rating}>★ {book.rating?.toFixed(1) ?? "—"}</Text>

        <ErrorText>{error}</ErrorText>

        {mode === "purchase" ? (
          <>
            <Text style={styles.price}>${book.price?.toFixed(2)}</Text>
            <PrimaryButton
              title={added ? "Added to Cart ✓" : "Add to Cart"}
              onPress={() => handleAdd("purchase")}
              loading={adding}
            />
            <SecondaryButton
              title="View Purchase Cart"
              onPress={() => navigation.navigate("Cart", { type: "purchase" })}
              style={{ marginTop: spacing.sm }}
            />
          </>
        ) : (
          <>
            <Text style={[font.body, { marginBottom: spacing.sm }]}>
              {book.stock_for_lending > 0
                ? `${book.stock_for_lending} ${book.stock_for_lending === 1 ? "copy" : "copies"} available to borrow`
                : "Currently unavailable to borrow"}
            </Text>
            <PrimaryButton
              title={added ? "Added to Lending Cart ✓" : "Borrow for 14 Days"}
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
  rating: { color: colors.gold, fontWeight: "700", marginBottom: spacing.md },
  price: { ...font.h1, marginBottom: spacing.md },
});

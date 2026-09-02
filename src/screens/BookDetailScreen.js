import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";

import {
  Screen,
  PrimaryButton,
  SecondaryButton,
  ErrorText,
} from "../components/UI";

import {
  fetchBook,
  getOpenLibraryWork,
  addToCart,
  API_BASE_URL,
} from "../services/api";

import {
  colors,
  font,
  formatCurrency,
  spacing,
  radii,
} from "../theme";

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

      if (/^(https?:\/\/|data:)/i.test(uri)) {
        return { uri };
      }

      if (uri.startsWith("/")) {
        return {
          uri: `${API_BASE_URL.replace(/\/api$/, "")}${uri}`,
        };
      }

      return {
        uri: `${API_BASE_URL.replace(/\/api$/, "")}/${uri}`,
      };
    }

    if (typeof value === "object" && value?.uri) {
      return value;
    }
  }

  return null;
};

export default function BookDetailScreen({ route, navigation }) {
  const {
    bookId,
    mode = "purchase",
    book: passedBook,
  } = route.params;

  const [book, setBook] = useState(passedBook || null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      setError("");

      try {
        if (mode === "public") {
          const { book: publicBook } =
            await getOpenLibraryWork(bookId);

          setBook(publicBook);
        } else {
          const { book: storeBook } =
            await fetchBook(bookId);

          setBook(storeBook);
        }
      } catch (e) {
        setError(e.message);
      }
    };

    if (bookId) {
      loadBook();
    }
  }, [bookId, mode]);

  const handleAdd = async (cartType, lendingDays) => {
    setAdding(true);
    setError("");

    try {
      await addToCart({
        book_id: bookId,
        cart_type: cartType,
        lending_days: lendingDays,
      });

      setAdded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  if (!book) {
    return (
      <Screen
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {error ? (
          <ErrorText>{error}</ErrorText>
        ) : (
          <ActivityIndicator color={colors.navy} />
        )}
      </Screen>
    );
  }

  const imageSource = resolveBookImageSource(book);

  const isPublicBook = mode === "public";

  return (
    <ScrollView
      style={{
        backgroundColor: colors.background,
      }}
    >
      <Screen>
        <View
          style={[
            styles.cover,
            !imageSource && styles.coverFallback,
          ]}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.coverInitial}>
              {book.title?.[0] || "?"}
            </Text>
          )}
        </View>

        <Text style={font.h1}>
          {book.title}
        </Text>

        <Text
          style={[
            font.body,
            {
              color: colors.textMuted,
              marginBottom: spacing.sm,
            },
          ]}
        >
          by {book.author || "Unknown author"}
        </Text>

        {!isPublicBook && (
          <Text style={styles.rating}>
            ★{" "}
            {book.rating?.toFixed(1) ?? "—"}
          </Text>
        )}

        {isPublicBook && (
          <View style={styles.publicBadge}>
            <Text style={styles.publicBadgeText}>
              Open Library
            </Text>
          </View>
        )}

        <ErrorText>{error}</ErrorText>

        {isPublicBook ? (
          <View style={styles.publicInfo}>
            {book.subjects?.length > 0 && (
              <Text
                style={[
                  font.body,
                  { marginBottom: spacing.sm },
                ]}
              >
                Genres:{" "}
                {book.subjects
                  .slice(0, 5)
                  .join(", ")}
              </Text>
            )}

            <Text
              style={[
                font.body,
                { marginBottom: spacing.sm },
              ]}
            >
              This book is available through Open
              Library.
            </Text>
          </View>
        ) : mode === "purchase" ? (
          <>
            <Text style={styles.price}>
              {formatCurrency(book.price)}
            </Text>

            <PrimaryButton
              title={
                added
                  ? "Added to Cart ✓"
                  : "Add to Cart"
              }
              onPress={() =>
                handleAdd("purchase")
              }
              loading={adding}
            />

            <SecondaryButton
              title="View Purchase Cart"
              onPress={() =>
                navigation.navigate("Cart", {
                  type: "purchase",
                })
              }
              style={{
                marginTop: spacing.sm,
              }}
            />
          </>
        ) : (
          <>
            <Text
              style={[
                font.body,
                { marginBottom: spacing.sm },
              ]}
            >
              {book.stock_for_lending > 0
                ? `${book.stock_for_lending} ${
                    book.stock_for_lending === 1
                      ? "copy"
                      : "copies"
                  } available to borrow`
                : "Currently unavailable to borrow"}
            </Text>

            <PrimaryButton
              title={
                added
                  ? "Added to Lending Cart ✓"
                  : "Borrow for 14 Days"
              }
              onPress={() =>
                handleAdd("lending", 14)
              }
              loading={adding}
              disabled={
                book.stock_for_lending <= 0
              }
            />
          </>
        )}

        <Text
          style={[
            font.h3,
            {
              marginTop: spacing.lg,
              marginBottom: spacing.xs,
            },
          ]}
        >
          Synopsis
        </Text>

        <Text style={font.body}>
          {book.description ||
            "A timeless work, cherished across generations of readers."}
        </Text>

        {isPublicBook && book.openlibrary_url && (
          <Text
            style={[
              font.muted,
              {
                marginTop: spacing.md,
              },
            ]}
          >
            Source: Open Library
          </Text>
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
    marginBottom: spacing.md,
    overflow: "hidden",
  },

  coverFallback: {
    alignItems: "center",
    justifyContent: "center",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  coverInitial: {
    color: colors.gold,
    fontSize: 64,
    fontWeight: "700",
  },

  rating: {
    color: colors.gold,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  price: {
    ...font.h1,
    marginBottom: spacing.md,
  },

  publicBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
  },

  publicBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },

  publicInfo: {
    marginTop: spacing.sm,
  },
});


import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Field, EmptyState, ErrorText } from "../components/UI";
import BookCard from "../components/BookCard";
import {
  fetchBooks,
  fetchGenres,
  searchOpenLibraryBooks,
} from "../services/api";
import { colors, font, spacing, radii } from "../theme";

export default function StoreScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openLibrarySuggestions, setOpenLibrarySuggestions] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (query) {
        params.q = query;
      }

      if (activeGenre) {
        params.genre = activeGenre;
      }

      const [{ books }, genreData] = await Promise.all([
        fetchBooks(params),
        genres.length
          ? Promise.resolve({ genres })
          : fetchGenres(),
      ]);

      setBooks(books);

      if (!genres.length) {
        setGenres(genreData.genres || []);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, activeGenre, genres.length]);

  useEffect(() => {
    if (query.trim().length > 2) {
      searchOpenLibraryBooks(query)
        .then((data) => {
          setOpenLibrarySuggestions(
            data.books?.slice(0, 3) || []
          );
        })
        .catch(() => {
          setOpenLibrarySuggestions([]);
        });
    } else {
      setOpenLibrarySuggestions([]);
    }
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleOpenLibraryBook = (book) => {
    navigation.navigate("BookDetail", {
      bookId: book.id,
      mode: "public",
      book,
    });
  };

  return (
    <Screen>
      <Text style={font.h1}>PageTurn Store</Text>

      <Text
        style={[
          font.muted,
          { marginBottom: spacing.md },
        ]}
      >
        Discover, buy, and collect your next read
      </Text>

      <ErrorText>{error}</ErrorText>

      <Field
        placeholder="Search title or author..."
        value={query}
        onChangeText={setQuery}
      />

      {openLibrarySuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>
            Discover from Open Library
          </Text>

          {openLibrarySuggestions.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.suggestionItem}
              onPress={() => handleOpenLibraryBook(book)}
            >
              {book.cover_url && (
                <View style={styles.suggestionImageContainer}>
                  <Text style={styles.bookIcon}>📖</Text>
                </View>
              )}

              <View style={styles.suggestionTextContainer}>
                <Text
                  style={styles.suggestionTitle}
                  numberOfLines={1}
                >
                  {book.title}
                </Text>

                <Text
                  style={styles.suggestionAuthor}
                  numberOfLines={1}
                >
                  by {book.author || "Unknown author"}
                </Text>

                {book.published_year && (
                  <Text style={styles.suggestionYear}>
                    {book.published_year}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.genreRow}>
        <TouchableOpacity
          style={[
            styles.pill,
            !activeGenre && styles.pillActive,
          ]}
          onPress={() => setActiveGenre(null)}
        >
          <Text
            style={[
              styles.pillText,
              !activeGenre && styles.pillTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {genres.map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.pill,
              activeGenre === g && styles.pillActive,
            ]}
            onPress={() =>
              setActiveGenre(
                activeGenre === g ? null : g
              )
            }
          >
            <Text
              style={[
                styles.pillText,
                activeGenre === g &&
                  styles.pillTextActive,
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={
          !loading ? (
            <EmptyState text="No books match your search." />
          ) : null
        }
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() =>
              navigation.navigate("BookDetail", {
                bookId: item.id,
                mode: "purchase",
              })
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.md,
    gap: spacing.xs,
  },

  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },

  pillActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },

  pillText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },

  pillTextActive: {
    color: colors.white,
  },

  suggestionsContainer: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.navy,
  },

  suggestionsLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },

  suggestionImageContainer: {
    width: 40,
    height: 50,
    borderRadius: 4,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },

  bookIcon: {
    fontSize: 20,
  },

  suggestionTextContainer: {
    flex: 1,
  },

  suggestionTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },

  suggestionAuthor: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  suggestionYear: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});


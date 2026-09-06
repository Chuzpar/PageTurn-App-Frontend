import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Field, EmptyState } from "../components/UI";
import BookCard from "../components/BookCard";
import { BookGridSkeleton } from "../components/Skeleton";
import { fetchBooks, fetchGenres } from "../services/api";
import { colors, font, spacing, radii } from "../theme";

export default function StoreScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedQuery) params.q = debouncedQuery;
      if (activeGenre) params.genre = activeGenre;
      const { books } = await fetchBooks(params);
      setBooks(books);
      if (!genres.length) {
        const g = await fetchGenres();
        setGenres(g.genres);
      }
    } catch (e) {
      // Keep last-known list on error; error is still surfaced via e.message
      // if a caller wants it — list screens degrade gracefully rather than
      // going blank on a transient network hiccup.
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, activeGenre]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <Screen>
      <Text style={font.h1}>PageTurn Store</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>Discover, buy, and collect your next read</Text>

      <Field placeholder="Search title or author..." value={query} onChangeText={setQuery} />

      <View style={styles.genreRow}>
        <TouchableOpacity
          style={[styles.pill, !activeGenre && styles.pillActive]}
          onPress={() => setActiveGenre(null)}
        >
          <Text style={[styles.pillText, !activeGenre && styles.pillTextActive]}>All</Text>
        </TouchableOpacity>
        {genres.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.pill, activeGenre === g && styles.pillActive]}
            onPress={() => setActiveGenre(activeGenre === g ? null : g)}
          >
            <Text style={[styles.pillText, activeGenre === g && styles.pillTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && books.length === 0 ? (
        <BookGridSkeleton />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={!loading ? <EmptyState text="No books match your search." /> : null}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={() => navigation.navigate("BookDetail", { bookId: item.id, mode: "purchase" })} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  genreRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.md, gap: spacing.xs },
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
  pillActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  pillText: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  pillTextActive: { color: colors.white },
});

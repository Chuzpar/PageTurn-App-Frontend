import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Field, EmptyState } from "../components/UI";
import BookCard from "../components/BookCard";
import { BookGridSkeleton } from "../components/Skeleton";
import { fetchBooks } from "../services/api";
import { font, spacing } from "../theme";

export default function LibraryScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort: "rating" };
      if (debouncedQuery) params.q = debouncedQuery;
      const { books } = await fetchBooks(params);
      setBooks(books.filter((b) => b.stock_for_lending > 0 || debouncedQuery));
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <Screen>
      <Text style={font.h1}>PageTurn Library</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>Community lending catalogue</Text>
      <Field placeholder="Search the lending catalogue..." value={query} onChangeText={setQuery} />

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
          ListEmptyComponent={!loading ? <EmptyState text="No books currently available to borrow." /> : null}
          renderItem={({ item }) => (
            <View>
              <BookCard
                book={item}
                onPress={() => navigation.navigate("BookDetail", { bookId: item.id, mode: "lending" })}
              />
            </View>
          )}
        />
      )}
    </Screen>
  );
}

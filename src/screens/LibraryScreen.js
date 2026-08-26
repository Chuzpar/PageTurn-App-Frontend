import React, { useCallback, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Field, EmptyState, Badge } from "../components/UI";
import BookCard from "../components/BookCard";
import { fetchBooks } from "../services/api";
import { font, spacing } from "../theme";

export default function LibraryScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort: "rating" };
      if (query) params.q = query;
      const { books } = await fetchBooks(params);
      setBooks(books.filter((b) => b.stock_for_lending > 0 || query));
    } finally {
      setLoading(false);
    }
    
  }, [query]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <Screen>
      <Text style={font.h1}>PageTurn Library</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>Community lending catalogue</Text>
      <Field placeholder="Search the lending catalogue..." value={query} onChangeText={setQuery} />

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
    </Screen>
  );
}

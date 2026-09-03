import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, ErrorText, SecondaryButton } from "../../components/UI";
import { adminFetchBooks, adminDeleteBook } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { colors, font, spacing, radii } from "../../theme";

export default function AdminBooksScreen({ navigation }) {
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    adminFetchBooks()
      .then(({ books }) => setBooks(books))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (book) => {
    Alert.alert("Delete Book", `Remove "${book.title}" from the archives?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await adminDeleteBook(book.id);
            showToast(`"${book.title}" removed`);
            load();
          } catch (e) {
            setError(e.message);
            showToast(e.message, "error");
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <Text style={font.h1}>Manage Books</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>{books.length} manuscripts in the archive</Text>

      <ErrorText>{error}</ErrorText>

      <SecondaryButton
        title="+ Add New Manuscript"
        onPress={() => navigation.navigate("AddManuscript")}
        style={{ marginBottom: spacing.md }}
      />

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="No books yet." /> : null}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={font.h3}>{item.title}</Text>
              <Text style={font.muted}>{item.author} · ${item.price?.toFixed(2)} · {item.genre || "Uncategorized"}</Text>
              <Text style={font.muted}>{item.stock_for_lending} copies for lending</Text>
            </View>
            <View style={{ gap: spacing.xs }}>
              <TouchableOpacity onPress={() => navigation.navigate("EditManuscript", { book: item })}>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item)}>
                <Text style={styles.deleteLink}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  editLink: { color: colors.navy, fontWeight: "700", fontSize: 12 },
  deleteLink: { color: colors.danger, fontWeight: "700", fontSize: 12 },
});

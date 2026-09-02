import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, ErrorText, SecondaryButton } from "../../components/UI";
import { adminFetchBooks, adminDeleteBook } from "../../services/api";
import { colors, font, formatCurrency, spacing, radii } from "../../theme";

/**
 * Admin Books Management Screen
 * Displays all books in the catalogue with edit/delete actions
 */
export default function AdminBooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load books when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const loadBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetchBooks();
      setBooks(data.books);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (book) => {
    Alert.alert(
      "Delete Book",
      `Remove "${book.title}" from the archives?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await adminDeleteBook(book.id);
              await loadBooks();
            } catch (e) {
              setError(e.message);
            }
          },
        },
      ]
    );
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.bookInfo}>
        <Text style={font.h3}>{item.title}</Text>
        <Text style={font.muted}>
          {item.author} · {formatCurrency(item.price)} · {item.genre || "Uncategorized"}
        </Text>
        <Text style={font.muted}>{item.stock_for_lending} copies for lending</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("EditManuscript", { book: item })}
        >
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Text style={styles.deleteLink}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen>
      <Text style={font.h1}>Manage Books</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>
        {books.length} manuscripts in the archive
      </Text>

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
        onRefresh={loadBooks}
        ListEmptyComponent={
          !loading ? <EmptyState text="No books in the archive yet." /> : null
        }
        renderItem={renderBookItem}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookInfo: {
    flex: 1,
  },
  actions: {
    gap: spacing.xs,
    alignItems: "flex-end",
  },
  editLink: {
    color: colors.navy,
    fontWeight: "700",
    fontSize: 12,
    paddingVertical: 2,
  },
  deleteLink: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 12,
    paddingVertical: 2,
  },
});

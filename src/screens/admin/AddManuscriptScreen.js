import React, { useState } from "react";
import { Text, ScrollView, Switch, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../../components/UI";
import { adminCreateBook, searchOpenLibraryBooks } from "../../services/api";
import { font, spacing, colors, radii } from "../../theme";

export default function AddManuscriptScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [stock, setStock] = useState("1");
  const [availableForLending, setAvailableForLending] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [openLibraryResults, setOpenLibraryResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleOpenLibrarySearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setSearchLoading(true);
      try {
        const data = await searchOpenLibraryBooks(query, 10);
        setOpenLibraryResults(data.docs?.slice(0, 5) || []);
      } catch (e) {
        setOpenLibraryResults([]);
      } finally {
        setSearchLoading(false);
      }
    } else {
      setOpenLibraryResults([]);
    }
  };

  const handleSelectBook = (book) => {
    setTitle(book.title || "");
    setAuthor(book.author_name?.[0] || "");
    if (book.first_publish_year) {
      setGenre(book.subject?.[0] || "");
    }
    setOpenLibraryResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async () => {
    setError("");

    if (!title.trim() || !author.trim()) {
      setError("Title and author are required.");
      return;
    }

    setSaving(true);
    try {
      await adminCreateBook({
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        genre: genre.trim() || null,
        stock_for_lending: availableForLending ? parseInt(stock, 10) || 0 : 0,
      });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Add New Manuscript</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>
          Curator submission form
        </Text>

        <ErrorText>{error}</ErrorText>

        <Field 
          label="Search Open Library" 
          placeholder="Search by title or author..." 
          value={searchQuery} 
          onChangeText={handleOpenLibrarySearch}
        />

        {openLibraryResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsLabel}>Results from Open Library</Text>
            <FlatList
              scrollEnabled={false}
              data={openLibraryResults}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.resultItem} 
                  onPress={() => handleSelectBook(item)}
                >
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultAuthor}>
                    {item.author_name?.join(", ") || "Unknown Author"}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <Field label="Book Title" placeholder="The Odyssey" value={title} onChangeText={setTitle} />
        <Field label="Author" placeholder="Homer" value={author} onChangeText={setAuthor} />
        <Field
          label="Manuscript Description"
          placeholder="Short synopsis..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        <Field label="Retail Price (KSh)" placeholder="1,299" keyboardType="decimal-pad" value={price} onChangeText={setPrice} />
        <Field label="Genre / Classification" placeholder="Classics" value={genre} onChangeText={setGenre} />

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
          <Text style={font.h3}>Available for Lending</Text>
          <Switch value={availableForLending} onValueChange={setAvailableForLending} />
        </View>
        {availableForLending && (
          <Field label="Copies Available to Lend" keyboardType="number-pad" value={stock} onChangeText={setStock} />
        )}

        <PrimaryButton title="Add Book to Archives" onPress={handleSubmit} loading={saving} />
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.navy,
  },
  resultsLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  resultItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultTitle: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  resultAuthor: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});

import React, { useState } from "react";
import { Text, ScrollView, Switch, View, Image, TouchableOpacity } from "react-native";
import { Screen, Field, PrimaryButton, Card, ErrorText } from "../../components/UI";
import { adminCreateBook } from "../../services/api";
import { font, spacing, colors, radii } from "../../theme";

/**
 * Add New Manuscript Screen
 * Form for admins to add new books to the catalogue.
 *
 * Includes an optional "Search Open Library" helper: admins can look up a
 * real title and auto-fill author/description/cover image, then just set
 * the store-specific fields (price, genre, lending stock) before saving.
 *
 * Uses Open Library's free search API (no key, no rate limit for normal use):
 * https://openlibrary.org/dev/docs/api/search
 */
export default function AddManuscriptScreen({ navigation }) {
  // Open Library search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [applyingKey, setApplyingKey] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [price, setPrice] = useState("");
  const [genre, setGenre] = useState("");
  const [stock, setStock] = useState("1");
  const [availableForLending, setAvailableForLending] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery.trim()
        )}&limit=5`
      );
      const data = await res.json();
      setSearchResults(data.docs || []);
      if (!data.docs || data.docs.length === 0) {
        setSearchError("No results found. Try a different search.");
      }
    } catch (e) {
      setSearchError("Couldn't reach Open Library. Check your connection.");
    } finally {
      setSearching(false);
    }
  };

  const applyResult = async (doc) => {
    setApplyingKey(doc.key);
    setTitle(doc.title || "");
    setAuthor((doc.author_name || []).join(", "));
    setGenre((doc.subject || [])[0] || "");
    setCoverUrl(
      doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : ""
    );

    // Search results don't include a description — fetch the work's
    // details for that, but don't block the rest of the form on it.
    try {
      const res = await fetch(`https://openlibrary.org${doc.key}.json`);
      const work = await res.json();
      const desc =
        typeof work.description === "string"
          ? work.description
          : work.description?.value || "";
      setDescription(desc);
    } catch (e) {
      // Non-fatal — admin can still type a description manually.
    } finally {
      setApplyingKey(null);
      setSearchResults([]);
      setSearchQuery("");
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Validate required fields
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
        cover_url: coverUrl || null,
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

        {/* --- Open Library lookup helper --- */}
        <Card>
          <Text style={[font.h3, { marginBottom: spacing.xs }]}>
            Look up a real book (optional)
          </Text>
          <Field
            placeholder="Search by title, e.g. 'Dune'"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <PrimaryButton
            title={searching ? "Searching..." : "Search Open Library"}
            onPress={handleSearch}
            loading={searching}
          />
          <ErrorText>{searchError}</ErrorText>

          {searchResults.map((doc) => (
            <TouchableOpacity
              key={doc.key}
              onPress={() => applyResult(doc)}
              disabled={applyingKey === doc.key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: spacing.sm,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                opacity: applyingKey === doc.key ? 0.5 : 1,
              }}
            >
              {doc.cover_i ? (
                <Image
                  source={{
                    uri: `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`,
                  }}
                  style={{ width: 40, height: 60, borderRadius: radii.sm, marginRight: spacing.sm }}
                />
              ) : null}
              <View style={{ flex: 1 }}>
                <Text style={font.body} numberOfLines={1}>
                  {doc.title}
                </Text>
                <Text style={font.muted} numberOfLines={1}>
                  {(doc.author_name || []).join(", ")}
                  {doc.first_publish_year ? ` · ${doc.first_publish_year}` : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <ErrorText>{error}</ErrorText>

        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={{
              width: 80,
              height: 120,
              borderRadius: radii.sm,
              alignSelf: "center",
              marginBottom: spacing.md,
            }}
          />
        ) : null}

        <Field
          label="Book Title"
          placeholder="The Odyssey"
          value={title}
          onChangeText={setTitle}
        />

        <Field
          label="Author"
          placeholder="Homer"
          value={author}
          onChangeText={setAuthor}
        />

        <Field
          label="Manuscript Description"
          placeholder="Short synopsis..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Field
          label="Retail Price ($)"
          placeholder="12.99"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <Field
          label="Genre / Classification"
          placeholder="Classics"
          value={genre}
          onChangeText={setGenre}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.md,
          }}
        >
          <Text style={font.h3}>Available for Lending</Text>
          <Switch
            value={availableForLending}
            onValueChange={setAvailableForLending}
          />
        </View>

        {availableForLending && (
          <Field
            label="Copies Available to Lend"
            keyboardType="number-pad"
            value={stock}
            onChangeText={setStock}
          />
        )}

        <PrimaryButton
          title="Add Book to Archives"
          onPress={handleSubmit}
          loading={saving}
        />
      </Screen>
    </ScrollView>
  );
}

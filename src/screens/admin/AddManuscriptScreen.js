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

  const handleSave = async () => {
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
        description,
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
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>Curator submission form</Text>

        <ErrorText>{error}</ErrorText>
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

        <PrimaryButton title="Add Book to Archives" onPress={handleSave} loading={saving} />
      </Screen>
    </ScrollView>
  );
}
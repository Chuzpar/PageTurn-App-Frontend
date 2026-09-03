import React, { useState } from "react";
import { Text, ScrollView, Switch, View } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../../components/UI";
import { adminUpdateBook } from "../../services/api";
import { font, spacing } from "../../theme";

/**
 * Edit Manuscript Screen
 * Form for admins to update existing books in the catalogue
 */
export default function EditManuscriptScreen({ route, navigation }) {
  const { book } = route.params;

  // Form state pre-filled with existing book data
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description || "");
  const [price, setPrice] = useState(String(book.price ?? ""));
  const [genre, setGenre] = useState(book.genre || "");
  const [stock, setStock] = useState(String(book.stock_for_lending ?? 0));
  const [availableForLending, setAvailableForLending] = useState(
    (book.stock_for_lending ?? 0) > 0
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setError("");
    
    // Validate required fields
    if (!title.trim() || !author.trim()) {
      setError("Title and author are required.");
      return;
    }

    setSaving(true);
    try {
      await adminUpdateBook(book.id, {
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
        <Text style={font.h1}>Edit Manuscript</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>
          Updating "{book.title}"
        </Text>

        <ErrorText>{error}</ErrorText>

        <Field 
          label="Book Title" 
          value={title} 
          onChangeText={setTitle} 
        />
        
        <Field 
          label="Author" 
          value={author} 
          onChangeText={setAuthor} 
        />
        
        <Field
          label="Manuscript Description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
        
        <Field 
          label="Retail Price (KSh)"
          keyboardType="decimal-pad" 
          value={price} 
          onChangeText={setPrice} 
        />
        
        <Field 
          label="Genre / Classification" 
          value={genre} 
          onChangeText={setGenre} 
        />

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md }}>
          <Text style={font.h3}>Available for Lending</Text>
          <Switch value={availableForLending} onValueChange={setAvailableForLending} />
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
          title="Save Changes" 
          onPress={handleUpdate} 
          loading={saving} 
        />
      </Screen>
    </ScrollView>
  );
}

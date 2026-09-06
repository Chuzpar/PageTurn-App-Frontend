import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { colors, radii, spacing, font } from "../theme";

export default function CoverImagePicker({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async () => {
    setError("");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "PageTurn needs access to your photos to set a book cover."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.85,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(
        asset.uri,
        asset.fileName || "cover.jpg",
        asset.mimeType || "image/jpeg"
      );
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>Cover Image</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={pickImage}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color={colors.navy} />
        ) : value ? (
          <Image source={{ uri: value }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={28} color={colors.textMuted} />
            <Text style={font.muted}>Tap to add a cover image</Text>
          </View>
        )}
      </TouchableOpacity>
      {value && !uploading && (
        <TouchableOpacity onPress={() => onChange(null)}>
          <Text style={styles.removeText}>Remove image</Text>
        </TouchableOpacity>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...font.body, fontWeight: "600", marginBottom: spacing.xs },
  picker: {
    height: 160,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  preview: { width: "100%", height: "100%" },
  placeholder: { alignItems: "center", gap: 4 },
  removeText: {
    color: colors.danger,
    marginTop: spacing.xs,
    fontSize: 13,
    fontWeight: "600",
  },
  error: { color: colors.danger, marginTop: spacing.xs, fontSize: 13 },
});
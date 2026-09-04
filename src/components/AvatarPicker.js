import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { colors, radii, spacing } from "../theme";

export default function AvatarPicker({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const chooseAvatar = async () => {
    setError("");
    let ImagePicker;
    try {
      ImagePicker = require("expo-image-picker");
    } catch (e) {
      setError("Avatar selection needs expo-image-picker. Run npm install, then restart Expo.");
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Photo library permission is required to choose an avatar.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(result.assets[0].uri);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatar} onPress={chooseAvatar} disabled={uploading}>
        {value ? <Image source={{ uri: value }} style={styles.image} /> : <Text style={styles.placeholder}>+</Text>}
      </TouchableOpacity>
      <Text style={styles.label}>{uploading ? "Uploading..." : value ? "Change avatar" : "Upload avatar"}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radii.pill,
    overflow: "hidden",
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  image: { width: "100%", height: "100%" },
  placeholder: { color: colors.gold, fontSize: 40, fontWeight: "300" },
  label: { color: colors.navy, fontSize: 13, fontWeight: "600", marginTop: spacing.xs },
  error: { color: colors.danger, fontSize: 12, textAlign: "center", marginTop: spacing.xs },
});
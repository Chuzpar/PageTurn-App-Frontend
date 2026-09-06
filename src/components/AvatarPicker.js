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

export default function AvatarPicker({ value, onChange, size = 96 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async () => {
    setError("");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "PageTurn needs access to your photos to set an avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(
        asset.uri,
        asset.fileName || "avatar.jpg",
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
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={pickImage}
        disabled={uploading}
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {uploading ? (
          <ActivityIndicator color={colors.navy} />
        ) : value ? (
          <Image
            source={{ uri: value }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="person" size={size * 0.4} color={colors.gold} />
            <Text style={styles.hint}>Upload avatar</Text>
          </View>
        )}
        <View style={styles.badge}>
          <Ionicons name="camera" size={14} color={colors.white} />
        </View>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginBottom: spacing.md },
  circle: {
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.gold,
  },
  placeholder: { alignItems: "center" },
  hint: { ...font.muted, color: colors.gold, fontSize: 11, marginTop: 4 },
  badge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: colors.navyLight,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  error: { color: colors.danger, marginTop: spacing.xs, fontSize: 12 },
});
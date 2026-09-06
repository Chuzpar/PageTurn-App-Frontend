import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { colors, radii, spacing, font, shadow } from "../theme";
import { Ionicons } from "@expo/vector-icons";

// Cap content to phone width on web so the 2-column grid stays centered
const WEB_MAX_WIDTH = 480;

export function Screen({ children, style }) {
  return (
    <View style={styles.screenOuter}>
      <View style={[styles.screen, style]}>{children}</View>
    </View>
  );
}

export function PrimaryButton({ title, onPress, loading, disabled, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.primaryButton, (disabled || loading) && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.primaryButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export function SecondaryButton({ title, onPress, style, textStyle }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.secondaryButton, style]}>
      <Text style={[styles.secondaryButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <Text style={styles.error}>{children}</Text>;
}

export function EmptyState({ text, icon = "book-outline" }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name={icon}
        size={32}
        color={colors.border}
        style={{ marginBottom: spacing.sm }}
      />
      <Text style={font.muted}>{text}</Text>
    </View>
  );
}

export function Badge({ text, tone = "gold" }) {
  const bg =
    tone === "gold"
      ? colors.gold
      : tone === "success"
      ? colors.success
      : colors.danger;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenOuter:
    Platform.OS === "web"
      ? { flex: 1, alignItems: "center", backgroundColor: colors.background }
      : { flex: 1 },
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? WEB_MAX_WIDTH : undefined,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.navy,
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { color: colors.white, fontSize: 15, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.navy,
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { color: colors.navy, fontSize: 14, fontWeight: "600" },
  label: { ...font.body, fontWeight: "600", marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  error: { color: colors.danger, marginBottom: spacing.sm, fontSize: 13 },
  emptyState: { alignItems: "center", paddingVertical: spacing.xl },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.pill },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: "700" },
});
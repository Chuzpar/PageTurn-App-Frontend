import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

/**
 * Shared UI primitives used across screens.
 * Keep these generic — screen-specific styling belongs in the screen itself.
 */

export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Field({ label, style, ...inputProps }) {
  return (
    <View style={styles.fieldContainer}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
}

export function PrimaryButton({ title, onPress, loading, disabled, style }) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <Text style={styles.errorText}>{children}</Text>;
}

// Shared font/text style presets — some screens import `font` from theme.js,
// this keeps a compatible alias available from UI.js too if needed.
export const font = typography
  ? {
      h1: { fontSize: 24, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
      h3: { fontSize: 16, fontWeight: "600", color: colors.text },
      muted: { fontSize: 13, color: colors.textMuted },
    }
  : {};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
});

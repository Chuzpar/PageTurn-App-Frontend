import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { colors, radii, spacing, shadow } from "../theme";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null); // { message, tone }
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeout = useRef(null);

  const showToast = useCallback((message, tone = "success") => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setToast({ message, tone });
    Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    hideTimeout.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setToast(null));
    }, 2500);
  }, [opacity]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.container,
            { opacity, backgroundColor: toast.tone === "error" ? colors.danger : colors.navy },
          ]}
        >
          <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    ...shadow.md,
  },
  text: { color: colors.white, fontWeight: "600", fontSize: 13, textAlign: "center" },
});

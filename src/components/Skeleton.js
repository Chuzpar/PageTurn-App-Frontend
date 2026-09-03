import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { colors, radii } from "../theme";

function Pulse({ style }) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[styles.block, style, { opacity }]} />;
}

export function BookGridSkeleton({ count = 6 }) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.card}>
          <Pulse style={styles.cover} />
          <Pulse style={styles.line} />
          <Pulse style={[styles.line, { width: "60%" }]} />
        </View>
      ))}
    </View>
  );
}

export function ListRowSkeleton({ count = 4 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.row}>
          <Pulse style={styles.line} />
          <Pulse style={[styles.line, { width: "50%" }]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.border, borderRadius: radii.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "47%", marginBottom: 16 },
  cover: { height: 120, borderRadius: radii.sm, marginBottom: 8 },
  line: { height: 12, marginBottom: 6, width: "90%" },
  row: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 8,
  },
});

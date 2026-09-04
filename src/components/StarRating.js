import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export default function StarRating({ rating = 0, size = 16, interactive = false, onChange, showCount, count }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((n) => {
        const filled = n <= Math.round(rating);
        const Star = (
          <Ionicons
            key={n}
            name={filled ? "star" : "star-outline"}
            size={size}
            color={colors.gold}
            style={{ marginRight: 2 }}
          />
        );
        if (!interactive) return Star;
        return (
          <TouchableOpacity key={n} onPress={() => onChange?.(n)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
            {Star}
          </TouchableOpacity>
        );
      })}
      {showCount ? (
        <Text style={[styles.count, { fontSize: size * 0.7 }]}>
          {rating > 0 ? rating.toFixed(1) : "No ratings"} {count != null ? `(${count})` : ""}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  count: { marginLeft: 6, color: colors.textMuted, fontWeight: "600" },
});

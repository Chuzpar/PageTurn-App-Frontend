import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, Badge, ErrorText } from "../components/UI";
import { fetchOrders } from "../services/api";
import { colors, font, formatCurrency, spacing, radii } from "../theme";

export default function PurchaseHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setError("");
      fetchOrders()
        .then(({ orders }) => setOrders(orders))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, [])
  );

  return (
    <Screen>
      <Text style={font.h1}>Your Literary Record</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>Purchases · {orders.length}</Text>
      <ErrorText>{error}</ErrorText>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => fetchOrders().then(({ orders }) => setOrders(orders))}
        ListEmptyComponent={!loading ? <EmptyState text="No purchases yet." /> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.items.map((oi) => (
              <Text key={oi.id} style={font.h3}>{oi.book?.title} × {oi.quantity}</Text>
            ))}
            <View style={styles.footerRow}>
              <Text style={font.muted}>{new Date(item.created_at).toLocaleDateString()}</Text>
              <Badge text={item.status.toUpperCase()} tone="success" />
            </View>
            <Text style={[font.h3, { marginTop: spacing.xs }]}>{formatCurrency(item.total)}</Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.xs },
});

import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, PrimaryButton, EmptyState, ErrorText } from "../components/UI";
import { fetchCart, removeFromCart, submitLendingRequests } from "../services/api";
import { colors, font, spacing, radii } from "../theme";

export default function CartScreen({ route, navigation }) {
  const initialType = route?.params?.type || "purchase";
  const [type, setType] = useState(initialType);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async (cartType) => {
    setLoading(true);
    try {
      const data = await fetchCart(cartType);
      setItems(data.items);
      setSubtotal(data.subtotal || 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(type); }, [type, load]));

  const handleRemove = async (id) => {
    setError("");
    try {
      await removeFromCart(id);
      load(type);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSubmitLending = async () => {
    setSubmitting(true);
    setError("");
    try {
      await submitLendingRequests();
      load(type);
      navigation.navigate("LendingHistory");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={font.h1}>PageTurn Cart</Text>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, type === "purchase" && styles.tabActive]} onPress={() => setType("purchase")}>
          <Text style={[styles.tabText, type === "purchase" && styles.tabTextActive]}>Purchasing (0)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, type === "lending" && styles.tabActive]} onPress={() => setType("lending")}>
          <Text style={[styles.tabText, type === "lending" && styles.tabTextActive]}>Borrowing</Text>
        </TouchableOpacity>
      </View>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => load(type)}
        ListEmptyComponent={!loading ? <EmptyState text="Your cart is empty." /> : null}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={font.h3}>{item.book?.title}</Text>
              <Text style={font.muted}>
                {type === "purchase"
                  ? `Qty ${item.quantity} · $${item.book?.price?.toFixed(2)}`
                  : `Borrow for ${item.lending_days} days`}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {type === "purchase" ? (
        <View>
          <View style={styles.summaryRow}>
            <Text style={font.h3}>Subtotal</Text>
            <Text style={font.h3}>${subtotal.toFixed(2)}</Text>
          </View>
          <PrimaryButton
            title="Proceed to Checkout"
            onPress={() => navigation.navigate("Checkout")}
            disabled={items.length === 0}
          />
        </View>
      ) : (
        <PrimaryButton
          title="Request to Borrow (Submit)"
          onPress={handleSubmitLending}
          loading={submitting}
          disabled={items.length === 0}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: "row", marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderBottomWidth: 2, borderBottomColor: colors.border },
  tabActive: { borderBottomColor: colors.navy },
  tabText: { color: colors.textMuted, fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: colors.navy },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  remove: { color: colors.danger, fontWeight: "600", fontSize: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
});
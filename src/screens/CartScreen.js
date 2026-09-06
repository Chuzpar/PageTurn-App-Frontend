import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, PrimaryButton, EmptyState, ErrorText } from "../components/UI";
import { ListRowSkeleton } from "../components/Skeleton";
import { fetchCart, removeFromCart, updateCartItem, submitLendingRequests } from "../services/api";
import { useToast } from "../context/ToastContext";
import { colors, font, spacing, radii } from "../theme";

export default function CartScreen({ route, navigation }) {
  const initialType = route?.params?.type || "purchase";
  const { showToast } = useToast();
  const [type, setType] = useState(initialType);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [counts, setCounts] = useState({ purchase: 0, lending: 0 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);

  const load = useCallback(async (cartType) => {
    setLoading(true);
    setError("");
    try {
      const [current, other] = await Promise.all([
        fetchCart(cartType),
        fetchCart(cartType === "purchase" ? "lending" : "purchase"),
      ]);
      setItems(current.items);
      setSubtotal(current.subtotal || 0);
      setCounts({
        purchase: cartType === "purchase" ? current.items.length : other.items.length,
        lending: cartType === "lending" ? current.items.length : other.items.length,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(type); }, [type, load]));

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      showToast("Removed from cart");
      load(type);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const nextQty = item.quantity + delta;
    if (nextQty < 1) return;
    setBusyItemId(item.id);
    try {
      await updateCartItem(item.id, { quantity: nextQty });
      load(type);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleSubmitLending = async () => {
    setSubmitting(true);
    setError("");
    try {
      await submitLendingRequests();
      showToast("Borrow request submitted");
      load(type);
      navigation.navigate("LendingHistory");
    } catch (e) {
      setError(e.message);
      showToast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={font.h1}>PageTurn Cart</Text>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, type === "purchase" && styles.tabActive]} onPress={() => setType("purchase")}>
          <Text style={[styles.tabText, type === "purchase" && styles.tabTextActive]}>Purchasing ({counts.purchase})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, type === "lending" && styles.tabActive]} onPress={() => setType("lending")}>
          <Text style={[styles.tabText, type === "lending" && styles.tabTextActive]}>Borrowing ({counts.lending})</Text>
        </TouchableOpacity>
      </View>

      <ErrorText>{error}</ErrorText>

      {loading && items.length === 0 ? (
        <ListRowSkeleton count={3} />
      ) : (
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
                {type === "purchase" ? (
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleQuantityChange(item, -1)}
                      disabled={busyItemId === item.id || item.quantity <= 1}
                    >
                      <Ionicons name="remove" size={14} color={colors.navy} />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => handleQuantityChange(item, 1)}
                      disabled={busyItemId === item.id}
                    >
                      <Ionicons name="add" size={14} color={colors.navy} />
                    </TouchableOpacity>
                    <Text style={[font.muted, { marginLeft: spacing.sm }]}>
                      ${(item.book?.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ) : (
                  <Text style={font.muted}>Borrow for {item.lending_days} days</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

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
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: { marginHorizontal: spacing.sm, fontWeight: "700", color: colors.text, fontSize: 13 },
  remove: { color: colors.danger, fontWeight: "600", fontSize: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
});

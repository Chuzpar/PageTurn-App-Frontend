import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, Badge, ErrorText } from "../../components/UI";
import { adminFetchOrders, adminApproveOrder, adminRejectOrder, adminAdvanceOrder } from "../../services/api";
import { colors, font, spacing, radii } from "../../theme";

const STATUS_TONE = { paid: "gold", approved: "success", shipped: "success", delivered: "success", cancelled: "danger" };
const NEXT_ACTION_LABEL = { approved: "Mark as Shipped", shipped: "Mark as Delivered" };

export default function AdminPurchaseManagementScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    adminFetchOrders()
      .then(({ orders }) => setOrders(orders))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const runAction = async (fn, id) => {
    setBusyId(id);
    setError("");
    try {
      await fn(id);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Screen>
      <Text style={font.h1}>Purchase Orders</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>{orders.length} total orders</Text>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="No orders placed yet." /> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={font.h3}>Order #{item.id}</Text>
              <Badge text={item.status.toUpperCase()} tone={STATUS_TONE[item.status] || "gold"} />
            </View>
            {item.items.map((oi) => (
              <Text key={oi.id} style={font.muted}>{oi.book?.title} × {oi.quantity}</Text>
            ))}
            <Text style={[font.h3, { marginTop: spacing.xs }]}>${item.total?.toFixed(2)}</Text>
            <Text style={font.muted}>{new Date(item.created_at).toLocaleString()}</Text>

            {item.status === "paid" && (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.reject]}
                  disabled={busyId === item.id}
                  onPress={() => runAction(adminRejectOrder, item.id)}
                >
                  <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approve]}
                  disabled={busyId === item.id}
                  onPress={() => runAction(adminApproveOrder, item.id)}
                >
                  <Text style={styles.approveText}>Approve</Text>
                </TouchableOpacity>
              </View>
            )}

            {(item.status === "approved" || item.status === "shipped") && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.advance, { marginTop: spacing.sm }]}
                disabled={busyId === item.id}
                onPress={() => runAction(adminAdvanceOrder, item.id)}
              >
                <Text style={styles.approveText}>{NEXT_ACTION_LABEL[item.status]}</Text>
              </TouchableOpacity>
            )}
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  actionsRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: radii.sm, alignItems: "center" },
  reject: { borderWidth: 1, borderColor: colors.danger },
  approve: { backgroundColor: colors.success },
  advance: { backgroundColor: colors.navy },
  rejectText: { color: colors.danger, fontWeight: "700", fontSize: 12 },
  approveText: { color: colors.white, fontWeight: "700", fontSize: 12 },
});

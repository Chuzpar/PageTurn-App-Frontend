import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, Badge, ErrorText } from "../../components/UI";
import { 
  adminFetchOrders, 
  adminApproveOrder, 
  adminRejectOrder, 
  adminAdvanceOrder 
} from "../../services/api";
import { colors, font, spacing, radii } from "../../theme";

// Status color mapping for badges
const STATUS_TONE = {
  paid: "gold",
  approved: "success",
  shipped: "success",
  delivered: "success",
  cancelled: "danger"
};

// Next action labels for order advancement
const NEXT_ACTION_LABEL = {
  approved: "Mark as Shipped",
  shipped: "Mark as Delivered"
};

/**
 * Admin Purchase Management Screen
 * Displays all purchase orders with approve/reject/advance actions
 */
export default function AdminPurchaseManagementScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Load orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetchOrders();
      setOrders(data.orders);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn, orderId) => {
    setBusyId(orderId);
    setError("");
    try {
      await actionFn(orderId);
      await loadOrders();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Order Header */}
      <View style={styles.headerRow}>
        <Text style={font.h3}>Order #{item.id}</Text>
        <Badge text={item.status.toUpperCase()} tone={STATUS_TONE[item.status] || "gold"} />
      </View>

      {/* Order Items */}
      {item.items.map((orderItem) => (
        <Text key={orderItem.id} style={font.muted}>
          {orderItem.book?.title} × {orderItem.quantity}
        </Text>
      ))}

      {/* Order Total and Date */}
      <Text style={[font.h3, { marginTop: spacing.xs }]}>
        ${item.total?.toFixed(2)}
      </Text>
      <Text style={font.muted}>
        {new Date(item.created_at).toLocaleString()}
      </Text>

      {/* Action Buttons */}
      {item.status === "paid" && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.reject]}
            disabled={busyId === item.id}
            onPress={() => handleAction(adminRejectOrder, item.id)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approve]}
            disabled={busyId === item.id}
            onPress={() => handleAction(adminApproveOrder, item.id)}
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Advance Button for approved/shipped orders */}
      {(item.status === "approved" || item.status === "shipped") && (
        <TouchableOpacity
          style={[styles.actionBtn, styles.advance, { marginTop: spacing.sm }]}
          disabled={busyId === item.id}
          onPress={() => handleAction(adminAdvanceOrder, item.id)}
        >
          <Text style={styles.approveText}>
            {NEXT_ACTION_LABEL[item.status]}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Screen>
      <Text style={font.h1}>Purchase Orders</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>
        {orders.length} total orders
      </Text>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={loadOrders}
        ListEmptyComponent={
          !loading ? <EmptyState text="No orders placed yet." /> : null
        }
        renderItem={renderOrderItem}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  reject: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  approve: {
    backgroundColor: colors.success,
  },
  advance: {
    backgroundColor: colors.navy,
  },
  rejectText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 12,
  },
  approveText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
});

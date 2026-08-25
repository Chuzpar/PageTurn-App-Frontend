import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, ErrorText } from "../../components/UI";
import { 
  adminFetchLendingRequests, 
  adminApproveLending, 
  adminRejectLending 
} from "../../services/api";
import { colors, font, spacing, radii } from "../../theme";

/**
 * Admin Lending Requests Screen
 * Displays pending lending requests with approve/reject actions
 */
export default function AdminLendingRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Load pending lending requests
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetchLendingRequests("pending");
      setRequests(data.requests);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setBusyId(requestId);
    setError("");
    try {
      await adminApproveLending(requestId);
      await loadRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (requestId) => {
    setBusyId(requestId);
    setError("");
    try {
      await adminRejectLending(requestId);
      await loadRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={font.h3}>{item.book?.title}</Text>
      <Text style={font.muted}>Requested for {item.lending_days} days</Text>
      <Text style={font.muted}>
        Requested {new Date(item.requested_at).toLocaleDateString()} · 
        Copies left: {item.book?.stock_for_lending}
      </Text>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.reject]}
          onPress={() => handleReject(item.id)}
          disabled={busyId === item.id}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.approve]}
          onPress={() => handleApprove(item.id)}
          disabled={busyId === item.id}
        >
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Screen>
      <Text style={font.h1}>Lending Requests</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>
        {requests.length} pending requests
      </Text>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={loadRequests}
        ListEmptyComponent={
          !loading ? <EmptyState text="No pending lending requests." /> : null
        }
        renderItem={renderRequestItem}
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

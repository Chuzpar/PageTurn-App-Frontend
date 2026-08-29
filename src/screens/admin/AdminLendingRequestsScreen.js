import React, { useState, useEffect, useCallback } from "react";
import { Text, FlatList, RefreshControl } from "react-native";
import { Screen, Card, PrimaryButton, SecondaryButton, EmptyState, ErrorText } from "../../components/UI";
import { adminApproveLending, adminRejectLending } from "../../services/api";
import { font, spacing } from "../../theme";

/**
 * Admin Lending Requests Screen
 * Lists pending lending requests for admin approval/rejection.
 * NOTE: Uses a placeholder empty list until a fetch-all-requests endpoint
 * is wired up — this screen exists so admin navigation doesn't crash.
 */
export default function AdminLendingRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const loadRequests = useCallback(async () => {
    setError("");
    // TODO: wire up a real "fetch all pending lending requests" endpoint.
    // For now this stays empty so the screen renders without crashing.
    setRequests([]);
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await adminApproveLending(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Failed to approve request.");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await adminRejectLending(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message || "Failed to reject request.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <Screen>
      <Text style={font.h1}>Lending Requests</Text>
      <Text style={[font.muted, { marginBottom: spacing.lg }]}>
        Review and approve borrowing requests
      </Text>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <EmptyState
            title="No pending requests"
            subtitle="New lending requests will show up here."
          />
        }
        renderItem={({ item }) => (
          <Card>
            <Text style={font.h3}>{item.book_title}</Text>
            <Text style={font.muted}>Requested by {item.user_name}</Text>
            <PrimaryButton
              title="Approve"
              onPress={() => handleApprove(item.id)}
              loading={actioningId === item.id}
              style={{ marginTop: spacing.sm }}
            />
            <SecondaryButton
              title="Reject"
              onPress={() => handleReject(item.id)}
              loading={actioningId === item.id}
              style={{ marginTop: spacing.sm }}
            />
          </Card>
        )}
      />
    </Screen>
  );
}

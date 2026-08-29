import React, { useState, useEffect, useCallback } from "react";
import { Text, ScrollView, RefreshControl } from "react-native";
import { Screen, Card, ErrorText } from "../../components/UI";
import { adminFetchDashboard } from "../../services/api";
import { font, spacing } from "../../theme";

/**
 * Admin Dashboard Screen
 * Shows high-level stats: total books, orders, pending lending requests, etc.
 */
export default function AdminDashboardScreen() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    setError("");
    try {
      const data = await adminFetchDashboard();
      setStats(data);
    } catch (e) {
      setError(e.message || "Failed to load dashboard stats.");
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Screen>
        <Text style={font.h1}>Admin Dashboard</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>
          Overview of store activity
        </Text>

        <ErrorText>{error}</ErrorText>

        <Card>
          <Text style={font.h3}>Total Books</Text>
          <Text style={font.body}>{stats?.total_books ?? "—"}</Text>
        </Card>

        <Card>
          <Text style={font.h3}>Pending Orders</Text>
          <Text style={font.body}>{stats?.pending_orders ?? "—"}</Text>
        </Card>

        <Card>
          <Text style={font.h3}>Pending Lending Requests</Text>
          <Text style={font.body}>{stats?.pending_lending_requests ?? "—"}</Text>
        </Card>

        <Card>
          <Text style={font.h3}>Total Members</Text>
          <Text style={font.body}>{stats?.total_members ?? "—"}</Text>
        </Card>
      </Screen>
    </ScrollView>
  );
}

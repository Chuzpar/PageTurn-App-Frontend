import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Card, SecondaryButton } from "../../components/UI";
import { adminFetchDashboard } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { colors, font, spacing } from "../../theme";

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      adminFetchDashboard().then(setStats);
    }, [])
  );

  return (
    <Screen>
      <Text style={font.h1}>Admin Panel</Text>
      <Text style={[font.muted, { marginBottom: spacing.lg }]}>Welcome back, {user?.full_name}</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.total_books ?? "—"}</Text>
          <Text style={font.muted}>Books</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.pending_lending_requests ?? "—"}</Text>
          <Text style={font.muted}>Pending Loans</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.active_loans ?? "—"}</Text>
          <Text style={font.muted}>Active Loans</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.total_orders ?? "—"}</Text>
          <Text style={font.muted}>Orders</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{stats?.orders_awaiting_approval ?? "—"}</Text>
          <Text style={font.muted}>Awaiting Approval</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>${stats?.total_revenue?.toFixed(2) ?? "—"}</Text>
          <Text style={font.muted}>Revenue</Text>
        </Card>
      </View>

      <SecondaryButton title="+ Add New Manuscript" onPress={() => navigation.navigate("AddManuscript")} style={{ marginTop: spacing.lg }} />
      <SecondaryButton title="Manage Books" onPress={() => navigation.navigate("AdminBooks")} style={{ marginTop: spacing.sm }} />
      <SecondaryButton title="Lending Requests" onPress={() => navigation.navigate("AdminLendingRequests")} style={{ marginTop: spacing.sm }} />
      <SecondaryButton title="Purchase Orders" onPress={() => navigation.navigate("AdminOrders")} style={{ marginTop: spacing.sm }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  statCard: { width: "47%", alignItems: "center", paddingVertical: spacing.lg },
  statValue: { fontSize: 26, fontWeight: "700", color: colors.navy },
});

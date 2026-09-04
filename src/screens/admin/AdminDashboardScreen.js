import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Card, SecondaryButton, PrimaryButton } from "../../components/UI";
import { adminFetchDashboard } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { colors, font, formatCurrency, spacing } from "../../theme";

export default function AdminDashboardScreen({ navigation }) {
	const { user, logout } = useAuth();
	const [stats, setStats] = useState(null);

	useFocusEffect(
		useCallback(() => {
			adminFetchDashboard().then(setStats).catch(() => setStats({}));
		}, [])
	);

	return (
		<Screen>
			<Text style={font.h1}>Admin Panel</Text>
			<Text style={[font.muted, { marginBottom: spacing.lg }]}>Welcome back, {user?.full_name}</Text>

			<View style={styles.statsRow}>
				<StatCard value={stats?.total_books} label="Books" />
				<StatCard value={stats?.pending_lending_requests} label="Pending Loans" />
				<StatCard value={stats?.active_loans} label="Active Loans" />
				<StatCard value={stats?.total_orders} label="Orders" />
				<StatCard value={stats?.orders_awaiting_approval} label="Awaiting Approval" />
				<StatCard value={stats?.total_revenue == null ? null : formatCurrency(stats.total_revenue)} label="Revenue" />
			</View>

			<SecondaryButton title="+ Add New Manuscript" onPress={() => navigation.navigate("AddManuscript")} style={{ marginTop: spacing.lg }} />
			<SecondaryButton title="Manage Books" onPress={() => navigation.navigate("Books")} />
			<SecondaryButton title="Lending Requests" onPress={() => navigation.navigate("Lending")} />
			<SecondaryButton title="Purchase Orders" onPress={() => navigation.navigate("Orders")} />
		<PrimaryButton title="Log Out" onPress={logout} style={{ marginTop: spacing.lg }} />		</Screen>
	);
}

function StatCard({ value, label }) {
	return (
		<Card style={styles.statCard}>
			<Text style={styles.statValue}>{value ?? "-"}</Text>
			<Text style={font.muted}>{label}</Text>
		</Card>
	);
}

const styles = StyleSheet.create({
	statsRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
	statCard: { width: "47%", alignItems: "center", paddingVertical: spacing.lg },
	statValue: { fontSize: 26, fontWeight: "700", color: colors.navy },
});

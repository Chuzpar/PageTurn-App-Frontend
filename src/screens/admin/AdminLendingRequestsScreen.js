import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, ErrorText } from "../../components/UI";
import { adminFetchLendingRequests, adminApproveLending, adminRejectLending } from "../../services/api";
import { colors, font, radii, spacing } from "../../theme";

export default function AdminLendingRequestsScreen() {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const load = useCallback(async () => {
		setLoading(true);
		try { setRequests((await adminFetchLendingRequests("pending")).requests || []); }
		catch (e) { setError(e.message); }
		finally { setLoading(false); }
	}, []);
	useFocusEffect(useCallback(() => { load(); }, [load]));

	const action = async (fn, id) => { try { await fn(id); load(); } catch (e) { setError(e.message); } };
	return (
		<Screen>
			<Text style={font.h1}>Lending Requests</Text>
			<Text style={[font.muted, { marginBottom: spacing.md }]}>{requests.length} pending requests</Text>
			<ErrorText>{error}</ErrorText>
			<FlatList data={requests} keyExtractor={(item) => String(item.id)} refreshing={loading} onRefresh={load}
				ListEmptyComponent={!loading ? <EmptyState text="No pending lending requests." /> : null}
				renderItem={({ item }) => <View style={styles.card}>
					<Text style={font.h3}>{item.book?.title || "Book request"}</Text>
					<Text style={font.muted}>Requested for {item.lending_days} days</Text>
					<View style={styles.actions}>
						<TouchableOpacity style={styles.reject} onPress={() => action(adminRejectLending, item.id)}><Text style={{ color: colors.danger }}>Reject</Text></TouchableOpacity>
						<TouchableOpacity style={styles.approve} onPress={() => action(adminApproveLending, item.id)}><Text style={{ color: colors.white }}>Approve</Text></TouchableOpacity>
					</View>
				</View>}
			/>
		</Screen>
	);
}

const styles = StyleSheet.create({
	card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.sm },
	actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
	reject: { flex: 1, alignItems: "center", padding: spacing.sm, borderWidth: 1, borderColor: colors.danger, borderRadius: radii.sm },
	approve: { flex: 1, alignItems: "center", padding: spacing.sm, backgroundColor: colors.success, borderRadius: radii.sm },
});

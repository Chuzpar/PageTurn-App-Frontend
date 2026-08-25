import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, Badge, PrimaryButton, ErrorText } from "../components/UI";
import { fetchMyLendingRequests, returnBook } from "../services/api";
import { colors, font, spacing, radii } from "../theme";

const STATUS_TONE = { pending: "gold", approved: "success", rejected: "danger", returned: "gold" };

export default function LendingHistoryScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    fetchMyLendingRequests()
      .then(({ requests }) => setRequests(requests))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleReturn = async (id) => {
    setError("");
    try {
      await returnBook(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const pendingReturn = requests.filter((r) => r.status === "approved");

  return (
    <Screen>
      <Text style={font.h1}>Your Literary Record</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>Borrowed {pendingReturn.length}</Text>

      <ErrorText>{error}</ErrorText>

      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        ListEmptyComponent={!loading ? <EmptyState text="No lending activity yet." /> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={font.h3}>{item.book?.title}</Text>
              <Badge text={item.status.toUpperCase()} tone={STATUS_TONE[item.status]} />
            </View>
            {item.status === "approved" && (
              <>
                <Text style={font.muted}>Due {new Date(item.due_date).toLocaleDateString()}</Text>
                <TouchableOpacity onPress={() => handleReturn(item.id)} style={styles.returnBtn}>
                  <Text style={styles.returnText}>Initiate Return</Text>
                </TouchableOpacity>
              </>
            )}
            {item.status === "pending" && <Text style={font.muted}>Awaiting Reviewing approval</Text>}
            {item.status === "returned" && (
              <Text style={font.muted}>Returned {new Date(item.returned_at).toLocaleDateString()}</Text>
            )}
            {item.status === "rejected" && <Text style={font.muted}>Request was declined</Text>}
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
  returnBtn: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: colors.gold,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  returnText: { color: colors.white, fontWeight: "700", fontSize: 12 },
});
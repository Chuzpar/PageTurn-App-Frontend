import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, EmptyState, Badge, ErrorText } from "../components/UI";
import { ListRowSkeleton } from "../components/Skeleton";
import { fetchMyLendingRequests, returnBook } from "../services/api";
import { useToast } from "../context/ToastContext";
import { colors, font, spacing, radii } from "../theme";

const STATUS_TONE = { pending: "gold", approved: "success", rejected: "danger", returned: "gold" };

function dueDateInfo(dueDateStr) {
  const due = new Date(dueDateStr);
  const daysLeft = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { text: `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"}`, tone: colors.danger };
  if (daysLeft <= 2) return { text: daysLeft === 0 ? "Due today" : `Due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`, tone: colors.danger };
  return { text: `Due ${due.toLocaleDateString()}`, tone: colors.textMuted };
}

export default function LendingHistoryScreen() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

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
    setBusyId(id);
    try {
      await returnBook(id);
      showToast("Return started — thanks for bringing it back!");
      load();
    } catch (e) {
      setError(e.message);
      showToast(e.message, "error");
    } finally {
      setBusyId(null);
    }
  };

  const pendingReturn = requests.filter((r) => r.status === "approved");

  return (
    <Screen>
      <Text style={font.h1}>Your Literary Record</Text>
      <Text style={[font.muted, { marginBottom: spacing.md }]}>Borrowed {pendingReturn.length}</Text>

      <ErrorText>{error}</ErrorText>

      {loading && requests.length === 0 ? (
        <ListRowSkeleton count={3} />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          refreshing={loading}
          onRefresh={load}
          ListEmptyComponent={!loading ? <EmptyState text="No lending activity yet." icon="library-outline" /> : null}
          renderItem={({ item }) => {
            const due = item.status === "approved" ? dueDateInfo(item.due_date) : null;
            return (
              <View style={styles.card}>
                <View style={styles.headerRow}>
                  <Text style={font.h3}>{item.book?.title}</Text>
                  <Badge text={item.status.toUpperCase()} tone={STATUS_TONE[item.status]} />
                </View>
                {item.status === "approved" && (
                  <>
                    <Text style={[font.muted, { color: due.tone, fontWeight: due.tone === colors.danger ? "700" : "400" }]}>
                      {due.text}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleReturn(item.id)}
                      style={styles.returnBtn}
                      disabled={busyId === item.id}
                    >
                      <Text style={styles.returnText}>{busyId === item.id ? "Returning..." : "Initiate Return"}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {item.status === "pending" && <Text style={font.muted}>Awaiting admin approval</Text>}
                {item.status === "returned" && (
                  <Text style={font.muted}>Returned {new Date(item.returned_at).toLocaleDateString()}</Text>
                )}
                {item.status === "rejected" && <Text style={font.muted}>Request was declined</Text>}
              </View>
            );
          }}
        />
      )}
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

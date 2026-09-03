import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Field, EmptyState, ErrorText } from "../components/UI";
import { API_BASE_URL, fetchBooks } from "../services/api";
import { colors } from "../theme";

const resolveImage = (book) => {
  const value = book?.image || book?.cover_image || book?.coverImage || book?.image_url || book?.imageUrl;
  if (!value) return null;
  if (typeof value === "object" && value.uri) return value;
  if (/^(https?:\/\/|data:)/i.test(value)) return { uri: value };
  return { uri: `${API_BASE_URL.replace(/\/api$/, "")}/${String(value).replace(/^\//, "")}` };
};

function LendingCard({ book, onDetails, onBorrow }) {
  const available = Number(book.stock_for_lending) > 0;
  const image = resolveImage(book);

  return (
    <View style={styles.bookCard}>
      <View style={styles.cover}>
        {image ? <Image source={image} style={styles.coverImage} resizeMode="cover" /> : <Text style={styles.coverInitial}>{book.title?.[0] || "?"}</Text>}
      </View>
      <View style={styles.bookInfo}>
        <View style={[styles.badge, available ? styles.availableBadge : styles.lentBadge]}>
          <Text style={[styles.badgeText, !available && styles.lentBadgeText]}>{available ? "AVAILABLE" : "LENT OUT"}</Text>
        </View>
        <Text style={styles.duration}>{available ? `${book.lending_days || 14} Days Borrow` : "Due Oct 24"}</Text>
        <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.borrowButton} onPress={onBorrow} accessibilityRole="button"><Text style={styles.borrowText}>Borrow</Text></Pressable>
          <Pressable style={styles.detailsButton} onPress={onDetails} accessibilityRole="button"><Text style={styles.detailsText}>Details</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

export default function LibraryScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort: "rating" };
      if (query) params.q = query;
      const { books } = await fetchBooks(params);
      setBooks(books);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    
  }, [query]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.brand}>PageTurn Library</Text>
        <Pressable onPress={() => setShowSearch((visible) => !visible)} accessibilityLabel="Search library"><Ionicons name="search-outline" size={32} color={colors.navy} /></Pressable>
      </View>
      {showSearch ? <Field style={styles.search} placeholder="Search the lending catalogue..." value={query} onChangeText={setQuery} autoFocus /> : null}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Community Lending Registry</Text>
        <Text style={styles.heroText}>Borrow books shared by fellow readers. Return on time to keep your literary standing spotless.</Text>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Lending Catalog</Text>}
        ListEmptyComponent={!loading ? <EmptyState text="No books currently available to borrow." /> : null}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.navy} style={styles.loader} /> : <ErrorText>{error}</ErrorText>}
        renderItem={({ item }) => (
          <LendingCard
            book={item}
            onDetails={() => navigation.navigate("BookDetail", { bookId: item.id, mode: "lending" })}
            onBorrow={() => navigation.navigate("BookDetail", { bookId: item.id, mode: "lending" })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0, backgroundColor: colors.background },
  header: { height: 52, paddingHorizontal: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { color: colors.navy, fontFamily: "Georgia", fontSize: 19, fontWeight: "700" },
  search: { margin: 10 },
  hero: { paddingHorizontal: 18, paddingVertical: 15, backgroundColor: "#FFF2C8", borderBottomWidth: 1, borderBottomColor: colors.border },
  heroTitle: { color: "#A64B16", fontFamily: "Georgia", fontSize: 17, fontWeight: "700", marginBottom: 9 },
  heroText: { color: colors.textMuted, fontSize: 14, lineHeight: 18 },
  list: { paddingHorizontal: 14, paddingTop: 14, paddingBottom: 24 },
  sectionTitle: { color: colors.navy, fontFamily: "Georgia", fontSize: 19, fontWeight: "700", marginBottom: 12 },
  bookCard: { minHeight: 150, marginBottom: 12, padding: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 8, flexDirection: "row" },
  cover: { width: 84, height: 126, backgroundColor: "#EDE7D7", borderRadius: 5, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  coverImage: { width: "100%", height: "100%" },
  coverInitial: { color: colors.navy, fontFamily: "Georgia", fontSize: 28, fontWeight: "700" },
  bookInfo: { flex: 1, paddingLeft: 15, minWidth: 0 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 7, paddingVertical: 4, borderRadius: 4 },
  availableBadge: { backgroundColor: "#D8F8E5" },
  lentBadge: { backgroundColor: "#FFF0BB" },
  badgeText: { color: colors.success, fontSize: 10, fontWeight: "800" },
  lentBadgeText: { color: "#A64B16" },
  duration: { position: "absolute", right: 0, top: 4, color: "#8B94A8", fontSize: 10 },
  bookTitle: { marginTop: 6, color: colors.navy, fontFamily: "Georgia", fontSize: 16, fontWeight: "700" },
  author: { marginTop: 2, color: colors.textMuted, fontSize: 14 },
  actions: { flexDirection: "row", gap: 7, marginTop: 7 },
  borrowButton: { backgroundColor: colors.navy, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 6 },
  borrowText: { color: colors.white, fontSize: 12, fontWeight: "700" },
  detailsButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5 },
  detailsText: { color: colors.textMuted, fontSize: 12 },
  loader: { marginVertical: 14 },
});

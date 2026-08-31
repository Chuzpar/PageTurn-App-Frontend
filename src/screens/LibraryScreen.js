import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Card, LoadingSpinner, ErrorText } from "../components/UI";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { font, spacing, colors } from "../theme";

export default function LibraryScreen({ navigation }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadLibrary = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      console.log("📚 Fetching library for user:", user?.email);
      
      // Use the correct endpoint: /auth/library
      const response = await api.get("/auth/library");
      console.log("📚 Library data received:", response.data);
      setBooks(response.data || []);
      
    } catch (e) {
      console.error("📚 Library error:", e);
      setError(e.message || "Failed to load your library.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadLibrary();
    }, [loadLibrary])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLibrary();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl }}>
          <LoadingSpinner />
          <Text style={[font.muted, { marginTop: spacing.md }]}>Loading your library...</Text>
        </View>
      </Screen>
    );
  }

  const renderBook = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
      style={{
        flex: 1,
        margin: spacing.sm,
        maxWidth: "45%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: spacing.sm,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {item.cover_image ? (
        <Image
          source={{ uri: item.cover_image }}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 4,
            resizeMode: "cover",
          }}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 150,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 40 }}>📚</Text>
          <Text style={[font.small, font.muted]}>No Cover</Text>
        </View>
      )}
      <Text style={[font.body, { fontWeight: "bold", marginTop: spacing.xs }]} numberOfLines={1}>
        {item.title || "Untitled"}
      </Text>
      <Text style={[font.small, font.muted]} numberOfLines={1}>
        {item.author || "Unknown Author"}
      </Text>
      {item.type && (
        <View style={{ 
          backgroundColor: item.type === 'purchased' ? '#4CAF50' : '#2196F3',
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginTop: 4,
          alignSelf: 'flex-start'
        }}>
          <Text style={{ color: 'white', fontSize: 10 }}>
            {item.type === 'purchased' ? '💰 Purchased' : '📖 Borrowed'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Screen>
        <Text style={font.h1}>My Library</Text>
        <Text style={[font.muted, { marginBottom: spacing.md }]}>
          {books.length} {books.length === 1 ? "book" : "books"} in your collection
        </Text>

        <ErrorText>{error}</ErrorText>

        {books.length === 0 ? (
          <Card>
            <View style={{ padding: spacing.lg, alignItems: "center" }}>
              <Text style={{ fontSize: 48, marginBottom: spacing.md }}>📚</Text>
              <Text style={[font.body, { textAlign: "center", marginBottom: spacing.sm }]}>
                Your library is empty.
              </Text>
              <Text style={[font.muted, { textAlign: "center" }]}>
                Visit the Book Store to purchase books or borrow from the lending library.
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: spacing.md,
                  backgroundColor: colors.primary || "#007AFF",
                  padding: spacing.md,
                  borderRadius: 8,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("Store")}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Browse Books</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: spacing.lg }}
          />
        )}
      </Screen>
    </ScrollView>
  );
}

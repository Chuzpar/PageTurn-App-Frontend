import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Screen,
  Card,
  SecondaryButton,
  PrimaryButton,
  Badge,
  EmptyState,
} from "../components/UI";
import BookCard from "../components/BookCard";
import AvatarPicker from "../components/AvatarPicker";
import { useAuth } from "../context/AuthContext";
import { fetchFavorites, updateProfile } from "../services/api";
import { font, spacing, colors, radii } from "../theme";

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAdmin, updateProfile: setUserProfile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (isAdmin) return;
    setLoadingFavs(true);
    try {
      const data = await fetchFavorites();
      const list = data.favorites || data || [];
      setFavorites(list);
    } catch {
      setFavorites([]);
    } finally {
      setLoadingFavs(false);
    }
  }, [isAdmin]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const onAvatarChange = async (url) => {
    try {
      const updated = await updateProfile({ avatar_url: url });
      if (setUserProfile && updated?.user) {
        // AuthContext may expose updateProfile already
      }
    } catch (e) {
      console.warn(e.message);
    }
  };

  return (
    <Screen>
      <Text style={font.h1}>Profile</Text>

      <View style={styles.avatarRow}>
        <AvatarPicker
          value={user?.avatar_url}
          onChange={onAvatarChange}
          size={96}
        />
      </View>

      <Card style={{ marginBottom: spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View>
            <Text style={font.h3}>{user?.full_name}</Text>
            <Text style={font.muted}>{user?.email}</Text>
          </View>
          {isAdmin ? <Badge text="ADMIN" /> : null}
        </View>
      </Card>

      <SecondaryButton
        title="Account Settings"
        onPress={() => navigation.navigate("AccountSettings")}
        style={{ marginBottom: spacing.sm }}
      />

      {!isAdmin && (
        <>
          <SecondaryButton
            title="Purchase History"
            onPress={() => navigation.navigate("PurchaseHistory")}
            style={{ marginBottom: spacing.sm }}
          />
          <SecondaryButton
            title="Your Literary Record (Borrowed)"
            onPress={() => navigation.navigate("LendingHistory")}
            style={{ marginBottom: spacing.md }}
          />

          <Text style={[font.h2, { marginBottom: spacing.sm }]}>
            My Favorites
          </Text>
          {favorites.length === 0 && !loadingFavs ? (
            <EmptyState text="No favorites yet. Tap the heart on a book." />
          ) : (
            <FlatList
              data={favorites}
              keyExtractor={(item) =>
                String(item.id || item.book?.id)
              }
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const book = item.book || item;
                return (
                  <BookCard
                    book={book}
                    onPress={() =>
                      navigation.navigate("BookDetail", {
                        bookId: book.id,
                      })
                    }
                  />
                );
              }}
            />
          )}
        </>
      )}

      <PrimaryButton
        title="Log Out"
        onPress={logout}
        style={{ marginTop: spacing.lg }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarRow: { alignItems: "center", marginVertical: spacing.md },
});
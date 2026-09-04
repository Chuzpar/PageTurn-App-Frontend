import React from "react";
import { View, Text, Image } from "react-native";
import { Screen, Card, SecondaryButton, PrimaryButton, Badge } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { font, spacing } from "../theme";

export default function ProfileScreen({ navigation }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <Screen>
      <Text style={font.h1}>Profile</Text>
      <Card style={{ marginTop: spacing.md, marginBottom: spacing.lg }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          {user?.avatar_url ? <Image source={{ uri: user.avatar_url }} style={styles.avatar} /> : null}
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
            style={{ marginBottom: spacing.lg }}
          />
        </>
      )}

      <PrimaryButton title="Log Out" onPress={logout} style={{ marginTop: isAdmin ? spacing.lg : 0 }} />
    </Screen>
  );
}

const styles = {
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: spacing.md },
};

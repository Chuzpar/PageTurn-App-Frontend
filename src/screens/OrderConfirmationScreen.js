import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Screen, PrimaryButton, SecondaryButton } from "../components/UI";
import { colors, font, spacing, radii } from "../theme";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { order, redirectUrl } = route.params;

  return (
    <Screen style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={[font.h1, { marginTop: spacing.lg }]}>Order Created</Text>
      <Text style={[font.muted, { textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        Order #{order.id} · Total ${order.total?.toFixed(2)} · Payment pending
      </Text>

      {redirectUrl ? (
        <PrimaryButton title="Continue to Pesapal" onPress={() => Linking.openURL(redirectUrl)} style={{ width: "100%" }} />
      ) : null}

      <PrimaryButton
        title="View Purchase History"
        onPress={() => navigation.navigate("PurchaseHistory")}
        style={{ width: "100%", marginTop: spacing.sm }}
      />
      <SecondaryButton
        title="Continue Shopping"
        onPress={() => navigation.navigate("StoreMain")}
        style={{ width: "100%", marginTop: spacing.sm }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: colors.white, fontSize: 44, fontWeight: "700" },
});

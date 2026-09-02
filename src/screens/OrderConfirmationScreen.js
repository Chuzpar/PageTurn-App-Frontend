import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Screen, PrimaryButton, SecondaryButton } from "../components/UI";
import { colors, font, formatCurrency, spacing, radii } from "../theme";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { order } = route.params;

  return (
    <Screen style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={styles.checkCircle}>
        <Text style={styles.checkMark}>✓</Text>
      </View>
      <Text style={[font.h1, { marginTop: spacing.lg }]}>Order Confirmed!</Text>
      <Text style={[font.muted, { textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.lg }]}>
        Order #{order.id} · Total {formatCurrency(order.total)}
      </Text>

      <PrimaryButton
        title="View Purchase History"
        onPress={() => navigation.navigate("PurchaseHistory")}
        style={{ width: "100%" }}
      />
      <SecondaryButton
        title="Continue Shopping"
        onPress={() => navigation.navigate("MemberHome", { screen: "Store" })}
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
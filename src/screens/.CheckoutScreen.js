import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Field, PrimaryButton, ErrorText } from "../components/UI";
import { colors, font, spacing, radii } from "../theme";

export default function CheckoutScreen({ navigation }) {
  const [method, setMethod] = useState("card"); // "card" | "pesapal"
  const [address, setAddress] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");
    if (!address.trim()) return setError("Shipping address is required.");

    if (method === "pesapal") {
      navigation.navigate("ReviewOrder", { shipping_address: address, payment_method: "pesapal" });
      return;
    }

    if (!cardName.trim()) return setError("Name on card is required.");
    if (cardNumber.replace(/\s/g, "").length < 12) return setError("Enter a valid card number.");
    if (!expiry || !cvv) return setError("Enter the card expiry and CVV.");

    navigation.navigate("ReviewOrder", {
      shipping_address: address,
      payment_method: "card",
      card_number: cardNumber,
      card_name: cardName,
      expiry,
    });
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Secure Checkout</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>Choose how you'd like to pay</Text>

        <ErrorText>{error}</ErrorText>

        <Text style={[font.h3, { marginBottom: spacing.sm }]}>Shipping Address</Text>
        <Field
          label="Address"
          placeholder="123 Main St, City, State ZIP"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={[font.h3, { marginBottom: spacing.sm, marginTop: spacing.md }]}>Payment Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodCard, method === "card" && styles.methodCardActive]}
            onPress={() => setMethod("card")}
          >
            <Ionicons name="card-outline" size={20} color={method === "card" ? colors.white : colors.navy} />
            <Text style={[styles.methodText, method === "card" && styles.methodTextActive]}>Debit / Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodCard, method === "pesapal" && styles.methodCardActive]}
            onPress={() => setMethod("pesapal")}
          >
            <Ionicons name="phone-portrait-outline" size={20} color={method === "pesapal" ? colors.white : colors.navy} />
            <Text style={[styles.methodText, method === "pesapal" && styles.methodTextActive]}>Pesapal (M-Pesa, Airtel, Card)</Text>
          </TouchableOpacity>
        </View>

        {method === "card" ? (
          <>
            <Field label="Name on Card" placeholder="Alex Reader" value={cardName} onChangeText={setCardName} />
            <Field
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <Field label="Expiry Date" placeholder="MM/YY" value={expiry} onChangeText={setExpiry} />
            <Field label="CVV" placeholder="123" keyboardType="number-pad" secureTextEntry value={cvv} onChangeText={setCvv} />
          </>
        ) : (
          <Text style={[font.muted, { marginBottom: spacing.md }]}>
            You'll be taken to Pesapal's secure checkout to pay with M-Pesa, Airtel Money, or a card.
            No card details are entered in this app.
          </Text>
        )}

        <PrimaryButton title="Review Order" onPress={handleContinue} />
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  methodRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  methodCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.card,
  },
  methodCardActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  methodText: { fontSize: 12, fontWeight: "600", color: colors.navy, textAlign: "center", marginTop: spacing.xs },
  methodTextActive: { color: colors.white },
});

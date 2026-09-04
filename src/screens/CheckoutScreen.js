import React, { useState } from "react";
import { Text, ScrollView } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../components/UI";
import { font, spacing } from "../theme";

export default function CheckoutScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");
    if (!address.trim()) return setError("Shipping address is required.");
    if (!cardName.trim()) return setError("Name on card is required.");
    if (cardNumber.replace(/\s/g, "").length < 12) return setError("Enter a valid card number.");
    if (!expiry || !cvv) return setError("Enter the card expiry and CVV.");

    navigation.navigate("ReviewOrder", {
      shipping_address: address,
      card_number: cardNumber,
      card_name: cardName,
      expiry,
    });
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Secure Checkout</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>Monthly Rest Pay available</Text>

        <ErrorText>{error}</ErrorText>

        <Text style={[font.h3, { marginBottom: spacing.sm }]}>Shipping Address</Text>
        <Field
          label="Address"
          placeholder="123 Main St, City, State ZIP"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={[font.h3, { marginBottom: spacing.sm, marginTop: spacing.md }]}>Debit / Credit Card</Text>
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

        <PrimaryButton title="Review Order" onPress={handleContinue} />
      </Screen>
    </ScrollView>
  );
}

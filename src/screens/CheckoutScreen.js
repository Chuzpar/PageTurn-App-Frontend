import React, { useState } from "react";
import { Text, ScrollView } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../components/UI";
import { font, spacing } from "../theme";

export default function CheckoutScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");
    if (!address.trim()) return setError("Shipping address is required.");
    navigation.navigate("ReviewOrder", {
      shipping_address: address,
    });
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Secure Checkout</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>You will complete payment securely with Pesapal.</Text>

        <ErrorText>{error}</ErrorText>

        <Text style={[font.h3, { marginBottom: spacing.sm }]}>Shipping Address</Text>
        <Field
          label="Address"
          placeholder="123 Main St, City, State ZIP"
          value={address}
          onChangeText={setAddress}
        />

        <PrimaryButton title="Review Order" onPress={handleContinue} />
      </Screen>
    </ScrollView>
  );
}

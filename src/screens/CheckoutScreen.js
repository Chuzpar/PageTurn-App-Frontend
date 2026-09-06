import React, { useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../components/UI";
import { font, spacing, colors } from "../theme";
import { checkout } from "../services/api";

export default function CheckoutScreen({ navigation }) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa"); // mpesa | card
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setError("");
    if (!address.trim()) {
      setError("Shipping address is required.");
      return;
    }

    if (paymentMethod === "mpesa") {
      if (!phone.trim()) {
        setError("Phone number is required for M-Pesa / mobile money.");
        return;
      }
    } else {
      if (
        !cardName.trim() ||
        cardNumber.replace(/\s/g, "").length < 12 ||
        !expiry ||
        !cvv
      ) {
        setError("Please fill all card details.");
        return;
      }
    }

    setLoading(true);
    try {
      const result = await checkout({
        shipping_address: address,
        phone: phone || undefined,
        billing_address: {
          email_address: undefined,
          phone_number: phone || undefined,
          first_name: cardName.split(" ")[0] || undefined,
          last_name: cardName.split(" ").slice(1).join(" ") || undefined,
        },
      });

      // Pesapal returns redirect_url when credentials are configured
      if (result.redirect_url && typeof window !== "undefined") {
        window.open(result.redirect_url, "_blank");
      }

      navigation.navigate("OrderConfirmation", {
        order: result.order,
        redirect_url: result.redirect_url,
      });
    } catch (e) {
      setError(e.message || "Payment failed. Check that the cart is not empty and the API is reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Secure Checkout</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>
          Payment is processed securely via Pesapal (M-Pesa / card).
        </Text>

        <ErrorText>{error}</ErrorText>

        <Text style={[font.h3, { marginBottom: spacing.sm }]}>Shipping Address</Text>
        <Field
          label="Address"
          placeholder="123 Main St, Nairobi"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={[font.h3, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
          Payment Method
        </Text>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodBtn, paymentMethod === "mpesa" && styles.methodActive]}
            onPress={() => setPaymentMethod("mpesa")}
          >
            <Text style={paymentMethod === "mpesa" ? styles.methodTextActive : styles.methodText}>
              M-Pesa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodBtn, paymentMethod === "card" && styles.methodActive]}
            onPress={() => setPaymentMethod("card")}
          >
            <Text style={paymentMethod === "card" ? styles.methodTextActive : styles.methodText}>
              Card
            </Text>
          </TouchableOpacity>
        </View>

        {paymentMethod === "mpesa" ? (
          <Field
            label="M-Pesa Phone Number"
            placeholder="07XXXXXXXX or 2547XXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        ) : (
          <>
            <Field label="Name on Card" value={cardName} onChangeText={setCardName} />
            <Field
              label="Card Number"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <Field label="Expiry (MM/YY)" value={expiry} onChangeText={setExpiry} />
            <Field
              label="CVV"
              keyboardType="number-pad"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </>
        )}

        <PrimaryButton
          title={paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Pay with Card"}
          onPress={handlePay}
          loading={loading}
          style={{ marginTop: spacing.md }}
        />
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  methodRow: { flexDirection: "row", marginBottom: spacing.md },
  methodBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border || "#ccc",
    alignItems: "center",
    marginRight: 8,
    borderRadius: 8,
  },
  methodActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  methodText: { color: colors.textMuted || "#666", fontWeight: "600" },
  methodTextActive: { color: "#fff", fontWeight: "600" },
});
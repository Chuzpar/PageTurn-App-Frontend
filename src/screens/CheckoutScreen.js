import React, { useState } from "react";
import { Text, ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../components/UI";
import { font, spacing, colors } from "../theme";
<<<<<<< HEAD
import { checkout } from "../services/api";
=======
import { checkout, mpesaStkPush } from "../services/api";
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be

export default function CheckoutScreen({ navigation, route }) {
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
<<<<<<< HEAD
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
=======
    if (!address.trim()) return setError("Shipping address is required.");

    if (paymentMethod === "mpesa") {
      if (!phone.trim()) return setError("Phone number is required for M-Pesa.");
    } else {
      if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 12 || !expiry || !cvv) {
        return setError("Please fill all card details.");
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
      }
    }

    setLoading(true);
    try {
<<<<<<< HEAD
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
=======
      let result;
      if (paymentMethod === "mpesa") {
        result = await mpesaStkPush({
          shipping_address: address,
          phone,
        });
      } else {
        result = await checkout({
          shipping_address: address,
          card_number: cardNumber,
        });
      }
      navigation.navigate("OrderConfirmation", { order: result.order });
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Payment failed");
    } finally {
      setLoading(false);
    }
    navigation.navigate("ReviewOrder", {
      shipping_address: address,
    });
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
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
<<<<<<< HEAD
        <Field
          label="Address"
          placeholder="123 Main St, Nairobi"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={[font.h3, { marginTop: spacing.md, marginBottom: spacing.sm }]}>
          Payment Method
        </Text>
=======
        <Field label="Address" placeholder="123 Main St, Nairobi" value={address} onChangeText={setAddress} />

        <Text style={[font.h3, { marginTop: spacing.md, marginBottom: spacing.sm }]}>Payment Method</Text>
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodBtn, paymentMethod === "mpesa" && styles.methodActive]}
            onPress={() => setPaymentMethod("mpesa")}
          >
<<<<<<< HEAD
            <Text style={paymentMethod === "mpesa" ? styles.methodTextActive : styles.methodText}>
              M-Pesa
            </Text>
=======
            <Text style={paymentMethod === "mpesa" ? styles.methodTextActive : styles.methodText}>M-Pesa</Text>
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodBtn, paymentMethod === "card" && styles.methodActive]}
            onPress={() => setPaymentMethod("card")}
          >
<<<<<<< HEAD
            <Text style={paymentMethod === "card" ? styles.methodTextActive : styles.methodText}>
              Card
            </Text>
=======
            <Text style={paymentMethod === "card" ? styles.methodTextActive : styles.methodText}>Card</Text>
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
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
<<<<<<< HEAD
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
=======
            <Field label="Card Number" keyboardType="number-pad" value={cardNumber} onChangeText={setCardNumber} />
            <Field label="Expiry (MM/YY)" value={expiry} onChangeText={setExpiry} />
            <Field label="CVV" keyboardType="number-pad" secureTextEntry value={cvv} onChangeText={setCvv} />
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
          </>
        )}

        <PrimaryButton
          title={paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Pay with Card"}
          onPress={handlePay}
          loading={loading}
<<<<<<< HEAD
          style={{ marginTop: spacing.md }}
        />
=======
        />
        <PrimaryButton title="Review Order" onPress={handleContinue} />
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
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
<<<<<<< HEAD
    borderColor: colors.border || "#ccc",
=======
    borderColor: colors.border,
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
    alignItems: "center",
    marginRight: 8,
    borderRadius: 8,
  },
  methodActive: { backgroundColor: colors.navy, borderColor: colors.navy },
<<<<<<< HEAD
  methodText: { color: colors.textMuted || "#666", fontWeight: "600" },
=======
  methodText: { color: colors.textMuted, fontWeight: "600" },
>>>>>>> f2a60323592ee0397732353b9c94f4992055a8be
  methodTextActive: { color: "#fff", fontWeight: "600" },
});
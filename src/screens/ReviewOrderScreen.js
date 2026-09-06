import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { Screen, PrimaryButton, SecondaryButton, ErrorText, Card } from "../components/UI";
import { fetchCart, checkout, initiatePesapalPayment, verifyPesapalPayment } from "../services/api";
import { colors, font, spacing } from "../theme";

export default function ReviewOrderScreen({ route, navigation }) {
  const { shipping_address, card_number, payment_method = "card" } = route.params;
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [pesapalStatus, setPesapalStatus] = useState(null); // null | "awaiting" | "checking" | "failed"
  const [pendingOrderId, setPendingOrderId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchCart("purchase").then((data) => {
        setItems(data.items);
        setSubtotal(data.subtotal || 0);
      });
    }, [])
  );

  const shippingFee = subtotal > 0 ? 4.99 : 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shippingFee + tax).toFixed(2);

  const handlePlaceOrderWithCard = async () => {
    setPlacing(true);
    setError("");
    try {
      const { order } = await checkout({ shipping_address, card_number });
      navigation.replace("OrderConfirmation", { order });
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  const handlePayWithPesapal = async () => {
    setPlacing(true);
    setError("");
    setPesapalStatus(null);
    try {
      const { order, redirect_url } = await initiatePesapalPayment({ shipping_address });
      if (!redirect_url) throw new Error("Pesapal did not return a checkout link.");
      setPendingOrderId(order.id);

      setPesapalStatus("awaiting");
      await WebBrowser.openBrowserAsync(redirect_url);

      await checkPesapalStatus(order.id);
    } catch (e) {
      setError(e.message);
      setPesapalStatus("failed");
    } finally {
      setPlacing(false);
    }
  };

  const checkPesapalStatus = async (orderId) => {
    setPesapalStatus("checking");
    setError("");
    try {
      const { order: updated } = await verifyPesapalPayment(orderId);
      if (updated.status === "paid") {
        navigation.replace("OrderConfirmation", { order: updated });
      } else if (updated.status === "failed") {
        setPesapalStatus("failed");
        setError("Pesapal reported this payment did not succeed. You can start a new payment below.");
      } else {
        setPesapalStatus("failed");
        setError("Payment still pending on Pesapal's side. Wait a moment and check again.");
      }
    } catch (e) {
      setError(e.message);
      setPesapalStatus("failed");
    }
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Review Order</Text>

        <Text style={[font.h3, { marginTop: spacing.md }]}>1. Shipping Address</Text>
        <Card style={{ marginBottom: spacing.md, marginTop: spacing.xs }}>
          <Text style={font.body}>{shipping_address}</Text>
        </Card>

        <Text style={font.h3}>2. Payment Method</Text>
        <Card style={{ marginBottom: spacing.md, marginTop: spacing.xs }}>
          <Text style={font.body}>
            {payment_method === "pesapal"
              ? "Pesapal (M-Pesa, Airtel Money, or Card)"
              : `Card ending in ${card_number.replace(/\s/g, "").slice(-4)}`}
          </Text>
        </Card>

        <Text style={font.h3}>3. Order Summary</Text>
        <Card style={{ marginTop: spacing.xs }}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={font.body}>{item.book?.title} × {item.quantity}</Text>
              <Text style={font.body}>${(item.book?.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.itemRow}><Text style={font.muted}>Subtotal</Text><Text style={font.muted}>${subtotal.toFixed(2)}</Text></View>
          <View style={styles.itemRow}><Text style={font.muted}>Shipping</Text><Text style={font.muted}>${shippingFee.toFixed(2)}</Text></View>
          <View style={styles.itemRow}><Text style={font.muted}>Tax</Text><Text style={font.muted}>${tax.toFixed(2)}</Text></View>
          <View style={styles.divider} />
          <View style={styles.itemRow}><Text style={font.h3}>Order Total</Text><Text style={font.h3}>${total.toFixed(2)}</Text></View>
        </Card>

        <ErrorText>{error}</ErrorText>

        {pesapalStatus === "awaiting" && (
          <Text style={[font.muted, { marginTop: spacing.sm }]}>Waiting for you to finish on Pesapal's page...</Text>
        )}
        {pesapalStatus === "checking" && (
          <Text style={[font.muted, { marginTop: spacing.sm }]}>Confirming payment status with Pesapal...</Text>
        )}

        {payment_method === "pesapal" ? (
          <>
            <PrimaryButton
              title={pendingOrderId ? "Start New Pesapal Payment" : "Pay with Pesapal"}
              onPress={handlePayWithPesapal}
              loading={placing}
              style={{ marginTop: spacing.lg }}
            />
            {pesapalStatus === "failed" && pendingOrderId && (
              <SecondaryButton
                title="Check Payment Status Again"
                onPress={() => checkPesapalStatus(pendingOrderId)}
                style={{ marginTop: spacing.sm }}
              />
            )}
          </>
        ) : (
          <PrimaryButton title="Place Order" onPress={handlePlaceOrderWithCard} loading={placing} style={{ marginTop: spacing.lg }} />
        )}
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});

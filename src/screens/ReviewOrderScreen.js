import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, PrimaryButton, ErrorText, Card } from "../components/UI";
import { fetchCart, checkout } from "../services/api";
import { colors, font, spacing } from "../theme";

export default function ReviewOrderScreen({ route, navigation }) {
  const { shipping_address } = route.params;
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

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

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      const { order, redirect_url } = await checkout({ shipping_address });
      navigation.replace("OrderConfirmation", { order, redirectUrl: redirect_url });
      await Linking.openURL(redirect_url);
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
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
          <Text style={font.body}>Pesapal secure checkout</Text>
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
        <PrimaryButton title="Place Order" onPress={handlePlaceOrder} loading={placing} style={{ marginTop: spacing.lg }} />
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
});

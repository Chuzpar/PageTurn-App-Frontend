import React, { useState } from "react";
import { Text } from "react-native";
import { Screen, PrimaryButton, ErrorText } from "../components/UI";
import { checkout } from "../services/api";
import { font, spacing } from "../theme";

export default function ReviewOrderScreen({ route, navigation }) {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const details = route.params || {};

	const placeOrder = async () => {
		setLoading(true);
		setError("");
		try {
			const result = await checkout({
				shipping_address: details.shipping_address,
				card_number: details.card_number,
			});
			navigation.navigate("OrderConfirmation", { order: result.order });
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Screen>
			<Text style={font.h1}>Review Order</Text>
			<Text style={[font.muted, { marginBottom: spacing.lg }]}>Confirm your shipping details before placing the order.</Text>
			<Text style={font.h3}>Shipping Address</Text>
			<Text style={[font.body, { marginTop: spacing.xs, marginBottom: spacing.lg }]}>{details.shipping_address}</Text>
			<Text style={font.h3}>Payment</Text>
			<Text style={[font.body, { marginTop: spacing.xs, marginBottom: spacing.lg }]}>Card ending in {details.card_number?.replace(/\s/g, "").slice(-4)}</Text>
			<ErrorText>{error}</ErrorText>
			<PrimaryButton title="Place Order" onPress={placeOrder} loading={loading} />
		</Screen>
	);
}

import React, { useState } from "react";
import { Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Screen, Field, PrimaryButton, SecondaryButton, ErrorText } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { colors, font, spacing } from "../theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      // RootNavigator swaps to the authenticated stack automatically.
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Screen style={{ justifyContent: "center" }}>
          <Text style={[font.h1, { textAlign: "center", marginBottom: spacing.xs }]}>PageTurn</Text>
          <Text style={[font.muted, { textAlign: "center", marginBottom: spacing.xl }]}>
            Welcome back — sign in to continue
          </Text>

          <ErrorText>{error}</ErrorText>
          <Field
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <PrimaryButton title="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.sm }} />

          <View style={{ marginTop: spacing.lg, alignItems: "center" }}>
            <Text style={font.muted}>Don't have an account?</Text>
          </View>
          <SecondaryButton
            title="Create Account"
            onPress={() => navigation.navigate("CreateAccount")}
            style={{ marginTop: spacing.sm }}
          />

          
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

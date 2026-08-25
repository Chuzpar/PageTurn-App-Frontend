import React, { useState } from "react";
import { Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Screen, Field, PrimaryButton, SecondaryButton, ErrorText } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { font, spacing } from "../theme";

export default function CreateAccountScreen({ navigation }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setError("");
    if (!fullName || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
      
    }
    setLoading(true);
    try {
      await register({ full_name: fullName, email: email.trim(), password, confirm_password: confirmPassword });
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
          <Text style={[font.h1, { marginBottom: spacing.xs }]}>Create Account</Text>
          <Text style={[font.muted, { marginBottom: spacing.xl }]}>Join the reading and lending library</Text>

          <ErrorText>{error}</ErrorText>
          <Field label="Full Name" placeholder="Jane Reader" value={fullName} onChangeText={setFullName} />
          <Field
            label="Email Address"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <Field label="Password" placeholder="Create a password" secureTextEntry value={password} onChangeText={setPassword} />
          <Field
            label="Confirm Password"
            placeholder="Re-enter password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <PrimaryButton title="Create Account" onPress={handleCreateAccount} loading={loading} />

          <SecondaryButton
            title="Already have an account? Sign In"
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: spacing.md }}
          />
        </Screen>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import React, { useState } from "react";
import { Text, ScrollView, View } from "react-native";
import { Screen, Field, PrimaryButton, ErrorText } from "../components/UI";
import { useAuth } from "../context/AuthContext";
import { font, spacing, colors } from "../theme";


export default function AccountSettingsScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim()) {
      setError("Name and email cannot be empty.");
      return;
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword && !currentPassword) {
      setError("Enter your current password to set a new one.");
      return;
    }

    setSaving(true);
    try {
      const payload = { full_name: fullName.trim(), email: email.trim() };
      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }
      await updateProfile(payload);
      setSuccess("Account updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView>
      <Screen>
        <Text style={font.h1}>Account Settings</Text>
        <Text style={[font.muted, { marginBottom: spacing.lg }]}>Update your profile and password</Text>

        <ErrorText>{error}</ErrorText>
        {success ? <Text style={{ color: colors.success, marginBottom: spacing.sm }}>{success}</Text> : null}

        <Field label="Full Name" value={fullName} onChangeText={setFullName} />
        <Field label="Email Address" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />

        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />

        <Text style={[font.h3, { marginBottom: spacing.sm }]}>Change Password</Text>
        <Field label="Current Password" secureTextEntry placeholder="Required to change password" value={currentPassword} onChangeText={setCurrentPassword} />
        <Field label="New Password" secureTextEntry placeholder="Leave blank to keep current" value={newPassword} onChangeText={setNewPassword} />
        <Field label="Confirm New Password" secureTextEntry value={confirmNewPassword} onChangeText={setConfirmNewPassword} />

        <PrimaryButton title="Save Changes" onPress={handleSave} loading={saving} />
      </Screen>
    </ScrollView>
  );
}

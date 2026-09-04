import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MemberTabs from "./MemberTabs";
import AdminTabs from "./AdminTabs";
import { colors } from "../theme";

export default function RootNavigator() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStack /> : isAdmin ? <AdminTabs /> : <MemberTabs />}
    </NavigationContainer>
  );
}

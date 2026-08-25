import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet } from "react-native";

// TODO: swap this placeholder for real navigation once
// AuthContext.js and RootNavigator.js (Member 1) are built.
// import { NavigationContainer } from "@react-navigation/native";
// import { AuthProvider } from "./src/context/AuthContext";
// import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PageTurn</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});

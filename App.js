import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

// AuthContext.js and RootNavigator.js are now built (Member 1's work),
// so App.js wires them together at the top level.
// Note: RootNavigator already renders its own NavigationContainer,
// so we do NOT wrap it in another one here.

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

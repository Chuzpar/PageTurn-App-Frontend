import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StoreScreen from "../screens/StoreScreen";
import BookDetailScreen from "../screens/BookDetailScreen";

/**
 * Store Stack
 * Wraps the Book Store tab so it can push into Book Detail
 * (StoreScreen calls navigation.navigate("BookDetail", { bookId, mode })).
 */
const Stack = createNativeStackNavigator();

export default function StoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StoreHome" component={StoreScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
    </Stack.Navigator>
  );
}

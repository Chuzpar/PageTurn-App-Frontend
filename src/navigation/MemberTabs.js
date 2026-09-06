import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import StoreScreen from "../screens/StoreScreen";
import LibraryScreen from "../screens/LibraryScreen";
import BookDetailScreen from "../screens/BookDetailScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ReviewOrderScreen from "../screens/ReviewOrderScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import PurchaseHistoryScreen from "../screens/PurchaseHistoryScreen";
import LendingHistoryScreen from "../screens/LendingHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="StoreMain" component={StoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: "Book Details" }} />
    </Stack.Navigator>
  );
}

function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: "Book Details" }} />
      <Stack.Screen name="LendingHistory" component={LendingHistoryScreen} options={{ title: "Your Literary Record" }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout" }} />
      <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} options={{ title: "Review Order" }} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ title: "Purchase History" }} />
      <Stack.Screen name="LendingHistory" component={LendingHistoryScreen} options={{ title: "Your Literary Record" }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: "Account Settings" }} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ title: "Purchase History" }} />
      <Stack.Screen name="LendingHistory" component={LendingHistoryScreen} options={{ title: "Your Literary Record" }} />
    </Stack.Navigator>
  );
}

const ICONS = { Store: "storefront", Library: "book", Cart: "cart", Profile: "person-circle" };

export default function MemberTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
        tabBarStyle: Platform.OS === "web" ? { maxWidth: 480, alignSelf: "center", width: "100%" } : undefined,
      })}
    >
      <Tab.Screen name="Store" component={StoreStack} />
      <Tab.Screen name="Library" component={LibraryStack} />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

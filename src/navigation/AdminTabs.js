import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminBooksScreen from "../screens/admin/AdminBooksScreen";
import AddManuscriptScreen from "../screens/admin/AddManuscriptScreen";
import EditManuscriptScreen from "../screens/admin/EditManuscriptScreen";
import AdminLendingRequestsScreen from "../screens/admin/AdminLendingRequestsScreen";
import AdminPurchaseManagementScreen from "../screens/admin/AdminPurchaseManagementScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="AdminDashboardMain" component={AdminDashboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddManuscript" component={AddManuscriptScreen} options={{ title: "Add New Manuscript" }} />
      <Stack.Screen name="AdminBooks" component={AdminBooksScreen} options={{ title: "Manage Books" }} />
      <Stack.Screen name="EditManuscript" component={EditManuscriptScreen} options={{ title: "Edit Manuscript" }} />
      <Stack.Screen name="AdminLendingRequests" component={AdminLendingRequestsScreen} options={{ title: "Lending Requests" }} />
      <Stack.Screen name="AdminOrders" component={AdminPurchaseManagementScreen} options={{ title: "Purchase Orders" }} />
    </Stack.Navigator>
  );
}

function BooksStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="AdminBooksMain" component={AdminBooksScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddManuscript" component={AddManuscriptScreen} options={{ title: "Add New Manuscript" }} />
      <Stack.Screen name="EditManuscript" component={EditManuscriptScreen} options={{ title: "Edit Manuscript" }} />
    </Stack.Navigator>
  );
}

function LendingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="AdminLendingMain" component={AdminLendingRequestsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="AdminOrdersMain" component={AdminPurchaseManagementScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: colors.navy }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: "Account Settings" }} />
    </Stack.Navigator>
  );
}

const ICONS = { Dashboard: "grid", Books: "library", Lending: "swap-horizontal", Orders: "receipt", Account: "person-circle" };

export default function AdminTabs() {
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
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Books" component={BooksStack} />
      <Tab.Screen name="Lending" component={LendingStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens (these will be created by other members)
import StoreScreen from '../screens/StoreScreen';
import LibraryScreen from '../screens/LibraryScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import LendingHistoryScreen from '../screens/LendingHistoryScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import ReviewOrderScreen from '../screens/ReviewOrderScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MemberTabScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Store') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1F2F50',
        tabBarInactiveTintColor: '#8B94A8',
        tabBarStyle: {
          height: 92,
          paddingTop: 8,
          paddingBottom: 18,
          borderTopWidth: 1,
          borderTopColor: '#E8DECC',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#1F2F50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Store" 
        component={StoreScreen} 
        options={{ title: 'Book Store' }}
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ title: 'My Library' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'Shopping Cart' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const MemberTabs = () => (
  <Stack.Navigator>
    <Stack.Screen name="MemberHome" component={MemberTabScreens} options={{ headerShown: false }} />
    <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ title: 'Account Settings' }} />
    <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ title: 'Purchase History' }} />
    <Stack.Screen name="LendingHistory" component={LendingHistoryScreen} options={{ title: 'Lending History' }} />
    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Shopping Cart' }} />
    <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} options={{ title: 'Review Order' }} />
    <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ title: 'Order Confirmation' }} />
  </Stack.Navigator>
);

export default MemberTabs;

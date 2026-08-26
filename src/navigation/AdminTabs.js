import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminBooksScreen from '../screens/admin/AdminBooksScreen';
import AdminLendingRequestsScreen from '../screens/admin/AdminLendingRequestsScreen';
import AdminPurchaseManagementScreen from '../screens/admin/AdminPurchaseManagementScreen';
import AddManuscriptScreen from '../screens/admin/AddManuscriptScreen';
import EditManuscriptScreen from '../screens/admin/EditManuscriptScreen';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'Books') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Lending') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Add Book') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen} 
        options={{ title: 'Admin Dashboard' }}
      />
      <Tab.Screen 
        name="Books" 
        component={AdminBooksScreen} 
        options={{ title: 'Manage Books' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={AdminPurchaseManagementScreen} 
        options={{ title: 'Order Management' }}
      />
      <Tab.Screen 
        name="Lending" 
        component={AdminLendingRequestsScreen} 
        options={{ title: 'Lending Requests' }}
      />
      <Tab.Screen 
        name="Add Book" 
        component={AddManuscriptScreen} 
        options={{ title: 'Add New Book' }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;

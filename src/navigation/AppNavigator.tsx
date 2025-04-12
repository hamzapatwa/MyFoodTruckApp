import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native'; // For loading state

import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// Import screens
import PlaceholderScreen from '../screens/Placeholder/PlaceholderScreen'; // Keep for now, might remove later
import InventoryListScreen from '../screens/Inventory/InventoryListScreen';
import InventoryAddScreen from '../screens/Inventory/InventoryAddScreen';
import InventoryDetailScreen from '../screens/Inventory/InventoryDetailScreen';
import AuthScreen from '../screens/Auth/AuthScreen'; // Import AuthScreen
// import DashboardScreen from '../screens/Dashboard/DashboardScreen';

// Define the types for the navigation stack parameters
// Replace 'any' with specific screen parameters as needed
export type RootStackParamList = {
  // Example:
  Auth: undefined; // Add Auth screen
  // Dashboard: { userId: string }; // Example param for Dashboard
  Placeholder: undefined; // Temporary placeholder, might remove later
  InventoryList: undefined; // The main list screen
  InventoryAdd: undefined; // Screen to add a new item
  InventoryDetail: { itemId: string }; // Screen to view/edit details, needs item ID
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { session, loading } = useAuth();

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session?.user ? (
          // User is signed in - Show main app screens
          <>
            <Stack.Screen
              name="InventoryList"
              component={InventoryListScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InventoryAdd"
              component={InventoryAddScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="InventoryDetail"
              component={InventoryDetailScreen}
              options={{ headerShown: false }}
            />
            {/* Add other main app screens here */}
            {/* <Stack.Screen name="Dashboard" component={DashboardScreen} /> */}
          </>
        ) : (
          // User is signed out - Show Auth screen only
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }} // Hide header for Auth screen
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
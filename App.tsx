/**
 * MyFoodTruckApp Entry Point
 */
import 'react-native-gesture-handler'; // Must be at the top
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Recommended for handling safe areas
import AppNavigator from './src/navigation/AppNavigator';
import customTheme from './src/config/theme';
import { AuthProvider } from './src/context/AuthContext'; // Import AuthProvider

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider> {/* Wrap with AuthProvider */}
        <PaperProvider theme={customTheme}>
          <AppNavigator />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;

/**
 * MyFoodTruckApp Entry Point (Web Version)
 */
import React from 'react';
import { View, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import customTheme from './src/config/theme';
import { AuthProvider } from './src/context/AuthContext';

function App(): React.JSX.Element {
  console.log('App.web.tsx component loaded');
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={customTheme}>
          <AppNavigator />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 20, color: 'red', marginBottom: 10 }}>
            Something went wrong.
          </Text>
          <Text style={{ fontSize: 14, color: 'grey' }}>
            {this.state.error?.toString()}
          </Text>
          {this.state.errorInfo && (
            <Text style={{ fontSize: 12, color: 'grey' }}>
              {this.state.errorInfo.componentStack}
            </Text>
          )}
        </View>
      );
    }
    return this.props.children;
  }
}


export default App;
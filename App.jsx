import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth, InventoryProvider } from './src/context';
import { MainTabNavigator } from './src/navigation';
import { LoginScreen } from './src/screens';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <MainTabNavigator /> : <LoginScreen />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InventoryProvider>
          <AppContent />
        </InventoryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

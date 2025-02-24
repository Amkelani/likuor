import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import React, { useCallback, useState, useEffect } from 'react';
import { components } from './src/components';
import * as SplashScreen from 'expo-splash-screen';
import { persistor, store } from './src/store/store';
import FlashMessage from 'react-native-flash-message';
import { PersistGate } from 'redux-persist/integration/react';
import StackNavigator from './src/navigation/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getAuthorizationToken } from './src/config';

// Keep splash screen visible while we check auth
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'DMSans-Bold': require('./src/assets/fonts/DMSans-Bold.ttf'),
    'DMSans-Medium': require('./src/assets/fonts/DMSans-Medium.ttf'),
    'DMSans-Regular': require('./src/assets/fonts/DMSans-Regular.ttf'),
  });

  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Check token on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getAuthorizationToken();
        console.debug('[App] Token on load:', token || 'undefined');
        setInitialRoute(token ? 'TabNavigator' : 'Onboarding');
      } catch (error) {
        console.error('[App] Error checking token:', error);
        setInitialRoute('Onboarding'); // Default to Onboarding on error
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && isReady) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isReady]);

  if (!fontsLoaded || !isReady) {
    return null;
  }

  return (
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <Provider store={store}>
          <PersistGate loading={<components.Loader />} persistor={persistor}>
            <NavigationContainer>
              <StackNavigator initialRouteName={initialRoute} />
            </NavigationContainer>
          </PersistGate>
        </Provider>
        <FlashMessage position="top" floating={true} />
      </SafeAreaProvider>
  );
}
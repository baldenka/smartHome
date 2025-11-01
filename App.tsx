import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

enableScreens();
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import ErrorNotification from './src/components/ErrorNotification';
import { theme } from './src/utils/theme';

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppNavigator />
            <ErrorNotification />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </ErrorBoundary>
  );
}
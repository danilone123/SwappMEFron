import React from 'react';
import LoginScreen from './screens/loginScreens';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";
import Tabs from "./screens/Tabs";
import { useState, useEffect } from "react";
import {
  View, ActivityIndicator 
} from "react-native";
import HomeScreen from './screens/HomeScreen';
import { RootStackParamList } from "./screens/DescriptionScreen";
import CreateUserScreen from './screens/CreateUserScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAccessToken } from "./servicesSecure/authStorage"
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import ForgetPasswordForm from "./screens/ForgotPasswordScreen"
import * as Notifications from 'expo-notifications';
import { navigateFromNotification } from './utils/notificationNavigation';

const client = new QueryClient();

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<ParamListBase>();

// Show a notification while the app is open. Navigation happens only after the
// user taps it, which avoids interrupting what they are currently doing.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export type LoginScreenProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthStack({ setIsLoggedIn }: LoginScreenProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Stack.Screen>

      <Stack.Screen name="CreateUser">
        {(props) => (
          <CreateUserScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Stack.Screen>

      <Stack.Screen name="ForgotPassword">
        {(props) => (
           <ForgetPasswordForm  />
        )}
      </Stack.Screen>
   
    </Stack.Navigator>
  );
}

function AppStack({ setIsLoggedIn }: LoginScreenProps) {
  return (
    // Pass it into Tabs
    <Tabs setIsLoggedIn={setIsLoggedIn} />
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const [initialNotificationData, setInitialNotificationData] = useState<unknown>();
  
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [token, lastNotificationResponse] = await Promise.all([
          getAccessToken(),
          Notifications.getLastNotificationResponseAsync(),
        ]);

        if (token) {
          setIsLoggedIn(true);
          setInitialNotificationData(lastNotificationResponse?.notification.request.content.data);
        }
      } catch (e) {
        console.log("Error reading token", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isNavigationReady) {
      return;
    }

    if (initialNotificationData !== undefined && navigationRef.isReady()) {
      navigateFromNotification(navigationRef, initialNotificationData);
      setInitialNotificationData(undefined);
      // Otherwise Expo will return this same cold-start response on the next
      // application launch and the user would be redirected again.
      Notifications.clearLastNotificationResponseAsync().catch(error =>
        console.warn('Unable to clear the handled notification response:', error),
      );
    }

    // this adds a listener, it will listen for a tap of the user over a push notification
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (navigationRef.isReady()) {
        navigateFromNotification(navigationRef, response.notification.request.content.data);
      }
    });

    return () => subscription.remove();
  }, [initialNotificationData, isLoggedIn, isNavigationReady]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

return (
  <ActionSheetProvider>
  <QueryClientProvider client={client}>
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef} onReady={() => setIsNavigationReady(true)}>
        {isLoggedIn ? <AppStack setIsLoggedIn={setIsLoggedIn} /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
      </NavigationContainer>
    </View>
  </QueryClientProvider>
  </ActionSheetProvider>
);
}

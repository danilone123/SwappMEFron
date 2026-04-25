import React from 'react';
import LoginScreen from './screens/loginScreens';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./screens/Tabs";
import { useState, useEffect } from "react";
import {
  View, ActivityIndicator 
} from "react-native";
import HomeScreen from './screens/HomeScreen';
import DescriptionScreen from './screens/DescriptionScreen';
import { RootStackParamList } from "./screens/DescriptionScreen";
import CreateUserScreen from './screens/CreateUserScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAccessToken } from "./servicesSecure/authStorage"

const client = new QueryClient();

const Stack = createNativeStackNavigator<RootStackParamList>();

type LoginScreenProps = {
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
   
    </Stack.Navigator>
  );
}

function AppStack() {
return (
  <Tabs />
  // <Stack.Navigator>
  //   <Stack.Screen name="Dashboard" component={HomeScreen} />
  //   <Stack.Screen name="Details" component={DescriptionScreen} />
  // </Stack.Navigator>
);
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = await getAccessToken();

        if (token) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log("Error reading token", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

return (
  <QueryClientProvider client={client}>
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {isLoggedIn ? <AppStack /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
      </NavigationContainer>
    </View>
  </QueryClientProvider>
);
}

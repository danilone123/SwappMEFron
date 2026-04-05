import React from 'react';
import LoginScreen from './screens/loginScreens';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import HomeScreen from './screens/HomeScreen';
import DescriptionScreen from './screens/DescriptionScreen';
import { RootStackParamList } from "./screens/DescriptionScreen";
import CreateUserScreen from './screens/CreateUserScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

const Stack = createNativeStackNavigator<RootStackParamList>();
//createNativeStackNavigator();
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
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={HomeScreen} />
    <Stack.Screen name="Details" component={DescriptionScreen} />
  </Stack.Navigator>
);
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

return (
  <QueryClientProvider client={client}>
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        {isLoggedIn ? <AppStack /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
      </NavigationContainer>
    </View>
  </QueryClientProvider>
);
  //return <LoginScreen />;
}

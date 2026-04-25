import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import DescriptionScreen from "./DescriptionScreen";
import { RootStackParamList } from "./DescriptionScreen";

export type HomeStackParamList = {
  Dashboard: undefined;
  Details: { id: string }; // adjust if needed
};

//const Stack = createNativeStackNavigator<HomeStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen name="Details" component={DescriptionScreen} />
    </Stack.Navigator>
  );
}
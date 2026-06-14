import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import React from "react";
import HomeStack from "./HomeStack";
import MyItemsStack from "./MyItemsStack";
import ItemStack from "./ItemStack";

type TabParamList = {
    Home: undefined;
    MyPost: undefined,
    Search: undefined;
    Notifications: undefined;
    Profile: undefined;
  };


  const Tab = createBottomTabNavigator<TabParamList>();

  const Screen = ({ label }: { label: string }) => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{label}</Text>
    </View>
  );

  export default function Tabs() {
    return (
      <Tab.Navigator>
         <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }} // important
      />
      <Tab.Screen 
        name="MyPost"
        component={MyItemsStack}
        options={{ headerShown: false }}
      />
        <Tab.Screen
        name="Search"
        component={ItemStack}
        options={{ headerShown: false }} // important
      />
      {/* <Tab.Screen name="Search">
          {() => <Screen label="Search" />}
        </Tab.Screen> */}
        <Tab.Screen name="Notifications">
          {() => <Screen label="Notifications" />}
        </Tab.Screen>
        <Tab.Screen name="Profile">
          {() => <Screen label="Profile" />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }
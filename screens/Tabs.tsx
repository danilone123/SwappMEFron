import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import React from "react";
import HomeStack from "./HomeStack";
import MyItemsStack from "./MyItemsStack";
import ItemStack from "./ItemStack";
import PortalStack from "./PortalStack";
import ProfileStack from "./ProfileStack";
import { LoginScreenProps } from "../App";

type TabParamList = {
    Home: undefined;
    MyPost: undefined,
    Search: undefined;
    Portal: undefined;
    Profile: undefined;
  };


  const Tab = createBottomTabNavigator<TabParamList>();

  const Screen = ({ label }: { label: string }) => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{label}</Text>
    </View>
  );

  export default function Tabs({ setIsLoggedIn }: LoginScreenProps) {
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
      <Tab.Screen
        name="Portal"
        component={PortalStack}
        options={{ headerShown: false }} // important
      />
    
       {/* <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ headerShown: false }}         
        /> */}
        <Tab.Screen 
        name="Profile" 
        options={{ headerShown: false }}         
      >
        {/* Render via function to pass the prop into the Stack */}
        {(props) => <ProfileStack {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
      </Tab.Navigator>
    );
  }
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GalleryScreen from "./GalleryScreen";
import  { GalleryParamList } from "./GalleryScreen";
import ItemFormScreen from "./ItemFormScreen";


//const Stack = createNativeStackNavigator();
const Stack = createNativeStackNavigator<GalleryParamList>();

export default function ItemStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="ItemForm" component={ItemFormScreen} />

      {/* <Stack.Screen name="ImageCrop" component={ImageCropScreen} /> */}
    </Stack.Navigator>
  );
}
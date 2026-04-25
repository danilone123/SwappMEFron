import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
  } from "react-native";

  import { useLayoutEffect } from "react";

  import {Item} from "./Item"
  import { NativeStackScreenProps } from "@react-navigation/native-stack";

  export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    CreateUser: undefined;
    Details: { item: Item }; // match your screen
  };

 type Props = NativeStackScreenProps<RootStackParamList, "Details">;
//({ route, navigation }: Props)

export default function DescriptionScreen({ route, navigation }: Props) {
    const { item } = route.params;
  
    // Set the header title dynamically
    useLayoutEffect(() => {
        navigation.setOptions({
          title: item.title,               // dynamic title
          headerStyle: { backgroundColor: "#fff" }, // header background
          headerTintColor: "#000",         // back button & title color
          headerTitleStyle: { 
            fontSize: 40,                  // font size
            fontWeight: "bold",            // font weight
            fontFamily: "Arial",           // custom font                  // adjust height of the title
          },
        });
      }, [navigation, item]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }} 
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>
          {item.description}
         </Text>
      </ScrollView>
    );
  }
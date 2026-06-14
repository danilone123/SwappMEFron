import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyPosts from "././MyPosts";
import SinglePost from "././SinglePost"
import { PostItem } from './HomeScreen';

export type MyPostParamList = {
    MyPosts: undefined
    SinglePost: {
        post: PostItem;
        isOffertable: boolean;
      };
};

const Stack = createNativeStackNavigator<MyPostParamList>();

export default function MyItemsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="MyPosts" component={MyPosts} />
        <Stack.Screen name="SinglePost" component={SinglePost} />
      </Stack.Navigator>
    );
  }
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
        hideActions?: boolean;
        showQuestions?: boolean;
      };
};

const Stack = createNativeStackNavigator<MyPostParamList>();

export default function MyItemsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="MyPosts" component={MyPosts} options={{ title: 'Tus Items'}} />
        <Stack.Screen name="SinglePost" component={SinglePost} options={{ title: 'Item'}}/>
      </Stack.Navigator>
    );
  }

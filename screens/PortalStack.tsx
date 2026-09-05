
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Portal  from './Portal';
import OfferForm from "./OfferForm";
import { PostItem } from "./HomeScreen";
import SinglePost from "./SinglePost"

export type PortalParamList = {
    Portal: {
      initialTab?: 'questions';
    } | undefined;
    OfferParamItem: {
      post: PostItem;
    }
    SinglePost: {
      post: PostItem;
      isOffertable: boolean;
      hideActions?: boolean;
    };
};

const Stack = createNativeStackNavigator<PortalParamList>();

export default function PortalStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Portal" component={Portal} />
        <Stack.Screen name="OfferParamItem" component={OfferForm} />
        <Stack.Screen name="SinglePost" component={SinglePost} />
      </Stack.Navigator>
    );
  }

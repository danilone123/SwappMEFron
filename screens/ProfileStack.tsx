import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen  from './ProfileScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import { LoginScreenProps } from '../App';

export type ProfileParamList = {
    Profile: undefined
    PersonalInfoScreen: undefined
};

const Stack = createNativeStackNavigator<ProfileParamList>();

export default function PortalStack({ setIsLoggedIn }: LoginScreenProps) {
    return (
      <Stack.Navigator>
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        <Stack.Screen name="Profile">
        {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
        <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
      </Stack.Navigator>
    );
  }
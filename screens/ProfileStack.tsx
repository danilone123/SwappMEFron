import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen  from './ProfileScreen';
import PersonalInfoScreen from './PersonalInfoScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import { LoginScreenProps } from '../App';

export type ProfileParamList = {
    Profile: undefined
    PersonalInfoScreen: undefined
    ChangePassForm: undefined
};

const Stack = createNativeStackNavigator<ProfileParamList>();

export default function PortalStack({ setIsLoggedIn }: LoginScreenProps) {
    return (
      <Stack.Navigator>
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
        <Stack.Screen name="Profile" options={{ title: 'Mi perfil' }}>
        {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
        <Stack.Screen
          name="PersonalInfoScreen"
          component={PersonalInfoScreen}
          options={{ title: 'Información Personal' }}
        />
        <Stack.Screen
          name="ChangePassForm"
          options={{ title: 'Cambiar contraseña' }}
        >
          {(props) => (
            <ChangePasswordScreen {...props} setIsLoggedIn={setIsLoggedIn} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

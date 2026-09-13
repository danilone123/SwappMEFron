import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { loginUser } from '../hooks/loginHook';
import  { saveTokens, saveUser } from '../servicesSecure/authStorage'
import { savePushToken } from '../services/CreateUserService';
import { registerForPushNotifications } from '../utils/PushNotification';

export type LoginScreenProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: any;
};

const LoginScreen = ({ setIsLoggedIn, navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const loginMutation = loginUser();

  const handleCreateUser = () => {
    console.log("create USER Clicked::::::");
    console.log(navigation);
    navigation.navigate("CreateUser")
  };

  const handleForgotPassword = () => {
    console.log("forgot password selected");
    console.log(navigation);
    navigation.navigate("ForgotPassword")
  };

  const handleLogin = () => {
    console.log("Login button pressed");
    if (!email || !password) {  
         //alert("Login clicked");
         Alert.alert('Error', 'Please fill in all fields');
      return;
    }

      loginMutation.mutate({
       userName: email,
        password: password,
      }, {
        onSuccess: async (response) => {
          console.log('User created:', response.user);
          console.log('refresh Tokens:', response.refreshToken);
          console.log('Token access:', response.jwtToken);
          await saveTokens(response.jwtToken, response.refreshToken);
          await saveUser(response.user); 

          try {
            const pushToken = await registerForPushNotifications();
            if (pushToken) {
              await savePushToken(pushToken);
            }
          } catch (error) {
            // A notification registration problem must not prevent a successful login.
            console.warn('Unable to register push notifications:', error);
          }

          setIsLoggedIn(true)
          
        }, 
        onError: (error) => {
            //console.log(error);
            Alert.alert('Error', `There is an error with your account. Please try again.`);
        }
      });
    //Alert.alert('Success', `Email: ${email}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.containerTitle}>
          <Text style={styles.title}>Login</Text>
          <TouchableOpacity onPress={handleCreateUser}>
            {/* style={styles.buttonText} */}
            <Text >Create User</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={handleForgotPassword}>
            {/* style={styles.buttonText} */}
            <Text >      Olvidaste el password?</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#666"
            selectionColor="#4CAF50"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(visible => !visible)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={styles.passwordVisibilityButton}
          >
            <Feather
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  formContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 54,
  },
  containerTitle: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'red', 
    alignSelf: 'center', 
  },
  createButton: {
    backgroundColor: '#4CAF50',
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    //alignItems: 'center',
    // marginBottom: 16,
    padding: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    //marginBottom: 32,
    textAlign: 'center',
    padding: 16
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordInputContainer: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    color: '#000',
  },
  passwordVisibilityButton: {
    padding: 14,
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

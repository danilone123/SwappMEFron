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
          <Text style={styles.title}>Hola!</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar en SwappMe</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
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

        <View style={styles.accountActions}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateUser}>
            <Text style={styles.linkText}>Crea una cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  formContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  containerTitle: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    color: '#1B2540',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#718096',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    color: '#1B2540',
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D9E2F1',
  },
  passwordInputContainer: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#D9E2F1',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    color: '#1B2540',
  },
  passwordVisibilityButton: {
    padding: 14,
  },
  button: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  accountActions: {
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
});

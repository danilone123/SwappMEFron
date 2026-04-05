import React, { use, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';

import { useLogin } from '../hooks/createUserHook';
import { LoginScreenProps } from '../screens/loginScreens'

const CreateUserScreen =  ({ setIsLoggedIn }: LoginScreenProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const loginMutation = useLogin();

    const handleLogin = () => {
        console.log(email)
        loginMutation.mutate({
          email: email,
          password: password,
          fullname: fullName,
          nickname: nickName,
          phone: phoneNumber
        }, {
            onSuccess: (response) => {
              console.log('User created:', response.user);
              console.log('Tokens:', response.jwtToken);
              //setIsLoggedIn(true)
            }, 
            onError: (error) => {
                console.log(error);
            }
            });
      };

      return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

            {/* {loginMutation.isPending && <Text>Loading...</Text>}
            {loginMutation.isError && <Text>Error!</Text>} */}
          <Text style={styles.title}>Create User</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
    
          <TextInput
            style={styles.input}
            placeholder="Full name"
            autoCapitalize="none"
            value={fullName}
            onChangeText={setFullName}
          />

        <TextInput
            style={styles.input}
            placeholder="Nick name optional"
            autoCapitalize="none"
            value={nickName}
            onChangeText={setNickName}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone number"
            autoCapitalize="none"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
    
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>

          {/* Centered Loading Overlay */}
      {loginMutation.isPending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
        </KeyboardAvoidingView>
      );
}

export default CreateUserScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 54,
      backgroundColor: '#f2f2f2',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 32,
      textAlign: 'center',
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
    button: {
      backgroundColor: '#4CAF50',
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: '600',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      }
  });
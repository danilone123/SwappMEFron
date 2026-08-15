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
  ActivityIndicator
} from 'react-native';

import { useLogin, refreshTokenNew } from '../hooks/createUserHook';
import { LoginScreenProps } from '../screens/loginScreens'
import  { getAccessToken, getRefreshToken, saveTokens, saveUser } from '../servicesSecure/authStorage'
import { executeValidations } from '../utils/Utils';

type ValidationError = {
  valid: boolean;
  description: string;
};

const CreateUserScreen =  ({ setIsLoggedIn }: LoginScreenProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const [validations, setValidations] = useState<Record<string, ValidationError>>({});
    const loginMutation = useLogin();
    const refreshTokenMutation = refreshTokenNew();

    const handleLogin = () => {
        const localPhoneNumber = phoneNumber.trim();
        const validationMap = {
          email: [
            { value: email.trim(), type: 'empty', description: 'El correo electrónico es requerido.' },
            { value: email.trim(), type: 'regex', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, description: 'Ingresa un correo electrónico válido.' },
          ],
          password: [
            { value: password, type: 'empty', description: 'La contraseña es requerida.' },
            { value: password, type: 'regex', regex: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, description: 'La contraseña debe tener al menos 8 caracteres, una letra y un número.' },
          ],
          fullName: [
            { value: fullName.trim(), type: 'empty', description: 'El nombre completo es requerido.' },
            { value: fullName.trim(), type: 'regex', regex: /^.{1,20}$/, description: 'El nombre completo no puede superar los 20 caracteres.' },
          ],
          phoneNumber: [
            { value: localPhoneNumber, type: 'empty', description: 'El número de teléfono es requerido.' },
            { value: localPhoneNumber, type: 'regex', regex: /^\d{1,20}$/, description: 'El número de teléfono solo puede contener hasta 20 dígitos.' },
          ],
        };
        const results = executeValidations(validationMap);
        setValidations(results);

        if (Object.keys(results).length > 0) {
          return;
        }
       
        loginMutation.mutate({
          email: email,
          password: password,
          fullname: fullName,
          nickname: nickName,
          phone: `+591${localPhoneNumber}`
        }, {
            onSuccess: async (response) => {
              console.log('User created:', response.user);
              console.log('refresh Tokens:', response.refreshToken);
              await saveTokens(response.jwtToken, response.refreshToken);
              await saveUser(response.user);
              setIsLoggedIn(true)
              
            }, 
            onError: (error) => {
                console.log(error);
            }
            });
      };

    const renderValidationError = (key: string) => {
      const validation = validations[key];
      if (!validation || validation.valid) {
        return null;
      }

      return <Text style={styles.errorText}>{validation.description}</Text>;
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
          {renderValidationError('email')}

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {renderValidationError('password')}
    
          <TextInput
            style={styles.input}
            placeholder="Full name"
            autoCapitalize="none"
            value={fullName}
            onChangeText={setFullName}
            maxLength={20}
          />
          {renderValidationError('fullName')}

        <TextInput
            style={styles.input}
            placeholder="Nick name optional"
            autoCapitalize="none"
            value={nickName}
            onChangeText={setNickName}
          />

          <View style={styles.phoneRow}>
            <View style={styles.countryArea}>
              <View style={styles.flag} accessibilityLabel="Bandera de Bolivia">
                <View style={[styles.flagStripe, styles.flagRed]} />
                <View style={[styles.flagStripe, styles.flagYellow]} />
                <View style={[styles.flagStripe, styles.flagGreen]} />
              </View>
              <Text style={styles.countryText}>Bolivia +591</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Número de teléfono *"
              keyboardType="phone-pad"
              autoComplete="tel"
              maxLength={20}
              value={phoneNumber}
              onChangeText={text => setPhoneNumber(text.replace(/\D/g, ''))}
            />
          </View>
          {renderValidationError('phoneNumber')}
    
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
    phoneRow: {
      flexDirection: 'row',
      height: 50,
      marginBottom: 16,
    },
    countryArea: {
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottomLeftRadius: 8,
      borderTopLeftRadius: 8,
      borderColor: '#ddd',
      borderWidth: 1,
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    flag: {
      borderColor: '#ccc',
      borderWidth: StyleSheet.hairlineWidth,
      height: 16,
      marginRight: 6,
      overflow: 'hidden',
      width: 24,
    },
    flagStripe: {
      flex: 1,
    },
    flagRed: { backgroundColor: '#D52B1E' },
    flagYellow: { backgroundColor: '#F9E300' },
    flagGreen: { backgroundColor: '#007A33' },
    countryText: {
      color: '#333',
      fontSize: 12,
      fontWeight: '600',
    },
    phoneInput: {
      backgroundColor: '#fff',
      borderBottomRightRadius: 8,
      borderTopRightRadius: 8,
      borderColor: '#ddd',
      borderLeftWidth: 0,
      borderWidth: 1,
      flex: 1,
      paddingHorizontal: 12,
    },
    errorText: {
      color: '#C62828',
      fontSize: 12,
      marginBottom: 12,
      marginTop: -10,
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

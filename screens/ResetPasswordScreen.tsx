import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from './DescriptionScreen';
import { resetUserPassword } from '../hooks/createUserHook';
import { executeValidations } from '../utils/Utils';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

type ValidationError = {
  valid: boolean;
  description: string;
};

const ResetPasswordScreen = ({ navigation, route }: Props) => {
  const [email, setEmail] = useState(route.params.email);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validations, setValidations] = useState<Record<string, ValidationError>>({});
  const resetPasswordMutation = resetUserPassword();

  const handleResetPassword = () => {
    const validationMap = {
      email: [
        { value: email.trim(), type: 'empty', description: 'El email es requerido.' },
      ],
      code: [
        { value: code.trim(), type: 'empty', description: 'El código es requerido.' },
      ],
      password: [
        { value: password, type: 'empty', description: 'La contraseña es requerida.' },
        { value: password, type: 'regex', regex: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, description: 'La contraseña debe tener al menos 8 caracteres, una letra y un número.' },
      ],
      confirmPassword: [
        { value: confirmPassword, type: 'empty', description: 'La confirmación de contraseña es requerida.' },
        { value: confirmPassword, type: 'compare', otherComponent: password, description: 'Las contraseñas no coinciden.' },
      ],
    };
    const results = executeValidations(validationMap);
    setValidations(results);

    if (Object.keys(results).length > 0) {
      return;
    }

    resetPasswordMutation.mutate(
      { email: email.trim(), code: code.trim(), password },
      {
        onSuccess: () => {
          Alert.alert('Contraseña actualizada', 'Ya puedes iniciar sesión con tu nueva contraseña.', [
            {
              text: 'Ir a iniciar sesión',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
            },
          ]);
        },
        onError: () => {
          Alert.alert('Error', 'El código no es válido o ha expirado. Solicita uno nuevo.');
        },
      },
    );
  };

  const renderValidationError = (key: string) => {
    const validation = validations[key];
    return validation && !validation.valid
      ? <Text style={styles.errorText}>{validation.description}</Text>
      : null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Restablecer contraseña</Text>
        <Text style={styles.subtitle}>Ingresa el código que enviamos a tu correo.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {renderValidationError('email')}

        <TextInput
          style={styles.input}
          placeholder="Código"
          autoCapitalize="none"
          value={code}
          onChangeText={setCode}
        />
        {renderValidationError('code')}

        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {renderValidationError('password')}

        <TextInput
          style={styles.input}
          placeholder="Confirmar nueva contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {renderValidationError('confirmPassword')}

        <TouchableOpacity
          style={[styles.button, resetPasswordMutation.isPending && styles.buttonDisabled]}
          disabled={resetPasswordMutation.isPending}
          onPress={handleResetPassword}
        >
          <Text style={styles.buttonText}>
            {resetPasswordMutation.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB', justifyContent: 'center', padding: 28 },
  form: { width: '100%' },
  title: { color: '#1B2540', fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#718096', fontSize: 15, marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderColor: '#D9E2F1', borderRadius: 12, borderWidth: 1, color: '#1B2540', height: 50, marginBottom: 16, paddingHorizontal: 16 },
  errorText: { color: '#C62828', fontSize: 12, marginBottom: 12, marginTop: -10 },
  button: { alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 12, height: 50, justifyContent: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

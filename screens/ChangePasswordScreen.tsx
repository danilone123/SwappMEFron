import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { buttonStyles, colors, globalStyles, textStyles } from '../styles';
import { changeUserPassword } from '../hooks/createUserHook';
import { executeValidations } from '../utils/Utils';
import type { ProfileParamList } from './ProfileStack';
import type { LoginScreenProps } from '../App';
import { clearTokens, clearUserInformation } from '../servicesSecure/authStorage';

type ValidationResult = {
  valid: boolean;
  description: string;
};

type Props = NativeStackScreenProps<ProfileParamList, 'ChangePassForm'> & LoginScreenProps;

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const ChangePasswordScreen: React.FC<Props> = ({ setIsLoggedIn }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [validations, setValidations] = useState<Record<string, ValidationResult>>({});
  const changePasswordMutation = changeUserPassword();
  const isSubmitting = changePasswordMutation.isPending;

  const logoutAfterPasswordChange = useCallback(async () => {
    await clearTokens();
    await clearUserInformation();
    setIsLoggedIn(false);
  }, [setIsLoggedIn]);

  const clearFieldError = (field: string) => {
    setValidations(current => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submit = useCallback(async () => {
    const results = executeValidations({
      currentPassword: [
        { value: currentPassword, type: 'empty', description: 'La contraseña actual es requerida.' },
      ],
      newPassword: [
        { value: newPassword, type: 'empty', description: 'La nueva contraseña es requerida.' },
        {
          value: newPassword,
          type: 'regex',
          regex: PASSWORD_REGEX,
          description: 'La contraseña debe tener al menos 8 caracteres, una letra y un número.',
        },
      ],
      confirmPassword: [
        { value: confirmPassword, type: 'empty', description: 'Confirma la nueva contraseña.' },
        { value: confirmPassword, type: 'compare', otherComponent: newPassword, description: 'Las contraseñas no coinciden.' },
      ],
    });

    setValidations(results);
    if (Object.keys(results).length > 0) return;

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      Alert.alert('Contraseña actualizada', 'Password actualizado!', [
        { text: 'OK', onPress: () => void logoutAfterPasswordChange() },
      ]);
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? error.response?.status === 422
          ? 'Error al cambiar la contraseña.'
          : error.response?.data?.message
        : undefined;
      setValidations({
        currentPassword: {
          valid: false,
          description: apiMessage || 'La contraseña actual no es válida. Inténtalo nuevamente.',
        },
      });
    }
  }, [changePasswordMutation, confirmPassword, currentPassword, logoutAfterPasswordChange, newPassword]);

  const renderError = (field: string) => {
    const validation = validations[field];
    return validation && !validation.valid
      ? <Text style={styles.errorText}>{validation.description}</Text>
      : null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.helpText}>Usa al menos 8 caracteres, incluyendo una letra y un número.</Text>

        <View style={styles.field}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Contraseña actual"
              placeholderTextColor={colors.INPUT_TEXT}
              secureTextEntry={!isCurrentPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              value={currentPassword}
              editable={!isSubmitting}
              onChangeText={value => { setCurrentPassword(value); clearFieldError('currentPassword'); }}
            />
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={() => setIsCurrentPasswordVisible(visible => !visible)}
              accessibilityRole="button"
              accessibilityLabel={isCurrentPasswordVisible ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'}
              style={styles.passwordVisibilityButton}
            >
              <Feather name={isCurrentPasswordVisible ? 'eye-off' : 'eye'} size={21} color={colors.INPUT_TEXT} />
            </TouchableOpacity>
          </View>
          {renderError('currentPassword')}
        </View>

        <View style={styles.field}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nueva contraseña"
              placeholderTextColor={colors.INPUT_TEXT}
              secureTextEntry={!isNewPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              value={newPassword}
              editable={!isSubmitting}
              onChangeText={value => { setNewPassword(value); clearFieldError('newPassword'); clearFieldError('confirmPassword'); }}
            />
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={() => setIsNewPasswordVisible(visible => !visible)}
              accessibilityRole="button"
              accessibilityLabel={isNewPasswordVisible ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
              style={styles.passwordVisibilityButton}
            >
              <Feather name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={21} color={colors.INPUT_TEXT} />
            </TouchableOpacity>
          </View>
          {renderError('newPassword')}
        </View>

        <View style={styles.field}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirmar nueva contraseña"
              placeholderTextColor={colors.INPUT_TEXT}
              secureTextEntry={!isConfirmPasswordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              value={confirmPassword}
              editable={!isSubmitting}
              onChangeText={value => { setConfirmPassword(value); clearFieldError('confirmPassword'); }}
            />
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={() => setIsConfirmPasswordVisible(visible => !visible)}
              accessibilityRole="button"
              accessibilityLabel={isConfirmPasswordVisible ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
              style={styles.passwordVisibilityButton}
            >
              <Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={21} color={colors.INPUT_TEXT} />
            </TouchableOpacity>
          </View>
          {renderError('confirmPassword')}
        </View>

        <TouchableOpacity
          style={[buttonStyles.big, styles.button, isSubmitting && styles.buttonDisabled]}
          disabled={isSubmitting}
          onPress={submit}
        >
          <Text style={styles.buttonText}>ACTUALIZAR CONTRASEÑA</Text>
        </TouchableOpacity>
      </ScrollView>
      {isSubmitting && (
        <View style={styles.loadingOverlay} accessibilityLabel="Actualizando contraseña">
          <ActivityIndicator color={colors.WHITE} size="large" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: { ...globalStyles.container, padding: 20 },
  content: { flexGrow: 1, justifyContent: 'flex-start', paddingTop: 20, width: '100%' },
  helpText: { ...textStyles.pharagrah, marginBottom: 22, textAlign: 'center' },
  field: { marginBottom: 14, width: '100%' },
  errorText: { color: 'red', fontSize: 13, marginLeft: 10, marginTop: 5 },
  passwordInputContainer: {
    alignItems: 'center',
    backgroundColor: colors.INPUT_BACK,
    borderRadius: 10,
    flexDirection: 'row',
    height: 40,
    paddingLeft: 20,
    width: '100%',
  },
  passwordInput: { ...textStyles.input, flex: 1, height: '100%', paddingVertical: 0 },
  passwordVisibilityButton: { alignItems: 'center', height: '100%', justifyContent: 'center', paddingHorizontal: 13 },
  button: { alignSelf: 'center', marginTop: 12, width: '70%' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.WHITE, fontSize: 13, fontWeight: 'bold' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
  },
});

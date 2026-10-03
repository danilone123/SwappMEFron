import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { useDispatch, useSelector } from 'react-redux';

import { globalStyles, colors, textStyles, buttonStyles } from '../styles';
import axios from 'axios';


//import { openAnnouncementModal } from '../redux/actions/announcementActions';

import AuthLoading from '../screens/AuthLoading';
import { executeValidations } from '../utils/Utils';
import { updateUserPassword } from '../hooks/createUserHook';

type ValidationResult = {
  valid: boolean;
  description: string;
};

const ForgetPasswordForm: React.FC = () => {
  const navigation = useNavigation<any>();
  //const dispatch = useDispatch<any>();
  const updatePasswordMutation = updateUserPassword();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [validations, setValidations] = useState<
    Record<string, ValidationResult>
  >({});

  const submit = useCallback(async () => {
      
    const dictValidations = {
      email: [
        {
          value: email,
          type: 'regex',
          regex: /^[^\s]+$/,
          description: 'Este campo no acepta espacios',
        },
        {
          value: email,
          type: 'empty',
          description: 'Este campo es necesario',
        },
      ],
    };

    
    const results = executeValidations(dictValidations);

    setValidations(results);

    if (Object.keys(results).length !== 0) {

      return;
    }

    try {
        setLoading(true)
        const emailBody = {
            username: email
        }
        const response = await updatePasswordMutation.mutateAsync(emailBody);

        if (response.status === 200) {
          Alert.alert(
            'Código enviado',
            'Revisa tu correo electrónico e ingresa el código para restablecer tu contraseña.',
            [{ text: 'Continuar', onPress: () => navigation.navigate('ResetPassword', { email }) }],
          );
        }
    } catch (error) {
      console.log("forgotPassword endpoint error:::::", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo enviar la solicitud';

      console.log(message);
    } finally {
        setLoading(false)
    }
  }, [email, navigation, updatePasswordMutation]);

  const emailError = useMemo(() => {
    const validation = validations.email;

    if (!validation || validation.valid) {
      return null;
    }

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{validation.description}</Text>
      </View>
    );
  }, [validations]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.line} />

        <View style={styles.line}>
          <View style={globalStyles.input}>
            <TextInput
              style={textStyles.input}
              placeholder="Emaiiill o Nickname"
              placeholderTextColor={colors.INPUT_TEXT}
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {emailError}

        {loading ? (
          <View style={styles.line}>
            <AuthLoading />
          </View>
        ) : (
          <View style={styles.line}>
            <TouchableOpacity
              style={buttonStyles.big}
              onPress={submit}
            >
                {/* style={textStyles.buttonBig} */}
              <Text >ENVIAR</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ForgetPasswordForm;

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    flex: 1,
    padding: 10,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  line: {
    ...globalStyles.containerHorizontal,
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  errorContainer: {
    paddingLeft: 10,
    width: '80%',
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
});

import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { useDispatch, useSelector } from 'react-redux';

import { globalStyles, colors, textStyles, buttonStyles } from '../styles';
import axios from 'axios';


//import { openAnnouncementModal } from '../redux/actions/announcementActions';

import AuthLoading from '../screens/AuthLoading';
import { executeValidations } from '../utils/Utils';
import { updateUserPassword } from '../hooks/createUserHook';
import AnnouncementModal from '../components/AnnouncementModal';

type ValidationResult = {
  valid: boolean;
  description: string;
};

const ForgetPasswordForm: React.FC = () => {
  const navigation = useNavigation<any>();
  //const dispatch = useDispatch<any>();
  const updatePasswordMutation = updateUserPassword();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [validations, setValidations] = useState<
    Record<string, ValidationResult>
  >({});

  const handleResponse = useCallback(async (response: Response) => {
    console.log('status::::', response.status);

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      if (response.status === 403) {
        throw 'El email o nickname no fue encontrado';
      }

      if (response.status === 404) {
        throw 'El usuario no fue encontrado';
      }

      throw (data && data.message) || response.statusText;
    }

    return data;
  }, []);

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

    //   dispatch(
    //     openAnnouncementModal(
    //       'Enviamos instrucciones a tu correo electrónico',
    //       () => navigation.goBack(),
    //     ),
    //   );
    } catch (error) {
      console.log("forgotPassword endpoint error:::::", error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? error.message
        : error instanceof Error
          ? error.message
          : 'No se pudo enviar la solicitud';

      console.log(message);
    } finally {
        setVisible(true)
        setLoading(false)
    }
  }, [ email, handleResponse, navigation]);

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
        <AnnouncementModal
            visible={visible}
            message={'Enviamos instrucciones a tu correo electrónico'}
            onClose={() => setVisible(false)}
            onSuccess={() => navigation.goBack()}
        />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.line} />

        <View style={styles.line}>
          <View style={globalStyles.input}>
            <TextInput
              style={textStyles.input}
              placeholder="Email o Nickname"
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
import React, { useState, useEffect, useLayoutEffect, useCallback }  from 'react';
import { ToastAndroid, Dimensions, ScrollView, TouchableOpacity, TextInput, PermissionsAndroid, View, Text, StyleSheet, Alert, Platform } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    buttonStyles,
    colors,
    globalStyles,
    textStyles,
  } from '../styles';
  import {
    executeValidations,
  } from '../utils/Utils';
import { getUser, saveUser } from '../servicesSecure/authStorage'
//import ProfileParamList from './PortalStack'
import { ProfileParamList } from './ProfileStack';
import { updatePersonalInfo } from '../hooks/createUserHook';
import LoadingIndicator from '../components/LoadingIndicator';

const { width, height } = Dimensions.get('window');

export type ValidationType = {
    valid: boolean;
    description: string;
};

export interface UserResponse {
    user: {
      id: number;
      userName: string;
      nickName: string;
      phone: string;
      userHasPreference: boolean;   
    }
}

type Props = NativeStackScreenProps<ProfileParamList> & {
  };

const ProfileInfoScreen: React.FC<Props> = ({
    navigation,
  }) => {

    const updatePersonalInfoMutation = updatePersonalInfo();

    const [validations, setValidations] =
    useState<
      Record<string, ValidationType>
    >({});

    // Use | null if it starts empty
    const [user, setUserData] = useState<UserResponse['user'] | null>(null);

    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
          const response = await getUser();
          setUserData(response);
        } catch (error) {
          console.error(error);
        }
    };

    const showNotification = (message: string) => {
        if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER);
        } else {
          // iOS fallback
          Alert.alert('Notificación', message, [{ text: 'OK' }]);
        }
      };

// 1. Wrap submit in a useCallback so it reconstructs whenever 'user' changes
  const submit = useCallback(async () => {
    const validationMap = {
      nickName: [
        {
          value: user?.nickName,
          type: 'empty',
          description: 'Este campo es necesario',
        },
      ],
      phone: [
        {
          value: user?.phone,
          regex: /^[0-9]{9}$/,
          description: 'El Teléfono no es válido',
        },
        {
          value: user?.phone, // Fixed: point to state, not string literal
          type: 'empty',
          description: 'Este campo es necesario',
        },
      ],
      name: [
        {
          value: user?.userName,
          regex: /^[a-zA-Z\p{L}]{2,40}(\s+[a-zA-Z\p{L}]{2,40})*$/u,
          description: 'El nombre no es válido',
        },
        {
          value: user?.userName, // Fixed: point to state, not string literal
          type: 'empty',
          description: 'Este campo es necesario',
        },
      ],
    };

    const results = executeValidations(validationMap);
    setValidations(results);

    if (Object.keys(results).length !== 0) {
      return;
    }

    const data = {
      nickname: user?.nickName,
      fullname: user?.userName,
      phone: user?.phone,
    };

    try {
      setIsRefreshing(true);
      await updatePersonalInfoMutation.mutateAsync(data);

      saveUser(user!)
      showNotification("Información actualizada exitosamente!");
      
    } catch (error) {
      console.log("error when updating personal info::::::", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user, updatePersonalInfoMutation]);

  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
          <View style={[styles.button, {paddingRight: 20}]} >
            {isRefreshing ? (
              <LoadingIndicator/>
            ) : (
              <TouchableOpacity
                onPress={() => {submit(); return}}>
                  <Text style={textStyles.link_H1}>Guardar</Text>
              </TouchableOpacity>
            ) }
          </View>
        ),
      })
  }, [navigation, submit, isRefreshing]);

  const renderError = (key: string) => {
        const validation = validations[key];
      
        if (!validation || validation.valid) {
          return <View style={styles.errorContainer} />;
        }
      
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {validation.description}
            </Text>
          </View>
        );
      };

    return (
        <View style={styles.formContainer}>
            {isRefreshing ? (
                //style={styles.noItemsMessageContainer}
          <View >
            <LoadingIndicator />
          </View>
        ) : (
          <ScrollView style={ {} } >
            
            <View style={styles.line}>
                  <View style={globalStyles.input} >
                      <TextInput
                        style={textStyles.input}
                        placeholder="Nick name"
                        autoCapitalize='none'
                        editable={false}
                        value={user?.nickName}
                        placeholderTextColor={colors.INPUT_TEXT}
                        onChangeText={text =>
                            setUserData(prevUser => {
                              // If there is no previous user state, create a default structure
                              if (!prevUser) return null; 
                              
                              return {
                                ...prevUser,
                                nickName: text, // Crucial: Match your interface's exact casing (lowercase 'n')
                              };
                            })
                          }
                        />
                  </View>
                </View>
                {
                  renderError("nickName")
                }
            <View style={styles.line}>
                  <View style={globalStyles.input} >
                      <TextInput
                        style={textStyles.input}
                        placeholder="Nombre"
                        autoCapitalize='none'
                        value={user?.userName}
                        placeholderTextColor={colors.INPUT_TEXT}
                        onChangeText={text =>
                            setUserData(prevUser => {
                              // If there is no previous user state, create a default structure
                              if (!prevUser) return null; 
                              
                              return {
                                ...prevUser,
                                userName: text, // Crucial: Match your interface's exact casing (lowercase 'n')
                              };
                            })
                          }/>
                  </View>
            </View>
                {
                  renderError("name")
                }
  
            <View style={styles.line}>
                <View style={[globalStyles.input, {flex:1, marginRight: 10}]} >
                    <TextInput
                        style={textStyles.input}
                        keyboardType='numeric'
                        textContentType='telephoneNumber'
                        placeholder="+56"
                        editable={false}
                        placeholderTextColor={colors.INPUT_TEXT}/>
                  </View>
                  <View style={[globalStyles.input, {flex:8}]} >
                      <TextInput
                        keyboardType='numeric'
                        style={textStyles.input}
                        placeholder="Telefono"
                        maxLength={9}
                        value={user?.phone.toString()}
                        placeholderTextColor={colors.INPUT_TEXT}
                        textContentType='telephoneNumber'
                        onChangeText={text =>
                            setUserData(prevUser => {
                              // If there is no previous user state, create a default structure
                              if (!prevUser) return null; 
                              
                              return {
                                ...prevUser,
                                phone: text, // Crucial: Match your interface's exact casing (lowercase 'n')
                              };
                            })
                        }
                        />
                  </View>
                </View>
                {
                  renderError("phone")
                }
  
                <View style={styles.separator}>
                  <View style={globalStyles.separator}/>
                </View>
  
  
          </ScrollView>
        )}
       </View>
      );
  };

  export default ProfileInfoScreen;

  const styles = StyleSheet.create({
    formContainer: {...globalStyles.container,
      flex:1,
      padding: 20,
      justifyContent: 'center',
    },
    line:{...globalStyles.containerHorizontal,
      marginVertical: 5,
      flex: 1,
      justifyContent: 'flex-start',
    },
    separator: {
      flex: 0.1,
      width: '100%',
      marginBottom: 10,
    },
    errorContainer:{
      padding: 0,
      justifyContent:'center',
      marginTop : -10,
      marginBottom: 10,
      paddingLeft: 10,
      width: '80%'
    },
    errorText:{
      fontSize: 13,
      color: 'red',
    },
    button: {...buttonStyles.link,
      flex:5,
      alignItems: 'center',
      justifyContent:'center'
    },
  });
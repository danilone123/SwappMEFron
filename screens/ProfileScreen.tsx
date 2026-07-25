import React, { useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Feather } from '@expo/vector-icons';

import {
  textStyles,
  globalStyles,
  colors,
  buttonStyles,
} from '../styles';

import {
    clearTokens,
    clearUserInformation
} from '../servicesSecure/authStorage';

// import { removeUserToken } from '../redux/actions/authenticationActions';

// If using react-navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoginScreenProps } from '../App';

type RootStackParamList = {
  PersonalInfoScreen: undefined;
  ChangePassForm: undefined;
  Details: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList> & LoginScreenProps 
//{
  // Redux injected props (if still using connect)

//   authentication: {
//     token: string;
//   };
//   userSettings: unknown;
//};

const ProfileScreen: React.FC<Props> = ({
  navigation,
  setIsLoggedIn
}) => {

  const logout = useCallback(async () => {
    try {
      console.log("logout button has been selected class ProfileScreen");

      await clearTokens();
      await clearUserInformation()
      setIsLoggedIn(false);

    //   await removeUserToken();
    //   await removeUserSettings();

    //   removeAllCategories();
    //   removeExpoToken();
    //   removeMyItems();
    //   removeRefreshToken();
    } catch (e) {
      console.log('logout error:', e);
    }
  }, []);

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.formContainer}>
        {/* Personal Info */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PersonalInfoScreen')
            }
          >
            <View style={styles.buttonContent}>
              <Text style={styles.textButton}>
                <Feather
                  name="edit"
                  size={18}
                  color={colors.BLACK_LIGHT}
                />{' '}
                Editar Información Personal
              </Text>

              <Feather
                name="chevron-right"
                size={20}
                color={colors.BLACK_LIGHT}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Change Password */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChangePassForm')
            }
          >
            <View style={styles.buttonContent}>
              <Text style={styles.textButton}>
                <Feather
                  name="lock"
                  size={18}
                  color={colors.BLACK_LIGHT}
                />{' '}
                Cambiar Contraseña
              </Text>

              <Feather
                name="chevron-right"
                size={20}
                color={colors.BLACK_LIGHT}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Details')
            }
          >
            <View style={styles.buttonContent}>
              <Text style={styles.textButton}>
                <Feather
                  name="grid"
                  size={18}
                  color={colors.BLACK_LIGHT}
                />{' '}
                Editar Preferencias
              </Text>

              <Feather
                name="chevron-right"
                size={20}
                color={colors.BLACK_LIGHT}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={logout}>
            <View style={styles.buttonContent}>
              <Text style={styles.linkButton}>
                <Feather
                  name="log-out"
                  size={18}
                  color="#0645AD"
                />{' '}
                Cerrar Sesión
              </Text>

              <Feather
                name="chevron-right"
                size={20}
                color="#0645AD"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    formContainer: {
      marginTop: 10,
      marginStart: 10,
      marginEnd: 10,
      marginHorizontal: 0,
      paddingHorizontal: 0,
      justifyContent: 'center',
    },
    line:{...globalStyles.containerHorizontal,
      marginVertical: 5,
      flex: 1,
      justifyContent: 'flex-start',
    },
    separator: {
      flex: 0.3,
      width: '100%',
      height: '100%',
      flexDirection: "column",
      justifyContent: 'center',
      marginBottom: 10,
      marginTop: 10,
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
    buttonContainer: {
      marginStart : 15,
      marginEnd : 15,
    },
    buttonContent: {
      height: 35,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop : 5,
      paddingStart : 10,
      paddingEnd : 10
    },
    textButton : { fontSize : 16, color : colors.BLACK_LIGHT },
    iconButton : { alignItems : "flex-end", color: colors.BLACK_LIGHT, fontSize : 20, marginEnd: 5 },
  
    linkButton : { fontSize : 16, color : "#0645AD" },
    iconLink : { alignItems : "flex-end", color: "#0645AD", fontSize : 20, marginEnd: 5 },
  });
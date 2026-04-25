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
} from 'react-native';

export type LoginScreenProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  navigation: any;
};

const LoginScreen = ({ setIsLoggedIn, navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleCreateUser = () => {
    console.log("create USER Clicked::::::");
    console.log(navigation);
    navigation.navigate("CreateUser")
  };

  const handleLogin = () => {
    console.log("Login button pressed");
    if (!email || !password) {
        
       
         console.log("emIL OR password is empty::::::");
         alert("Login clicked");
      //Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoggedIn(true)
    Alert.alert('Success', `Email: ${email}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.containerTitle}>
        <Text style={styles.title}>Login</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Create User</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 54,
    backgroundColor: '#f2f2f2',
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
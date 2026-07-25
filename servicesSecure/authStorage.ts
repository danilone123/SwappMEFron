import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_TOKEN_KEY = 'user_token';

 interface UserResponse {
  user: {
    id: number;
    userName: string;
    nickName: string;
    phone: string;
    userHasPreference: boolean;   
  }
}

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

// export const saveUser = async (
//   user: any
// ) => {
//   await SecureStore.setItemAsync(USER_TOKEN_KEY, user);
// };

// export const getUser = async () => {
//   return SecureStore.getItemAsync(USER_TOKEN_KEY);
// };

export const saveUser = async (user: UserResponse['user']) => {
  const jsonValue = JSON.stringify(user);
  await SecureStore.setItemAsync(USER_TOKEN_KEY, jsonValue);
};

// 2. Retrieve the string, parse it back to an object, and type the return value
export const getUser = async (): Promise<UserResponse['user'] | null> => {
  const jsonValue = await SecureStore.getItemAsync(USER_TOKEN_KEY);
  
  if (!jsonValue) return null;

  try {
    return JSON.parse(jsonValue) as UserResponse['user'];
  } catch (error) {
    console.error("Failed to parse user data from SecureStore", error);
    return null;
  }
};

export const getAccessToken = async () => {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const clearUserInformation = async () => {
  await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
};
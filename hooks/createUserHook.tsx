
  import { useMutation } from '@tanstack/react-query';
  import { createUser, CreateUserResponse, refreshToken, CreateTokenResponse } from '../.expo/services/CreateUserService'

  interface CreateUserInput {
    email: string;
    password: string;
    fullname: string;
    nickname: string;
    phone: string;
  }
  
  export const useLogin = () => {
    return useMutation<CreateUserResponse, Error, CreateUserInput>({
      mutationFn: (user: CreateUserInput) => createUser(user.email, user.password, user.fullname, user.nickname, user.phone),
    });
  };

  interface CreateUserToken {
    refreshToken: string;
  }

  

  export const refreshTokenNew = () => {
    return useMutation<CreateTokenResponse, Error, CreateUserToken>({
      mutationFn: (user: CreateUserToken) => refreshToken(user.refreshToken),
    });
  };


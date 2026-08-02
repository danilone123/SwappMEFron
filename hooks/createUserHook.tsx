
  import { useMutation } from '@tanstack/react-query';
  import { createUser, CreateUserResponse, refreshToken, CreateTokenResponse, UpdatePersonalInformation, UpdatePassword } from '../services/CreateUserService'

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

  export const updatePersonalInfo = () => {
    return useMutation<string, Error, any>({
      mutationFn: (user: any) => UpdatePersonalInformation(user),
    });
  };


  export const updateUserPassword = () => {
    return useMutation<string, Error, any>({
      mutationFn: (email: any) => UpdatePassword(email),
    });
  };
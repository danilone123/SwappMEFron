
  import { useMutation } from '@tanstack/react-query';
  import { changePassword, ChangePasswordPayload, createUser, CreateUserResponse, refreshToken, CreateTokenResponse, ForgotPasswordResponse, UpdatePersonalInformation, UpdatePassword, resetPassword } from '../services/CreateUserService'

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
    return useMutation<ForgotPasswordResponse, Error, { username: string }>({
      mutationFn: (data) => UpdatePassword(data),
    });
  };

  type ResetPasswordInput = {
    email: string;
    code: string;
    password: string;
  };

  export const resetUserPassword = () => {
    return useMutation<void, Error, ResetPasswordInput>({
      mutationFn: ({ email, code, password }) => resetPassword(email, code, password),
    });
  };

  export const changeUserPassword = () => {
    return useMutation<void, Error, ChangePasswordPayload>({
      mutationFn: changePassword,
    });
  };

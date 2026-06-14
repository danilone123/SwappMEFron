import { useMutation } from '@tanstack/react-query';
import { login, LoginPayload, CreateUserResponse } from '../.expo/services/CreateUserService'

export const loginUser = () => {
    return useMutation<CreateUserResponse, Error, LoginPayload>({
        mutationFn: (item: LoginPayload) => login(item),
      }); 
};
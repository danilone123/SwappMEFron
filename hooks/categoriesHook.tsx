import { useQuery } from '@tanstack/react-query';
import api  from '../servicesSecure/api';

export interface Category {
    id: string;
    name: string;
    subCategories?: Category[];
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get('/all/categories');
    return response.data;
  };

  //userquery is normally for a read only
  export const useCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    });
  };
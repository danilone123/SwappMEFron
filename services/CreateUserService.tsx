import api  from '../servicesSecure/api';

export interface CreateUserResponse {
    user: {
      id: number;
      userName: string;
      nickName: string;
      phone: string;
      userHasPreference: boolean;   
    };
    jwtToken: string;
    refreshToken: string;
  }

export interface CreateTokenResponse {
    jwtToken: string;
    refreshToken: string;
  }

export const createUser = async (email: string, password: string, fullname: string, nickname: string, phone: string): Promise<CreateUserResponse> => {
    const response = await api.post('/create', { email, password, fullname, nickname, phone });
    return response.data;
  };

  export const refreshToken = async (refreshToken: string): Promise<CreateTokenResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  };

  export type CreateItemPayload = {
    description: string;
    type: string;
    title: string;
    urgency: number;
  
    products: {
      title: string;
      type: string;
      lastCategory: {
        id?: string;
      };
    }[];
  
    regions: string[];
    communes: string[];
  };

  export type CreateItemResponse = {
    item_id: string;
  }

  export const createItem = async (
    data: CreateItemPayload,
  ): Promise<CreateItemResponse> => {
    const response = await api.post(
      '/create/item',
      data,
    );
  
    return response.data;
  };

  export type LoginPayload = {
    userName: string,
    password: string
  }

  export type LoginResponse = {
    refreshToken: string,
    user: {
      id: string,
      userName?: string,
      nickName?: string,
      phone?: string
    }
  }

  export const login = async (
    data: LoginPayload,
  ): Promise<CreateUserResponse> => {
    const response = await api.post(
      '/authenticate',
      data,
    );
  
    return response.data;
  };

  export type ItemResponse = {
    id: string,
    description: string,
    follow?: boolean,
    title: string,
    urgency: number,
    numberFollowers: number,
    numberComments: number,
    images: any,
    type: string,
    user: {
      id: string,
      nickName: string,
      userName: string,
    }
    status?: string,
  }

  export const getItems = async (
    page: number,
  ): Promise<ItemResponse[]> => {
    const response = await api.get(
      `/user/items/home/${page}`,
    );
  
    return response.data;
  };

  export const updateImage = async (
    itemId: string,
    image: {
      uri: string;
      type?: string;
      name?: string;
    }
  ): Promise<any> => {
    const formData = new FormData();
  
    //formData.append("item_id", itemId);
  
    formData.append("file", {
      uri: image.uri,
      type: image.type || "image/jpeg",
      name: image.name || "image.jpg",
    } as any);
  
    const response = await api.post(`/upload/image/${itemId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  
    return {
      status: response.status,
      data: response.data,
    };
  };


  export const getMyItems = async (
  ): Promise<ItemResponse[]> => {
    const response = await api.get(
      `/user/items`,
    );
  
    return response.data;
  };

  export type OfferAItemStruct = {
    itemOffered?: string,
    myItems?: any,
    comment: string,
    status: string,
  }


  export const OfferAItem = async (
    data: OfferAItemStruct,
    ): Promise<String> => {
      const response = await api.post(
        `/item/offer`,
        data
      );
    
      return response.data;
    };

    export type ItemsOffered = {
      id: string,
      status: string,
      offerComment: string,
      firstItem: {
        item: ItemResponse,
        user: {
          id: number;
           userName: string;
          nickname: string;
           phone: string;
          userHasPreference: boolean;  
       }
      }
      options: {
        items: ItemResponse[]
        user: {
           id: number;
            userName: string;
           nickname: string;
            phone: string;
           userHasPreference: boolean;  
        }
      }
    } 

   
  export const OfferForME = async (
    ): Promise<ItemsOffered[]> => {
      const response = await api.get(
        `/items/to/me`,
      );
    
      return response.data;
    };

  export const OffersMadeForME = async (
    ): Promise<ItemsOffered[]> => {
      const response = await api.get(
        `/items/me`,
      );
    
      return response.data;
    };

    export const UpdatePersonalInformation = async(data: any) : Promise<string> => {
      const response = await api.post(
        `/user/personal-information`,
        data
      );
    
      return response.data;
    };

    export const UpdateOffer = async(data: any) : Promise<string> => {
      const response = await api.post(
        `/update/offer`,
        data
      );
    
      return response.data;
    };

    export const UpdateRatingOffer = async(data: any) : Promise<string> => {
      const response = await api.post(
        `/offer/score`,
        data
      );
    
      return response.data;
    };

    export const FollowingItems = async() : Promise<ItemResponse[]> => {
      const response = await api.get(
        `/following`,
      );
    
      return response.data;
    };

    // export type Follower = {
    //   folows: boolean
    //   item: {
    //     id: string
    //   }
    // }

    export const UpdateFollowItem = async(data: any) : Promise<string> => {
      const response = await api.post(
        `/item/follow`,
        data
      );
    
      return response.data;
    };
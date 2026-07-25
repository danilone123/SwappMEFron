import { useMutation } from '@tanstack/react-query';
import { UpdateFollowItem, FollowingItems, ItemsOffered, OfferForME, OffersMadeForME, createItem, CreateItemPayload, CreateItemResponse, getItems, ItemResponse, updateImage, getMyItems, OfferAItem, OfferAItemStruct,  } from '../services/CreateUserService'

export const createNewItem = () => {
    return useMutation<CreateItemResponse, Error, CreateItemPayload>({
        mutationFn: (item: CreateItemPayload) => createItem(item),
      }); 
};

export const getAllItems = () => {
    return useMutation<ItemResponse[], Error, number>({
        mutationFn: (page: number) => getItems(page),
      }); 
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({
      itemId,
      image,
    }: {
      itemId: string;
      image: { uri: string; type?: string; name?: string };
    }) => updateImage(itemId, image),
  });
};

export const getAllMyItems = () => {
  return useMutation<ItemResponse[], Error>({
      mutationFn: () => getMyItems(),
    }); 
};

// this method is created to send a offer for an specific item. 
export const setOfferAItem = () => {
  return useMutation<String, Error, OfferAItemStruct>({
    mutationFn: (item: OfferAItemStruct) => OfferAItem(item),
  }); 
}

//will get a list of all the offers made to this user.
export const getOffersForMe = () => {
  return useMutation<ItemsOffered[], Error>({
    mutationFn: () => OfferForME(),
  }); 
}

//will get a list of all the offers made for me to different products.
export const getOffersMadeForMe = () => {
  return useMutation<ItemsOffered[], Error>({
    mutationFn: () => OffersMadeForME(),
  }); 
}

export const getFollowingItems = () => {
  return useMutation<ItemResponse[], Error>({
    mutationFn: () => FollowingItems(),
  }); 
}

export const updateFollowItem = () => {
  return useMutation<String, Error, any>({
    mutationFn: (data: any) => UpdateFollowItem(data),
  }); 
}
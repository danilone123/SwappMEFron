import { useMutation } from '@tanstack/react-query';
import { createItem, CreateItemPayload, CreateItemResponse, getItems, ItemResponse, updateImage, getMyItems, OfferAItem, OfferAItemStruct } from '../.expo/services/CreateUserService'

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
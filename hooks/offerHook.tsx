import { useMutation } from '@tanstack/react-query';
import { UpdateOffer, UpdateRatingOffer } from '../services/CreateUserService'

export const updateUserOffer = () => {
    return useMutation<string, Error, any>({
      mutationFn: (statusOffer: any) => UpdateOffer(statusOffer),
    });
};

export const updateOfferRating = () => {
    return useMutation<string, Error, any>({
      mutationFn: (statusOffer: any) => UpdateRatingOffer(statusOffer),
    });
};
import React, {
    useCallback,
    useEffect,
    useState,
  } from 'react';
  
  import {
    View,
    StyleSheet,
    FlatList,
    Text,
    RefreshControl,
    TouchableOpacity,
    Linking,
  } from 'react-native';

  import { useActionSheet } from '@expo/react-native-action-sheet';
  import { FontAwesome } from '@expo/vector-icons';
  
  import OfferingInItem from '../components/OfferingInItem';
  import RateItemModal from '../components/RateItemModal';
  import LoadingIndicator from '../components/LoadingIndicator';
  import { getOffersForMe } from '../hooks/createItemHook';
  import { updateUserOffer, updateOfferRating } from '../hooks/offerHook';
  import { ItemsOffered, UpdateOffer, UpdateRatingOffer } from '../services/CreateUserService';
  import AnnouncementModal from './AnnouncementModal';
  
//   import {
//     openContactModal,
//   } from '../redux/actions/notificationActions';
  
//   import {
//     openAnnouncementModal,
//   } from '../redux/actions/announcementActions';
  
  import {
    textStyles,
    globalStyles,
    colors,
  } from '../styles';
  
  import { ItemStatus } from '../utils/constants';

  export type ItemStatus =
  typeof ItemStatus[keyof typeof ItemStatus];
  
  type Props = {
    update?: boolean;

  
    // openAnnouncementModal: any;
    // openContactModal: any;
  
    //showActionSheetWithOptions: any;
  };
  
  const OfferingInView: React.FC<Props> = ({
    update,
    //openAnnouncementModal,
   // showActionSheetWithOptions,
  }) => {
    const { showActionSheetWithOptions } = useActionSheet();
    const getOffersForMeMutation = getOffersForMe();
    const updateOfferMutation = updateUserOffer();
    const updateRatingMutation = updateOfferRating();
    const [offers, setOffers] = useState<ItemsOffered[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>();
    const [ratingOpened, setRatingOpened] = useState(false);
    const [ratingItem, setRatingItem] =
      useState<ItemsOffered | null>(null);
  
    const getItemsOfferedToMe = useCallback(async () => {
      try {
        const response = await getOffersForMeMutation.mutateAsync()
  
        setOffers(response);
        setIsRefreshing(false);
      } catch (e) {
        console.log(e);
      }
    }, []);
  
    useEffect(() => {
      getItemsOfferedToMe();
    }, [getItemsOfferedToMe]);
  
    useEffect(() => {
      if (update) {
        getItemsOfferedToMe();
      }
    }, [update, getItemsOfferedToMe]);
  
    const updateStatus = useCallback(
      async (post: ItemsOffered, status: ItemStatus) => {
        const postId = post.id;
  
        console.log("method update status called inside offeringInView::::", status)
        const data = {
          id: postId,
          status
        }
        try {
          
          setIsRefreshing(true);
          await updateOfferMutation.mutateAsync(data)
          
          //update the status locally of the item selected
          setOffers((prevOffers) =>
           prevOffers.map((offer) =>
              offer.id === post.id
              ? { ...offer, status }
              : offer
            )
          );
        } catch (e) {
          console.log("error when updateing offer status", e);
        } finally {
          setIsRefreshing(false);
        }
      },
      [getItemsOfferedToMe]
    );
  
    const rateItem = useCallback(
      async (rateValue: number) => {
        if (!ratingItem) return;
  
        try {
          setIsRefreshing(true);
          const data = {
            score: rateValue,
            user: {
              id: ratingItem.options.user.id,
            },
            offer: {
              id: ratingItem.id,
            }
          };

          await updateRatingMutation.mutateAsync(data)
          getItemsOfferedToMe();

        } catch (e) {
          console.log(e);
        } finally {
          setIsRefreshing(false);
        }
      },
      [ratingItem, getItemsOfferedToMe]
    );
  
    const contactFunction = useCallback(
      
      (item: ItemsOffered) => {
        console.log("contactFunction item selected:::::", item)
        const options = ['Whatsapp', 'Telefono', 'Cancelar'];
  
        const icons = [
          <FontAwesome key="wa" name="whatsapp" size={24} />,
          <FontAwesome key="ph" name="phone" size={24} />,
        ];
  
        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: 2,
            title: 'Contactarse Por:',
            icons,
          },
          (buttonIndex?: number) => {
            console.log('buttonIndex', buttonIndex);
            switch (buttonIndex) {
              case 0:
                
                // Linking.openURL(
                //   `https://wa.me/56${item.options.user.phone}`
                // );
                openWhatsApp(item.options.user.phone, `Hola, vi tu interés en la publicación. ${item.firstItem.item.description}`)
                break;
              case 1:
                // Linking.openURL(
                //   `tel:+56${item.options.user.phone}`
                // );
                makePhoneCall(item.options.user.phone)
                break;
            }
          }
        );
      },
      [showActionSheetWithOptions]
    );

    const openWhatsApp = async (
      phoneNumber: string,
      message: string,
    ) => {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
    
      const url =
        `https://wa.me/${cleanPhone}` +
        `?text=${encodeURIComponent(message)}`;
    
      await Linking.openURL(url);
    };

    const makePhoneCall = async (phoneNumber: string) => {
      const url = `tel:${phoneNumber}`;
    
      await Linking.openURL(url);
    };

    const openAnnouncementModal = (text: string, onSuccess: () => void) => {
      //setVisible(true);
      console.log("openAnnouncementModal::: here class offeringInvView:::::text===", text);
      setMessage(text);
      setOnSuccess(onSuccess);
      setVisible(true);
    //   <AnnouncementModal
    //   visible={visible}
    //   message={text}
    //   onClose={() => setVisible(false)}
    // />
    };
    
  
    const renderItem = ({ item }: { item: ItemsOffered }) => (
      <OfferingInItem
        post={item}
        modalFunction={openAnnouncementModal}
        // {(text: string, onSuccess: () => void) =>
        //   //openAnnouncementModal(text, onSuccess)
        //   console.log("test here class offeringInvView")
        // }
        updateStatus={updateStatus}
        openRatingFunction={(item: ItemsOffered) => {
          setRatingItem(item);
          setRatingOpened(true);
        }}
        contactFunction={contactFunction}
      />
    );
  
    return (
      <View style={styles.container}>
        <RateItemModal
          visible={ratingOpened}
          //ratingItem={ratingItem}
          onAccept={(rating: number) => {
            setRatingOpened(false);
            rateItem(rating);
          }}
          onCancel={() => setRatingOpened(false)}
        />

<AnnouncementModal
    visible={visible}
    message={message}
    onClose={() => setVisible(false)}
    onSuccess={onSuccess}
  />
  
        <View style={styles.body}>
          {isRefreshing ? (
            <LoadingIndicator />
          ) : offers.length === 0 ? (
            <View style={styles.noItemsMessageContainer}>
              <Text style={textStyles.label}>
                No tienes ofertas recibidas
              </Text>
  
              <TouchableOpacity
                onPress={getItemsOfferedToMe}
              >
                <Text style={textStyles.link}>
                  Actualizar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={offers}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              style={styles.itemList}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={() => {
                    setIsRefreshing(true);
                    getItemsOfferedToMe();
                  }}
                  colors={[colors.BLUE]}
                />
              }
            />
          )}
        </View>
      </View>
    );
  };

  export default OfferingInView;

  const styles = StyleSheet.create({
    container: {...globalStyles.container,
      // width: '100%',
      padding: 0,
      margin: 0,
      marginTop: 0,
    },
    body: {
      width: '100%',
      flex: 14,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 0,
    },
    noItemsMessageContainer: {
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    separator: {
      flex: 0.3,
      width: '100%',
      height: '100%',
      flexDirection: "column",
      justifyContent: 'center',
      marginBottom: 10,
      marginTop: 10,
    },
    itemList: {
      width: '100%',
      height: '100%',
    }
  });
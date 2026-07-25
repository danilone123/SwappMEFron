import React, {
    useCallback,
    useEffect,
    useState,
  } from 'react';
  
  import {
    FlatList,
    Linking,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  
  import { FontAwesome } from '@expo/vector-icons';
  import { useActionSheet } from '@expo/react-native-action-sheet';
  
  import OfferingOutItem from '../components/OfferingOutItem';
  import LoadingIndicator from '../components/LoadingIndicator';
  import { ItemsOffered } from '../services/CreateUserService';
  import { getOffersMadeForMe } from '../hooks/createItemHook';
  import { updateUserOffer } from '../hooks/offerHook';
  
  import {
    colors,
    globalStyles,
    textStyles,
  } from '../styles';
  
  import {
    ItemStatus,
  } from '../utils/constants';
  
  type ItemStatusType =
    typeof ItemStatus[keyof typeof ItemStatus];
  
  type Props = {
    update?: boolean;
  };
  
  const OfferingOutView: React.FC<Props> = ({
    update,
  }) => {
    const { showActionSheetWithOptions } =
      useActionSheet();
    
    const updateOfferMutation = updateUserOffer();
    const getOffersMadeForMeMutation = getOffersMadeForMe();
  
    const [offers, setOffers] = useState<
    ItemsOffered[]
    >([]);
  
    const [isRefreshing, setIsRefreshing] =
      useState(false);
  
    const [isLoading, setIsLoading] =
      useState(false);
  
    const loadItems = useCallback(async () => {
      try {
        setIsRefreshing(true);
  
        const response = await getOffersMadeForMeMutation.mutateAsync();
        setOffers(response);

      } catch (error) {
        console.log(error);
      } finally {
        setIsRefreshing(false);
      }
    }, []);
  
    useEffect(() => {
      loadItems();
    }, [loadItems]);
  
    useEffect(() => {
      if (update) {
        loadItems();
      }
    }, [update, loadItems]);
  
    const updateStatus = useCallback(
      async (
        post: ItemsOffered,
        status: ItemStatusType
      ) => {
        try {

          setIsLoading(true);
          let data = { id : post.id, status : status }
          await updateOfferMutation.mutateAsync(data);
  
          if (
            status === ItemStatus.CANCELLED
          ) {
            setOffers(current =>
              current.filter(
                offer => offer.id !== post.id
              )
            );
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
      []
    );
  
    const contactFunction = useCallback(
      (item: ItemsOffered) => {
        showActionSheetWithOptions(
          {
            options: [
              'Whatsapp',
              'Telefono',
              'Cancelar',
            ],
            cancelButtonIndex: 2,
            title: 'Contactarse Por:',
            icons: [
              <FontAwesome
                key="wa"
                name="whatsapp"
                size={24}
              />,
              <FontAwesome
                key="phone"
                name="phone"
                size={24}
              />,
            ],
          },
          (buttonIndex?: number) => {
            switch (buttonIndex) {
              case 0:
                Linking.openURL(
                  `https://wa.me/56${item.firstItem.user.phone}`
                );
                break;
  
              case 1:
                Linking.openURL(
                  `tel:+56${item.firstItem.user.phone}`
                );
                break;
            }
          }
        );
      },
      [showActionSheetWithOptions]
    );
  
    const renderItem = ({
      item,
    }: {
      item: ItemsOffered;
    }) => (
      <OfferingOutItem
        post={item}
        updateStatus={updateStatus}
        contactFunction={contactFunction}
        //modalFunction={() => {}}
      />
    );
  
    if (isLoading) {
      return <LoadingIndicator />;
    }
  
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          {offers.length === 0 ? (
            <View
              style={
                styles.noItemsMessageContainer
              }
            >
              <Text style={textStyles.label}>
                No tienes ofertas realizadas
              </Text>
  
              <TouchableOpacity
                onPress={loadItems}
              >
                <Text style={textStyles.link}>
                  Actualizar
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={offers}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              style={styles.itemList}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={loadItems}
                  colors={[colors.BLUE]}
                />
              }
            />
          )}
        </View>
      </View>
    );
  };
  
  export default OfferingOutView;
  
  const styles = StyleSheet.create({
    container: {
      ...globalStyles.container,
      width: '100%',
      padding: 0,
    },
  
    body: {
      width: '100%',
      flex: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    noItemsMessageContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    itemList: {
      width: '100%',
      height: '100%',
    },
  });
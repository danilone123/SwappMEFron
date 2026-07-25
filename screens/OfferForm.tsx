import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback,
  } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
  } from 'react-native';
  
  
  import { globalStyles, colors, textStyles } from '../styles';
  //import { openAnnouncementModal } from '../redux/actions/announcementActions';

  
  import AuthLoading from '../screens/AuthLoading';
  import OfferComment from '../components/OfferComment';

  import Post2 from '../components/Post2';
  
  import ImageGallery, { GalleryItem } from '../components/ImageGallery';
  import { getAllMyItems, setOfferAItem } from '../hooks/createItemHook';
  import { ItemResponse } from '../services/CreateUserService';
  import { RootStackParamList } from './DescriptionScreen';
  import {
    NativeStackScreenProps,
  } from '@react-navigation/native-stack';

  import { PostItem } from '../screens/HomeScreen'

  
  type Props = NativeStackScreenProps<
  RootStackParamList,
    'OfferParamItem'
  >;
  
  const OfferForm: React.FC<Props> = ({
    navigation,
    route,
  }) => {
    const post = route.params.post;
    const getItemMutation = getAllMyItems();
    const setOfferAItemMutation = setOfferAItem()
  
    const [data, setData] = useState<GalleryItem[]>([]);
    const [offerings, setOfferings] = useState<ItemResponse[]>([]);
    const [itemsSelected, setItemsSelected] = useState<GalleryItem[]>([]);
    const [isLoadingRequest, setIsLoadingRequest] = useState(false);
    const [showComment, setShowComment] = useState(false);
  
    const onCancel = useCallback(() => {
      setShowComment(false);
    }, []);
  
    const openComment = useCallback(() => {
       if (itemsSelected.length === 0 || isLoadingRequest) {
        Alert.alert(
          'Atención',
          data.length === 0
            ? 'No tienes items, debes crear uno'
            : 'Debes seleccionar por lo menos un item',
          [{ text: 'OK' }]
        );
    
        return;
       }
  
       setShowComment(true);
    }, [
      data.length,
      isLoadingRequest,
      itemsSelected.length,
    ]);
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View style={[styles.button, { paddingRight: 20 }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={openComment}
            >
              <Text
                style={[
                  textStyles.link,
                  { fontSize: 16 },
                ]}
              >
                Ofertar
              </Text>
            </TouchableOpacity>
          </View>
        ),
      });
    }, [navigation, openComment]);
  
    const submit = async (comment?: string) => {
      if (
        itemsSelected.length === 0 ||
        isLoadingRequest
      ) {
        return;
      }
  
     setShowComment(false);
      const payload = {
        itemOffered: route.params.post.id,
        myItems: itemsSelected.map(item => item.id),
        comment: comment ?? '',
        status: 'pending',
      };
  
      try {
        setIsLoadingRequest(true);
        const response = await setOfferAItemMutation.mutateAsync(payload)
        console.log("response value for offerForm when offering a imte::::", response)
        console.log("the id of the itemoffered is:::::", payload.itemOffered)
        navigation.popTo('Dashboard', {
          id: payload.itemOffered,
        });
      } catch (error) {
        console.error('OfferForm error:', error);
      } finally {
        setIsLoadingRequest(false);
      }
    };
  
    const getMyItemsFromServer = useCallback(async () => {
      try {
        setIsLoadingRequest(true);
        
        const response = await getItemMutation.mutateAsync();
        //user can only make an offer using his open status items.
        const openItems = response.filter(i => i.status === "open")

        setOfferings(openItems);
  
        const mappedItems: GalleryItem[] = openItems.map(
          (item: ItemResponse) => ({
            id: item.id,
            uri:
              item.images[
                Object.keys(item.images)[0]
              ],
          })
        );


  
        setData(mappedItems);
       // dispatch(saveMyItems(mappedItems));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingRequest(false);
      }
    }, [
    ]);
  
    useEffect(() => {
      getMyItemsFromServer();  
    }, [getMyItemsFromServer]);
  
    const renderEmptyData = () => (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 20,
        }}
      >
          {/* style={styles.textContainer} */}
        <Text >
          Recuerda que para hacer SWAPP primero debes
          subir una publicación.
        </Text>
      </View>
    );
  
    const renderPostsView = () => {
      if (data.length === 0) {
        return renderEmptyData();
      }
  
      return (
        <View style={styles.galleryContainer}>
          <View style={styles.galleryContentHeader}>
          {/* style={styles.textContainer} */}
            <Text >
              Elige una o mas publicaciones para
              ofertar este producto:
            </Text>
          </View>
  
          <View style={styles.galleryContent}>
            <ImageGallery
              data={data}
              onSelectItem={(item: GalleryItem) => {
                setItemsSelected(prev => [
                  ...prev,
                  item,
                ]);
              }}
              onUnselectItem={(item: GalleryItem) => {
                setItemsSelected(prev =>
                  prev.filter(
                    i => i.id !== item.id
                  )
                );
              }}
            />
          </View>
        </View>
      );
    };
  
    if (isLoadingRequest) {
      return (
        <View style={styles.container}>
          <AuthLoading />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <OfferComment
          onCancel={onCancel}
           onAccept={submit}
          visible={showComment}
        />
  
        <View style={styles.postSelectedContainer}>
          <Post2 post={post} />
        </View>
  
        {renderPostsView()}
      </View>
    );
  };
  
  export default OfferForm;
  
  const styles = StyleSheet.create({
    container: {
      ...globalStyles.container,
      padding: 0,
      margin: 0,
      backgroundColor: '#F5F5F5',
    },
    postSelectedContainer: {
      flex: 1,
      width: '100%',
      marginBottom: 5,
      backgroundColor: 'white',
    },
    textContainer: {
      ...textStyles.title_H2,
      color: colors.BLACK,
      fontSize: 18,
      width: '98%',
    },
    galleryContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: 'white',
    },
    galleryContent: {
      flex: 5,
      margin: 10,
      paddingStart: 5,
      paddingEnd: 5,
    },
    galleryContentHeader: {
      margin: 10,
      paddingStart: 5,
      paddingEnd: 5,
    },
    button: {},
  });

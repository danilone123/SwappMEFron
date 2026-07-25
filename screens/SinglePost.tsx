import React, {
    FC,
    useEffect,
    useLayoutEffect,
    useState,
  } from 'react';
  import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  
  import {
    NativeStackScreenProps,
  } from '@react-navigation/native-stack';
  
  import LoadingIndicator from '../components/LoadingIndicator';
  import Post from '../components/Post';
  
  import { textStyles } from '../styles';
  
  import { PostItem } from './HomeScreen';
  
  //
  // Navigation Types
  //
  
  export type RootStackParamList = {
    SinglePost: {
      post: PostItem;
      isOffertable: boolean;
      hideActions?: boolean;
    };
  };
  
  type Props = NativeStackScreenProps<
    RootStackParamList,
    'SinglePost'
  >;
  
  //
  // Models
  //
  
  const SinglePostScreen: FC<Props> = ({
    navigation,
    route,
  }) => {
  
    const [itemSelected, setItemSelected] =
      useState<PostItem | null>(null);
  
    const [isMessagesModalOpen, setIsMessagesModalOpen] =
      useState(false);
  
    const [isOffertable, setIsOffertable] =
      useState(false);
  
    //
    // Initial Data
    //
    useEffect(() => {
      setItemSelected(route.params.post);
      setIsOffertable(route.params.isOffertable);
    }, [route.params]);
  
    //
    // Header Actions
    //
    // useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerRight: () => (
    //       <TouchableOpacity
    //         style={styles.offerButton}
    //         onPress={() => {
    //           // TODO: implement submit offer
    //           console.log('Offer clicked');
    //         }}
    //       >
    //         <Text
    //           style={[
    //             textStyles.link,
    //             { fontSize: 16 },
    //           ]}
    //         >
    //           Ofertar
    //         </Text>
    //       </TouchableOpacity>
    //     ),
    //   });
    // }, [navigation]);
  
    const handleCloseMessages = (
      numberComments: number,
    ) => {
      setIsMessagesModalOpen(false);
  
      setItemSelected(prev =>
        prev
          ? {
              ...prev,
              numberComments,
            }
          : prev,
      );
    };
  
    return (
      <ScrollView style={styles.container}>
        {/* <ChatModal
          currentUser={userSettings.settings}
          itemId={itemSelected?.id ?? ''}
          isOpen={isMessagesModalOpen}
          onClose={handleCloseMessages}
        /> */}
  
        <View style={styles.postSelectedContainer}>
          {!itemSelected ? (
            <LoadingIndicator />
          ) : (
            <Post
              post={itemSelected}
              navigation={navigation}
              isOffertable={isOffertable}
              hideActions={route.params.hideActions === true}
              token="mock-token"
              refreshToken="mock-refresh-token"
            //   openMessagesModal={() =>
            //     setIsMessagesModalOpen(true)
            //   }
            />
          )}
        </View>
      </ScrollView>
    );
  };
  
  export default SinglePostScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
  
    postSelectedContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: 'white',
      marginBottom: 5,
    },
  
    offerButton: {
      paddingRight: 20,
    },
  });

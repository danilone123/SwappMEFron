import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextStyle
} from 'react-native';

import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

import { useMutation } from '@tanstack/react-query';

import ProductRow from './ProductRow';
// import Rating from './Rating';
// import ShareItem from './ShareItem';
import PostAvatar from './PostAvatar';

import { textStyles, globalStyles, colors } from '../styles';
import { itemTypes } from '../utils/constants';

// 👉 replace with your real API function
// import { followItem } from '../services/followService';


// ------------------
// TYPES
// ------------------

interface User {
  userName: string;
}

export interface PostType {
  id: string;
  follow: boolean;
  numberFollowers: number;
  type: 'offers' | 'donation';
  offer?: string;
  search?: string;
  description: string;
  placeToChange: string;
  urgency: number;
  images: any;
  user: User;
  numberComments: number;
  showSwapp?: boolean;
}

interface Props {
  post: PostType;
  token: string;
  refreshToken: string;
  isOffertable?: boolean;
  navigation: any;
  // openMessagesModal: (post: PostType) => void;
}

type AntDesignIconName = React.ComponentProps<
  typeof AntDesign
>['name'];

// ------------------
// COMPONENT
// ------------------

const Post: React.FC<Props> = ({
  post,
  token,
  refreshToken,
  isOffertable,
  navigation,
  // openMessagesModal,
}) => {
  const [follows, setFollows] = useState<boolean>(false);
  const [numberFollowers, setNumberFollowers] = useState<number>(0);

  useEffect(() => {
    setFollows(post.follow);
    setNumberFollowers(post.numberFollowers);
  }, [post]);

  // ------------------
  // MUTATION
  // ------------------
  // const followMutation = useMutation({
  //   mutationFn: () =>
  //     followItem({
  //       token,
  //       refreshToken,
  //       itemId: post.id,
  //       follows: !follows,
  //     }),

  //   onSuccess: () => {
  //     setFollows((prev) => !prev);
  //     setNumberFollowers((prev) =>
  //       follows ? prev - 1 : prev + 1
  //     );
  //   },

  //   onError: (err) => {
  //     console.error(err);
  //   },
  // });

  const handleFollow = () => {
    //followMutation.mutate();
  };

  const heartIcon: AntDesignIconName = follows
  ? 'heart'
  : 'heart';

  // ------------------
  // RENDER HELPERS
  // ------------------

  const renderHeader = () => {
    if (post.type === 'offers') {
      return (
        <>
          <ProductRow
            icon={itemTypes.OFFERS_ICON}
            type={itemTypes.OFFERS_TAG}
            title={post.offer ?? ''}
            color={itemTypes.OFFERS_COLOR}
          />
          <ProductRow
            icon={itemTypes.SEARCHING_ICON}
            type={itemTypes.SEARCHING_TAG}
            title={post.search ?? ''}
            color={itemTypes.SEARCHING_COLOR}
          />
        </>
      );
    }

    if (post.type === 'donation') {
      return (
        <ProductRow
          icon={itemTypes.DONATION_ICON}
          type={itemTypes.DONATION_TAG}
          title={post.offer ?? ''}
          color={itemTypes.DONATION_COLOR}
        />
      );
    }

    return null;
  };

  // ------------------
  // RENDER
  // ------------------

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <PostAvatar name={post.user.userName} />

        {renderHeader()}

        <View style={styles.description}>
          <Text style={textStyles.pharagrah} numberOfLines={4}>
            {post.description}
          </Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.lineNoPaddingVert}>
          <View style={styles.containerLeft}>
            {/* style={[textStyles.title_H2, { color: colors.BLACK_LIGHT }]} */}
            <Text style={[textStyles.title_H2 as TextStyle, { color: colors.BLUE}]}>
              <Entypo name="location-pin" size={16} color={colors.RED} />
              {post.placeToChange}
            </Text>
          </View>

          <View style={styles.containerRight}>
            {/* <Rating rating={post.urgency} /> */}
          </View>
        </View>

        <View style={styles.imageContent}>
          <Image
            style={{ width: '100%', height: 300 }}
            source={post.images}
          />
        </View>

        {isOffertable !== false && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('OfferForm', { post })
              }
            >
              {post.showSwapp && (
                <View style={styles.buttonContent}>
                  <Text style={styles.textButton}>Swapp</Text>
                  <Feather name="chevron-right" style={styles.iconButton} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.lineNoPaddingVert}>
          <TouchableOpacity onPress={handleFollow}>
            <AntDesign
              name={heartIcon}
              size={25}
              color={follows ? 'red' : 'gray'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => openMessagesModal(post)}
          >
            <Feather name="message-circle" size={25} color="gray" />
          </TouchableOpacity>

          {/* <ShareItem item={post} /> */}
        </View>

        <Text>{numberFollowers} Siguiendo la publicación</Text>

        <TouchableOpacity 
        // onPress={() => openMessagesModal(post)}
        >
          <Text style={textStyles.label}>
            {post.numberComments} Comentarios
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      justifyContent:"flex-start",
      // alignItems: "center",
      flex: 1,
      height: "500%",
      padding: 5,
    },
    headerContainer: {
      marginTop: 10,
      flex:3,
      justifyContent:"flex-start",
      width: '100%',
      // paddingHorizontal: 10,
      marginBottom : 5,
    },
    imageContainer: {
      flex:7,
      width: "100%",
      margin : 0,
      padding: 0
    },
    footerContainer: {
      flex:2,
      width: "100%"
    },
    iconHeader : {
      fontSize: 20,
      paddingEnd : 5,
      paddingBottom: 5
    },
    offerIcon : {
      color: "#FF7A00",
    },
    searchIcon : {
      color: "#39B54A",
    },
    donationIcon : {
      color:"#FF7A00",
    },
    buttonContainer: {
      backgroundColor : "#652fe9"
    },
    modLine: {
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
    },
    line: { ... globalStyles.borders,
      flex: 1,
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
    },
    lineNoPaddingVert: { ... globalStyles.borders,
      flex: 1,
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      paddingVertical: 0,
      padding : 10,
      // marginBottom : 10,
      // marginTop : 10
    },
    imageContent: {
      flex: 14,
      width: "100%",
      height: "100%",
      //alignItems: "center",
      padding: 0,
      margin: 0,
    },
    buttonContent: {
      height: 35,
      color : "white",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop : 5,
      paddingStart : 10,
      paddingEnd : 10
    },
    textButton : { fontSize : 18, color : "white" },
    iconButton : { alignItems : "flex-end", color: "white", fontSize : 23 },
    description: { ... globalStyles.borders,
      flex: 4,
      width: "100%",
      // alignItems: "left",
    },
    containerLeft: {
      width: "100%",
      height: "100%",
      flex: 5,
      flexDirection: "row",
      justifyContent:"flex-start",
      alignItems: "center",
    },
    containerRight: {
      width: "100%",
      height: "100%",
      flex: 5,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    //   text: {
    //   ...textStyles.title_H2,
    //   textAlign: 'center',
    // },
  });
  
  // const mapStateToProps = state => ({
  //   network: state.network,
  //   refresh: state.refreshToken
  // });
  
  // const mapDispatchToProps = dispatch => ({
  //   doPost: (params) => dispatch(doPost(params)),
  // });

export default Post;
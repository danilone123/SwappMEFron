import React, { FC, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { textStyles, colors, buttonStyles } from '../styles';
import { ItemStatus } from '../utils/constants';
import { ItemsOffered } from '../services/CreateUserService';

export type ItemStatus =
  typeof ItemStatus[keyof typeof ItemStatus];

type User = {
  userName?: string;
};

type ItemImage = Record<string, string>;

type OptionItem = {
  images: ItemImage;
};

// type OfferPost = {
//   isAccepted?: boolean;
//   isTerminated?: boolean;
//   status: ItemStatus | string;
//   offerComment?: string;
//   firstItem: {
//     item: {
//       images: ItemImage;
//     };
//   };
//   options: {
//     user: User;
//     items: OptionItem[];
//   };
// };

type Props = {
  post: ItemsOffered;
  modalFunction: (msg: string, onConfirm: () => void) => void;
  updateStatus: (post: ItemsOffered, status: ItemStatus) => void;
  contactFunction: (post: ItemsOffered) => void;
  openRatingFunction: (post: ItemsOffered) => void;
};

const EMPTY_IMAGE =
  'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';

const OfferingIn: FC<Props> = ({
  post,
  modalFunction,
  updateStatus,
  contactFunction,
  openRatingFunction,
}) => {
  //
  
  // const [isTerminated, setIsTerminated] = useState(
  //   false
  // );

  const status = post.status;
  const user = post.options.user;
  const options = post.options.items;

  const itemImage = useMemo(() => {
    const item = post.firstItem?.item;

    if (!item?.images) return EMPTY_IMAGE;

    const keys = Object.keys(item.images);

    if (keys.length === 0) return EMPTY_IMAGE;

    return item.images[keys[0]];
  }, [post]);

  if (status === ItemStatus.REJECTED) {
    return null;
  }

  const renderOfferComment = () => {
    if (!post.offerComment) return null;

    return (
      <View style={styles.header}>
        <Text numberOfLines={4}>
        {/* style={textStyles.title_H2} */}
          <Text >
            Comentario:{' '}
          </Text>
          {post.offerComment}
        </Text>
      </View>
    );
  };

  const renderButtons = () => {
    switch (status) {
      case ItemStatus.PENDING:
        return (
          <>
            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => {
                modalFunction(
                  'Desea aceptar la oferta?',
                  () => {
                    //setIsAccepted(true);
                    updateStatus(
                      post,
                      ItemStatus.ACCEPTED
                    );
                  }
                );
              }}
            >
                {/* style={styles.buttonOffer} */}
              <Text >
                Aceptar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() => {
                modalFunction(
                  'Desea rechazar la oferta?',
                  () => {
                    //setIsTerminated(true);
                    updateStatus(
                      post,
                      ItemStatus.REJECTED
                    );
                  }
                );
              }}
            >
                {/* style={styles.buttonOffer} */}
              <Text >
                Rechazar
              </Text>
            </TouchableOpacity>
          </>
        );

      case ItemStatus.ACCEPTED:
        return (
          <>
            <TouchableOpacity
              style={styles.buttonContact}
              onPress={() =>
                contactFunction(post)
              }
            >
                {/* style={styles.buttonOffer} */}
              <Text >
                Contactar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonReject}
              onPress={() =>
                openRatingFunction(post)
              }
            >
                 {/* style={styles.buttonOffer} */}
              <Text>
                Terminar
              </Text>
            </TouchableOpacity>
          </>
        );

      case ItemStatus.COMPLETED:
        return (
          <View style={styles.buttonContact}>
              {/* //style={styles.buttonOffer} */}
            <Text >
              Terminado
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View>
      <View style={styles.imgContainer}>
        <Image
          source={{ uri: itemImage }}
          style={styles.img}
        />
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.header}>
          <Text numberOfLines={4}>
          {/* style={textStyles.title_H2} */}
            <Text >
              {user.userName ?? 'Anónimo'}
            </Text>{' '}
            te oferta un producto
          </Text>
        </View>

        <View style={styles.imagesContainer}>
          {options.map((opt, index) => {
            const imageId = Object.keys(opt.images)[0];

            return (
              <Image
                key={`${imageId}-${index}`}
                style={styles.imageItem}
                resizeMode="contain"
                source={{
                  uri: opt.images[imageId],
                }}
              />
            );
          })}
        </View>

        {renderOfferComment()}
      </View>

      <View style={styles.buttonContainer}>
        {renderButtons()}
      </View>
    </View>
  );
};

export default OfferingIn;

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flex: 1,
      height: "20%",
      width: "100%",
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginBottom : 5
    },
    thumbnailContainer:{
      flex: 2,
      height: 50,
      margin:0,
      borderRadius: 50/2,
      backgroundColor: colors.GRAY
    },
    buttonContainer:{
      flex:3.7,
      justifyContent: "center",
      alignItems: "center",
    },
  
    imgContainer: {
      marginLeft: 8,
      height: 50,
      width: 50,
      borderRadius: 40,
      overflow : 'hidden',
    },
  
    img: {
      height: 50,
      width: 50,
      borderRadius: 40,
    },
  
    bodyContainer:{
      paddingLeft: 10,
      flex: 8,
      justifyContent: 'space-between'
    },
    header:{
      flex: 1,
      margin: 3
    },
    buttonAccept: {...buttonStyles.small,
      width: "100%",
      backgroundColor: colors.WHITE,
      borderColor: colors.GREEN,
      borderWidth: 1
    },
    buttonContact: {...buttonStyles.small,
      width: "100%",
      backgroundColor: colors.WHITE,
      borderColor: colors.GRAY,
      borderWidth: 1
    },
    buttonReject: {...buttonStyles.small,
      width: "100%",
      marginTop: 4,
      backgroundColor: colors.WHITE,
      borderColor: colors.RED,
      borderWidth: 1
    },
    buttonTerminate: {...buttonStyles.small,
      width: "100%",
      marginTop: 4,
      backgroundColor: colors.WHITE,
      borderColor: colors.GRAY,
      borderWidth: 1
    },
    buttonOffer: {...textStyles.buttonSmall,
      color:colors.BLACK,
    },
    imageItem:{
      width: 50,
      height: 50,
      backgroundColor: colors.GRAY,
      marginEnd : 5
    },
    line: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
    },
    imagesContainer: {
      flexDirection: "row",
      flex: 1,
      height: "20%",
      width: "100%"
    },
  });
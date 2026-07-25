import React, { FC, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import {
  textStyles,
  colors,
  buttonStyles,
} from '../styles';

import { ItemStatus } from '../utils/constants';
import AuthLoading from '../screens/AuthLoading';
import { ItemsOffered } from '../services/CreateUserService';

type ItemStatusType =
  typeof ItemStatus[keyof typeof ItemStatus];

interface User {
  userName?: string;
  phone?: string;
}

interface Item {
  images?: Record<string, string>;
}

interface OptionItem {
  images: Record<string, string>;
}

interface OfferPost {
  status: ItemStatusType;
  loading?: boolean;

  firstItem: {
    item: Item;
    user: User;
  };

  options: {
    items: OptionItem[];
  };
}

interface Props {
  post: ItemsOffered;

  updateStatus: (
    post: ItemsOffered,
    status: ItemStatusType
  ) => void;

  contactFunction: (
    post: ItemsOffered
  ) => void;
}

const EMPTY_IMAGE =
  'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';

const OfferingOutItem: FC<Props> = ({
  post,
  updateStatus,
  contactFunction,
}) => {
  const itemImage = useMemo(() => {
    const images = post.firstItem.item?.images;

    if (!images) {
      return EMPTY_IMAGE;
    }

    const firstKey = Object.keys(images)[0];

    return firstKey
      ? images[firstKey]
      : EMPTY_IMAGE;
  }, [post]);

  const renderContactButton = () => {
    if (
      post.status !== ItemStatus.ACCEPTED
    ) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.buttonSearch}
        onPress={() =>
          contactFunction(post)
        }
      >
          {/* style={styles.buttonOffer} */}
        <Text >
          Contactar
        </Text>
      </TouchableOpacity>
    );
  };

  const renderPendingTag = () => {
    if (
      post.status !== ItemStatus.PENDING
    ) {
      return null;
    }

    return (
      <View style={styles.buttonPending}>
          {/* style={styles.buttonOffer} */}
        <Text >
          Pendiente
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image
          source={{ uri: itemImage }}
          style={styles.img}
        />
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.header}>
          <Text style={textStyles.pharagrah}>
            Has realizado una oferta a
          </Text>
          {/* style={textStyles.title_H2} */}
          <Text >
            {post.firstItem.user.userName ??
              'Anónimo'}
          </Text>
        </View>

        {post.options?.items?.length > 0 && (
          <View style={styles.imagesContainer}>
            {post.options.items.map(
              item => {
                const firstKey =
                  Object.keys(
                    item.images
                  )[0];

                return (
                  <Image
                    key={firstKey}
                    style={styles.imageItem}
                    resizeMode="contain"
                    source={{
                      uri: item.images[firstKey],
                    }}
                  />
                );
              }
            )}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {renderContactButton()}

        {renderPendingTag()}

        {/* {post.loading ? (
          <View style={styles.loading}>
            <AuthLoading />
          </View>
        ) : ( */}
        
        {post.status !== ItemStatus.COMPLETED &&(
          <TouchableOpacity
            style={styles.buttonReject}
            onPress={() =>
              updateStatus(
                post,
                ItemStatus.CANCELLED
              )
            }
          >
              {/* style={styles.buttonOffer} */}
            <Text >
              Cancelar
            </Text>
          </TouchableOpacity>
        )} 
          
        {/* )} */}
      </View>
    </View>
  );
};

export default OfferingOutItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  bodyContainer: {
    flex: 8,
    paddingLeft: 10,
  },

  buttonContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flex: 1,
    margin: 3,
  },

  imgContainer: {
    marginLeft: 8,
    width: 50,
    height: 50,
    borderRadius: 40,
    overflow: 'hidden',
  },

  img: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },

  imagesContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },

  imageItem: {
    width: 50,
    height: 50,
    backgroundColor: colors.GRAY,
    marginRight: 5,
  },

  buttonSearch: {
    ...buttonStyles.small,
    width: '100%',
    backgroundColor: colors.WHITE,
    borderColor: colors.GRAY,
    borderWidth: 1,
  },

  buttonPending: {
    ...buttonStyles.small,
    width: '100%',
    backgroundColor: colors.WHITE,
    borderColor: colors.GREEN,
    borderWidth: 1,
  },

  buttonReject: {
    ...buttonStyles.small,
    width: '100%',
    backgroundColor: colors.WHITE,
    borderColor: colors.RED,
    borderWidth: 1,
    marginTop: 5,
  },

  buttonOffer: {
    ...textStyles.buttonSmall,
    color: colors.BLACK,
  },

  loading: {
    backgroundColor: colors.WHITE,
    height: 40,
  },
});
import React, { FC, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { colors } from '../styles';
import { PostItem } from '../screens/HomeScreen';


interface GalleryImage {
  images: {
    uri: string;
  };
}

interface TouchableImageProps {
  item: PostItem;
  callback: (item: PostItem) => void;
  keepSelectable?: boolean;
}

const TouchableImage: FC<TouchableImageProps> = ({
  item,
  callback,
  keepSelectable = false,
}) => {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    callback(item);

    if (keepSelectable) {
      setSelected(prev => !prev);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.imageContainer,
        keepSelectable
          ? selected
            ? styles.selected
            : styles.unselected
          : undefined,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        style={styles.image}
        source={item.images}
        //source={{ uri: item.images.uri }}
        resizeMode="cover"
      />
      {item.status !== 'open' && <View style={styles.unavailableOverlay} />}
    </TouchableOpacity>
  );
};

interface ImageGalleryProps {
  data: PostItem[];
  callback: (item: GalleryImage) => void;
  keepSelectable?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

const ImageGallery: FC<ImageGalleryProps> = ({
  data,
  callback,
  keepSelectable = false,
  isRefreshing = false,
  onRefresh,
}) => {
  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableImage
          item={item}
          callback={callback}
          keepSelectable={keepSelectable}
        />
      )}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '32%',
    height: 100,
    margin: '0.5%',
  } as ViewStyle,

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.GRAY,
  },

  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.49)',
  },

  selected: {
    borderWidth: 3,
    padding: 3,
    borderColor: colors.RED,
  },

  unselected: {
    padding: 0,
  },
});

export default ImageGallery;

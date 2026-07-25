import React, { memo, useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../styles';
import * as MediaLibrary from 'expo-media-library';

// type GalleryItem = {
//   uri: string;
// };
// type GalleryItem = MediaLibrary.Asset;

export type GalleryItem = {
  id: string;
  uri: string;
};

type TouchableImageProps = {
  item: GalleryItem;
  callback?: (item: GalleryItem) => void;
  keepSelectable?: boolean;
  onSelectItem?: (item: GalleryItem) => void;
  onUnselectItem?: (item: GalleryItem) => void;
};

type ImageGalleryProps = {
  data: GalleryItem[];
  callback?: (item: GalleryItem) => void;
  singleSelect?: boolean;
  onSelectItem?: (item: GalleryItem) => void;
  onUnselectItem?: (item: GalleryItem) => void;
};

const TouchableImage = memo(
  ({
    item,
    callback,
    keepSelectable = true,
    onSelectItem,
    onUnselectItem,
  }: TouchableImageProps) => {
    const [selected, setSelected] = useState(false);

    const handlePress = useCallback(() => {
      callback?.(item);

      if (selected) {
        onUnselectItem?.(item);
      } else {
        onSelectItem?.(item);
      }

      if (keepSelectable) {
        setSelected(prev => !prev);
      }
    }, [
      callback,
      item,
      keepSelectable,
      onSelectItem,
      onUnselectItem,
      selected,
    ]);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[
          styles.imageContainer,
          keepSelectable &&
            (selected ? styles.selected : styles.unselected),
        ]}
      >
         <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }
);

const ImageGallery = ({
  data,
  callback,
  singleSelect = false,
  onSelectItem,
  onUnselectItem,
}: ImageGalleryProps) => {
  const renderItem: ListRenderItem<GalleryItem> = ({ item }) => (
    <TouchableImage
      item={item}
      callback={callback}
      keepSelectable={!singleSelect}
      onSelectItem={onSelectItem}
      onUnselectItem={onUnselectItem}
    />
  );

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        numColumns={4}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '23.8%',
    height: 100,
    margin: '0.5%',
  },

  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.GRAY,
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
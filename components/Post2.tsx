import React, { FC, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import { Entypo } from '@expo/vector-icons';

import {
  textStyles,
  globalStyles,
  colors,
} from '../styles';

import Rating from './Rating';
import ProductRow from './ProductRow';
import { itemTypes } from '../utils/constants';
import { PostItem } from '../screens/HomeScreen';

export interface Region {
  name: string;
}

export interface Commune {
  name: string;
}

interface Post2Props {
  post: PostItem;
}

const EMPTY_IMAGE =
  'https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg';

const parsePlaceToChange = (
  post: PostItem
): string => {
//   if (
//     post.communes &&
//     post.communes.length > 0
//   ) {
//     return post.communes
//       .map(commune => commune.name)
//       .join(', ');
//   }

//   if (
//     post.regions &&
//     post.regions.length > 0
//   ) {
//     return post.regions
//       .map(region => region.name)
//       .join(', ');
//   }

  return 'Todo el pais';
};

const Post2: FC<Post2Props> = ({ post }) => {
  
  const imageSource = useMemo(() => {
    const images = post?.images;
  
    // 1. empty
    if (!images) {
      return EMPTY_IMAGE;
    }
  
    // 2. local asset (require → number)
    if (typeof images === 'number') {
      return images;
    }
  
    // 3. string URL
    if (typeof images === 'string') {
      return { uri: images };
    }
  
    // 4. object with uri
    if (typeof images === 'object' && 'uri' in images && images.uri) {
      return { uri: images.uri };
    }
  
    // 5. object with dynamic keys
    if (typeof images === 'object') {
      const keys = Object.keys(images);
  
      if (keys.length > 0 && images[keys[0]]) {
        const value = images[keys[0]];
  
        if (typeof value === 'string') {
          return { uri: value };
        }
  
        return value; // already valid image source
      }
    }
  
    return EMPTY_IMAGE;
  }, [post?.images]);

  const locationText = useMemo(
    () =>
     post.placeToChange ?? 
      parsePlaceToChange(post)
      ,
    [post]
  );

  return (
    <View style={styles.container}>

      <View style={styles.imageContainer}>
        <View style={styles.imageContent}>
          <Image
            source={imageSource}
            style={[styles.image, { height: 250 }]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.lineNoPaddingVert}>
          <View style={styles.containerLeft}>
            <Text
              style={[
                // textStyles.title_H2,
                {
                  color: colors.BLACK_LIGHT,
                },
              ]}
            >
              <Entypo
                name="location-pin"
                size={16}
                color="red"
              />{' '}
              {locationText}
            </Text>
          </View>

          <View style={styles.containerRight}>
            <Rating rating={post.urgency} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(Post2);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
    height: '500%',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },

  headerContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    padding: 10,
    marginVertical: 10,
  },

  imageContainer: {
    alignItems: 'center',
    flex: 1,
  },

  modLine: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },

  line: {
    ...globalStyles.borders,
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },

  lineNoPaddingVert: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
  },

  imageContent: {
    backgroundColor: 'gray',
    flex: 5,
    width: '100%',
  },

  containerLeft: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  containerRight: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  text: {
    ...textStyles.title_H2,
    textAlign: 'center',
  },
});
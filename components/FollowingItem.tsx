import React, { FC, memo, useCallback } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    textStyles,
    globalStyles,
    colors,
    buttonStyles
  } from '../styles';
import { PostItem } from '../screens/HomeScreen';
import { RootStackParamList } from '../screens/MyPosts';

type Props = {
  post: PostItem;
  isOffertable: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList>;
  callback: () => void;
};

const FollowingItem: FC<Props> = ({
  post,
  isOffertable,
  navigation,
  callback,
}) => {

  const handlePress = useCallback(() => {
    navigation.navigate('SinglePost', {
      post,
      isOffertable,
      hideActions: true,
    });
  }, [navigation, post, isOffertable]);

  const images = Object.values(post.images ?? {});

  return (
    <View>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={handlePress}>
        <View style={styles.bodyContainer}>
          <View>
            <Text
              style={textStyles.pharagrah}
              numberOfLines={4}>
              Sigues la publicación de
            </Text>

            <Text
            //   style={textStyles.title_H2}
              numberOfLines={4}>
              {post.user.userName}
            </Text>
          </View>
        </View>

        <View style={styles.imagesContainer}>
          {images.length > 0 ? (
            images.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                style={styles.imageItem}
                resizeMode="contain"
                source={post.images}
                // source={{ post.images }}
              />
            ))
          ) : (
            <Image
              style={styles.imageItem}
              resizeMode="contain"
              source={require('../assets/tecnologia.png')}
            />
          )}
        </View>
      </TouchableOpacity>

      {isOffertable && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonSearch}
            onPress={callback}>
            <Text>Ofertar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(FollowingItem);

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      flex: 1,
      height: "20%",
      width: "100%",
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    touchableContainer: {
      flex: 4,
      flexDirection: 'row',
    },
    imagesContainer: {
      flexDirection: "column",
      flex: 1,
      height: "20%",
      width: "100%",
    },
    bodyContainer:{
      flex: 3,
    },
    buttonContainer:{
      flex:1,
      justifyContent: "center",
      alignItems: "center",
    },
    header:{
      flex: 1,
      margin: 3
    },
    imageItem:{
      width: 50,
      height: 50,
      backgroundColor: colors.GRAY
    },
    line: {
      flex: 1,
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
    },
    buttonSearch: {...buttonStyles.small,
      backgroundColor: colors.WHITE,
      borderColor: colors.GRAY,
      borderWidth: 1
    },
    buttonOffer: {...textStyles.buttonSmall,
      color:colors.BLACK,
    }
  
  });

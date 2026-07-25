import React, { FC, useMemo } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { globalStyles } from '../styles';

type RatingProps = {
  rating: number;
  maxSize?: number;
};

const filledIcon = require('../assets/icons/rayo.png')//require('../assets/icons/rayo.png');
const emptyIcon = require('../assets/icons/rayo_white.png');
// const filledIcon = require('../../assets/icons/rayo.png');
// const emptyIcon = require('../../assets/icons/rayo_white.png');

const Rating: FC<RatingProps> = ({ rating, maxSize = 5 }) => {
  const imageSources = useMemo<ImageSourcePropType[]>(() => {
    return Array.from({ length: maxSize }, (_, index) =>
      index < rating ? filledIcon : emptyIcon
    );
  }, [rating, maxSize]);

  

  return (
    <View style={styles.container}>
      {imageSources.map((source, index) => (
        <Image
          key={`rating-${index}`}
          source={source}
          resizeMode="contain"
          style={globalStyles.icon_normal}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Rating;
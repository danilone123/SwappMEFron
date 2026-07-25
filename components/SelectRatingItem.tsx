import React, { FC, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from '@react-native-vector-icons/material-design-icons';
//import { Icon } from 'react-native-vector-icons/MaterialCommunityIcons';

interface SelectRatingItemProps {
  rating: number;
  onRatingPressed: (rating: number) => void;
  maxRating?: number;
}

const SelectRatingItem: FC<SelectRatingItemProps> = ({
  rating,
  onRatingPressed,
  maxRating = 5,
}) => {
  const stars = useMemo(
    () =>
      Array.from({ length: maxRating }, (_, index) => ({
        filled: index < rating,
        value: index + 1,
      })),
    [rating, maxRating]
  );

  return (
    <View style={styles.container}>
      {stars.map(({ filled, value }) => (
        <TouchableOpacity
          key={value}
          onPress={() => onRatingPressed(value)}
          activeOpacity={0.7}
        >
          <Icon
            name={filled ? 'star' : 'star-outline'}
            size={32}
            color="#FFC107"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(SelectRatingItem);
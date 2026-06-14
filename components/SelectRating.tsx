import React, { FC, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';

import { globalStyles } from '../styles';

type Props = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

const filledIcon = require('../assets/icons/rayo.png')//require('../assets/icons/rayo.png');
const emptyIcon = require('../assets/icons/rayo_white.png');

const SelectRating: FC<Props> = ({
  value,
  onChange,
  max = 5,
}) => {
  const sources = useMemo(() => {
    const result: ImageSourcePropType[] = [];

    for (let i = 0; i < max; i++) {
      result.push(i < value ? filledIcon : emptyIcon);
    }

    return result;
  }, [value, max]);

  return (
    <View style={styles.container}>
      {sources.map((source, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onChange(index + 1)}
        >
          <Image
            resizeMode="contain"
            style={globalStyles.icon_normal}
            source={source}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectRating;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 0,
      padding : 0,
      width: "100%",
      height: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  });
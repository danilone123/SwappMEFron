import React, { useCallback } from 'react';
import {
  Share,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
//import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';

import { PostType } from './Post';

type Props = {
  item: PostType;
};

const ShareButton = ({ item }: Props) => {
  const onShare = useCallback(async () => {
    try {
      //const link = Linking.createURL(`item/${item.id}`);

      const parts: string[] = ['[Swapp]'];

      if (item.offer) parts.push(`Intercambio: ${item.offer}`);
      if (item.search) parts.push(`Busco: ${item.search}`);
      if (item.description) parts.push(item.description);

      parts.push(
        'Descarga la aplicación aquí https://play.google.com/store/apps/details?id=com.webin.swapp'
      );

      await Share.share({
        title: 'Swapp',
        message: parts.join('\n'),
        url: 'https://yourdomain.com/item/123',
      });
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    }
  }, [item]);

  return (
    <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
      <Feather name="share" size={25} color="gray" style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    padding: 5,
  },
});

export default ShareButton;
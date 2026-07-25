import React, { useState } from 'react';
import { View, Image, Button, Dimensions, StyleSheet } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

const { width: screenWidth } = Dimensions.get('window');

type Props = {
  uri: string;
  cropWidth: number;
  cropHeight: number;
  onCropped: (uri: string) => void;
};

export default function ExpoCropper({
  uri,
  cropWidth,
  cropHeight,
  onCropped,
}: Props) {
  const [loading, setLoading] = useState(false);

  const cropImage = async () => {
    setLoading(true);

    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: 0,
              originY: 0,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      onCropped(result.uri);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />

        {/* CROPPING OVERLAY */}
        <View style={[ styles.overlay, { width: cropWidth, height: cropHeight, left: (screenWidth - cropWidth) / 2, top: 0, }, ]} />
        
        </View>

      {/* <Button
        title={loading ? 'Cropping...' : 'Crop Image'}
        onPress={cropImage}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
      },

  imageWrapper: {
    width: '100%',
    height: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'red',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
// GalleryScreen.tsx

import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
  } from 'react';
  
  import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  
  import * as MediaLibrary from 'expo-media-library';
 
  //import ImageCropper from 'react-native-simple-image-cropper';
  // import { CropZoom } from 'react-native-zoom-toolkit';
  
  import { NativeStackScreenProps } from '@react-navigation/native-stack';
  //import { useDispatch } from 'react-redux';
  
  import ImageGallery, { GalleryItem } from '../components/ImageGallery';
  //import AppCamera from '../components/AppCamera';
  import LoadingIndicator from '../components/LoadingIndicator';
  //import GalleryItem from '../components/ImageGallery';
  
  
  import {
    buttonStyles,
    colors,
    globalStyles,
    textStyles,
  } from '../styles';
import ExpoCropper from '../components/ExpoCropper';
  
  const { width } = Dimensions.get('window');
  
  const CROP_AREA_WIDTH = width;
  const CROP_AREA_HEIGHT = width - width * 0.2;
  
  export type GalleryParamList = {
    Gallery: undefined;
    ImageCrop: {
      imageSelected: MediaLibrary.Asset | CapturedImage;
    };
    ItemForm: {
      imageUri: string;
      type?: string;
      fileName?: string;
    };
  };
  
  type Props = NativeStackScreenProps<GalleryParamList, 'Gallery'>;
  
  type CapturedImage = {
    uri: string;
  };
  
  type CropperParams = Record<string, unknown>;
  
  const GalleryScreen: React.FC<Props> = ({ navigation }) => {
    //const dispatch = useDispatch();
  
    const [gallerySelected, setGallerySelected] = useState(true);
    const [data, setData] = useState<MediaLibrary.Asset[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
  
    const [imageSelected, setImageSelected] = useState<
      MediaLibrary.Asset | CapturedImage | null
    >(null);
  
    const [cropperParams, setCropperParams] =
      useState<CropperParams>({});
  
    const requestPermissions = useCallback(async () => {
      const { status } =
        await MediaLibrary.requestPermissionsAsync();
  
      if (status !== 'granted') {
        console.warn('Access to photos denied');
        return;
      }
  
      const media = await MediaLibrary.getAssetsAsync({
        first: 200,
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: [MediaLibrary.SortBy.default],
      });

      const enriched = await Promise.all(
        media.assets.map(async (asset) => {
          const info = await MediaLibrary.getAssetInfoAsync(asset);
          return {
            ...asset,
            id: info.id,
            uri: info.localUri ?? asset.uri,
          };
        })
      );
  
      setData(enriched);
  
      if (enriched.length > 0) {
        setImageSelected(enriched[0]);
      }
    }, []);
  
    useEffect(() => {
        requestPermissions();
    }, [requestPermissions]);
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerButtonContainer}>
            {isProcessing ? (
              <LoadingIndicator />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (!imageSelected) return;
  
                  //navigation.navigate('ItemForm');
                  navigation.navigate('ItemForm', {
                    imageUri: imageSelected.uri,
                  });
                }}
              >
                <Text style={textStyles.link}>Siguiente</Text>
              </TouchableOpacity>
            )}
          </View>
        ),
      });
    }, [navigation, imageSelected, isProcessing]);
  
    const handleCropperParams = useCallback(
      (params: CropperParams) => {
        setCropperParams(params);
      },
      [],
    );
  
    return (
      <View style={styles.container}>
        {gallerySelected ? (
          <View style={styles.galleryTabContainer}>
            <View style={styles.imageSelectedContainer}>
              {!imageSelected ? (
                <Text style={styles.emptyText}>
                  Seleccione Imagen
                </Text>
              ) : (
                <ExpoCropper
                  uri={imageSelected.uri}
                  cropWidth={CROP_AREA_WIDTH}
                  cropHeight={CROP_AREA_HEIGHT}
                  onCropped={(uri) => {
                    console.log('Cropped:', uri);
                    setImageSelected({ uri });
                 }}
                />
              )}
            </View>
  
            <View style={styles.galleryContainer}>
              <ImageGallery
                data={data}
                singleSelect
                callback={(item: GalleryItem) =>
                  setImageSelected(item)
                }
              />
            </View>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            {/* <AppCamera
              onPictureTook={(photo: CapturedImage) =>
                setImageSelected(photo)
              }
              onConfigurePicture={() =>
                setGallerySelected(true)
              }
            /> */}
          </View>
        )}
  
        <View style={styles.footerContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGallerySelected(true)}
            >
              <Text
                style={
                  gallerySelected
                    ? styles.linkOff
                    : styles.linkOn
                }
              >
                Gallery
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => setGallerySelected(false)}
            >
              <Text
                style={
                  gallerySelected
                    ? styles.linkOn
                    : styles.linkOff
                }
              >
                Foto
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  export default GalleryScreen;
  
  const styles = StyleSheet.create({
    container: {
      ...globalStyles.container,
      padding: 0,
      margin: 0,
    },
  
    galleryTabContainer: {
      flex: 10,
      width: '100%',
    },
  
    imageSelectedContainer: {
      width: '100%',
      height: CROP_AREA_HEIGHT,
      justifyContent: 'center',
      backgroundColor: 'blue'
    },
  
    galleryContainer: {
      flex: 5,
      width: '100%',
    },
  
    cameraContainer: {
      flex: 10,
      width: '100%',
      height: '100%',
    },
  
    footerContainer: {
      flex: 1,
    },
  
    buttonContainer: {
      ...globalStyles.containerHorizontal,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  
    button: {
      ...buttonStyles.link,
      flex: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    headerButtonContainer: {
      paddingRight: 20,
    },
  
    linkOn: {
      ...textStyles.link,
    },
  
    linkOff: {
      ...textStyles.link,
      color: colors.GRAY,
    },
  
    emptyText: {
      textAlign: 'center',
    },
  });
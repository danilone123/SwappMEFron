import React, {
    FC,
    useCallback,
    useLayoutEffect,
    useState,
    useEffect
  } from 'react';
  
  import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
  } from 'react-native';
  
  import {
    RouteProp,
    useNavigation,
    useRoute,
  } from '@react-navigation/native';
  
//   import {
//     useDispatch,
//     useSelector,
//   } from 'react-redux';
  
  import {
    buttonStyles,
    colors,
    globalStyles,
    textStyles,
  } from '../styles';
  
  import {
    itemTypes,
  } from '../utils/constants';
  
  import {
    executeValidations,
    compressImage
  } from '../utils/Utils';
  
  import {
    useCategories,
    Category,
  } from '../hooks/categoriesHook';
  
  import LoadingIndicator from '../components/LoadingIndicator';
  import ConditionsModal from '../components/ConditionsModal';
  import CategoryAutocompleteContainer from '../components/CategoryAutocompleteContainer';
  import SelectRating from '../components/SelectRating';
  //import AuthLoading from '../screens/AuthLoading';
  import { NativeStackScreenProps } from '@react-navigation/native-stack';
  import { createNewItem, useUploadImage } from '../hooks/createItemHook';


    type RootStackParamList = {
        ItemForm: {
        imageUri: string;
        };
    };

    type Props = NativeStackScreenProps<RootStackParamList, 'ItemForm'>;
    
    export type ValidationType = {
        valid: boolean;
        description: string;
    };
    
    const ItemForm = ({route}: Props) => {
        const navigation = useNavigation<any>();
        const {imageUri} = route.params;
        const itemMutation = createNewItem();
        const userImageUpload = useUploadImage();
  
    //const route = useRoute<ItemFormRouteProp>();
    useEffect(() => {
        console.log('imageUri:', imageUri);
      }, [imageUri]);
    // REACT QUERY
  
    const {
      data: categories = [],
      isLoading: categoriesLoading,
    } = useCategories();
  
    // LOCAL STATE
  
    const [validations, setValidations] =
      useState<
        Record<string, ValidationType>
      >({});
  
    const [showAutocomplete, setShowAutocomplete] =
      useState(false);
  
    const [autocompleteType, setAutocompleteType] =
      useState('');
  
    const [offer, setOffer] =
      useState('');
  
    const [search, setSearch] =
      useState('');
  
    const [description, setDescription] =
      useState('');
  
    const [urgency, setUrgency] =
      useState(0);
  
    const [offerCategory, setOfferCategory] =
      useState<Category | null>(null);
  
    const [searchCategory, setSearchCategory] =
      useState<Category | null>(null);
  
    const [acrossCountry, setAcrossCountry] =
      useState(true);
  
    const [displaySearchSection] =
      useState(true);
  
    const [showConditions, setShowConditions] =
      useState(false);
  
    const [isCreatingItem, setIsCreatingItem] =
      useState(false);
  
    // HEADER
  
    // VALIDATIONS
  
    const openConditions =
      useCallback(() => {
        const validationMap = {
          idOffer: [
            {
              value:
                offerCategory?.name,
              type: 'empty',
              description:
                'Este campo es necesario',
            },
          ],
          idSearch: [
            {
              value:
                searchCategory?.name,
              type: 'empty',
              description:
                'Este campo es necesario',
            },
          ],
  
          search: [
            {
              value: search,
              type: 'empty',
              description:
                'Este campo es necesario',
            },
          ],
  
          offer: [
            {
              value: offer,
              type: 'empty',
              description:
                'Este campo es necesario',
            },
          ],
  
          description: [
            {
              value: description,
              type: 'empty',
              description:
                'Este campo es necesario',
            },
          ],
        };
  
        const results =
          executeValidations(
            validationMap
          );
  
        setValidations(results);
  
        if (
          Object.keys(results)
            .length > 0
        ) {
          return;
        }
  
        setShowConditions(true);
      }, [
        offer,
        search,
        description,
        offerCategory,
        searchCategory,
      ]);

      useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <View
              style={[
                styles.button,
                {
                  paddingRight: 20,
                },
              ]}
            >
              {
              isCreatingItem ? (
                <LoadingIndicator />
              ) : (
                <TouchableOpacity
                  onPress={
                    openConditions
                  }
                >
                  <Text
                    style={
                      textStyles.link
                    }
                  >
                    Compartir
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ),
        });
      }, [
        navigation,
        //network.loading,
        isCreatingItem,
        openConditions
      ]);
  
    // SUBMIT
  
    const submit = async () => {
      
    if (isCreatingItem) {
      return;
    }
  
    setShowConditions(false);
    setIsCreatingItem(true);

    try {
        const response = await itemMutation.mutateAsync({
          description,
      
          type: displaySearchSection
            ? itemTypes.OFFERS
            : itemTypes.DONATION,
      
          title: offer,
      
          urgency,
      
          products: [
            {
              title: offer,
              type: 'offer',
              lastCategory: {
                id: offerCategory?.id,
              },
            },
            {
              title: search,
              type: 'search',
              lastCategory: {
                id: searchCategory?.id,
              },
            },
          ],
      
          regions: [],
          communes: [],
        });

        console.log('item created item_id:', response.item_id);

        const compressed = await compressImage(imageUri);
        console.log('compressed image :::::::!', compressed)
        const imageResponse = await userImageUpload.mutateAsync({
          itemId: response.item_id,
          image: {
            uri: compressed.uri,
            type: 'image/jpeg',
            name: 'image',
          }
        });

        if (imageResponse !== undefined && imageResponse.status === 200) {
          console.log('successfully image uploaded!')
        } else {
          console.log('la imagen no pudo ser creada en el servidor')
        }
        console.log('image response value:::::::', imageResponse);

      } catch (error) {
        console.log("error when creating item::::::", error);
      } finally {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home',
            },
          ],
        });
        setIsCreatingItem(false);
      }
    };
  
    // AUTOCOMPLETE
  
    const onClickInput = (
      type: string
    ) => {
      setShowAutocomplete(true);
      setAutocompleteType(type);
    };
  
    const onCancelAutocomplete =
      () => {
        setShowAutocomplete(false);
      };
  
    const onSetAutocomplete = (
      item: Category,
      type: string
    ) => {
      console.log("type is:::", type);
      
      if (
        type === itemTypes.OFFERS
      ) {
        console.log("category name is::::", item.name)
        setOfferCategory(item);
      }
  
      if (
        type ===
        itemTypes.SEARCHING
      ) {
        console.log("category name is::::", item.name)
        setSearchCategory(item);
      }
    };
  
    // ERRORS
  
    const renderValidationError =
      (key: string) => {
        const validation =
          validations[key];
  
        if (!validation) {
          return null;
        }
  
        if (!validation.valid) {
          return (
            <View
              style={
                styles.errorContainer
              }
            >
              <Text
                style={
                  styles.errorText
                }
              >
                {
                  validation.description
                }
              </Text>
            </View>
          );
        }
  
        return null;
      };
  
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={
          false
        }
      >
        <ConditionsModal
          visible={showConditions}
          onCancel={() =>
            setShowConditions(false)
          }
          onAccept={submit}
        />
  
        <CategoryAutocompleteContainer
          type={autocompleteType}
          visible={
            showAutocomplete &&
            !categoriesLoading
          }
          options={categories}
          onCancel={
            onCancelAutocomplete
          }
          textSelected={
            onSetAutocomplete
          }
        />
  
      {isCreatingItem && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
        
          <View
            style={
              styles.formContainer
            }
          >
            <View
              style={
                styles.imageDescLine
              }
            >

                
              <Image
                source={{
                  uri: imageUri,
                }}
                style={
                  styles.pictureImage
                }
                onLoad={() => console.log('IMAGE LOADED')}
                onError={(e) => console.log('IMAGE ERROR', e.nativeEvent)}
              />
  
              <View
                style={
                  styles.descriptionInput
                }
              >
                <TextInput
                  multiline
                  value={description}
                  onChangeText={
                    setDescription
                  }
                  style={
                    textStyles.input
                  }
                  placeholder="Escribe una descripción"
                  placeholderTextColor={
                    colors.INPUT_TEXT
                  }
                />
              </View>
            </View>
  
            {renderValidationError(
              'description'
            )}
  
            <View style={styles.line}>
              <View
                style={
                  styles.buttonOffer
                }
              >
                <Text style={{ color: 'red' }}>

                
                  Ofrezco
                </Text>
              </View>
            </View>
  
            <TextInput
              value={offer}
              onChangeText={setOffer}
              style={textStyles.input}
              placeholder="¿Que Ofreces?"
            />
  
            {renderValidationError(
              'offer'
            )}
  
            <TextInput
              value={
                offerCategory?.name ??
                ''
              }
              style={textStyles.input}
              placeholder="Pertenece a categoría"
              onTouchStart={() =>
                onClickInput(
                  itemTypes.OFFERS
                )
              }
            />
  
            {renderValidationError(
              'idOffer'
            )}
  
            {displaySearchSection && (
              <>
                <View
                  style={
                    styles.line
                  }
                >
                  <View
                    style={
                      styles.buttonSearch
                    }
                  >
                    <Text
                    //   style={
                    //     textStyles.buttonSmall
                    //   }
                    >
                      Busco
                    </Text>
                  </View>
                </View>
  
                <TextInput
                  value={search}
                  onChangeText={
                    setSearch
                  }
                  style={
                    textStyles.input
                  }
                  placeholder="¿Que buscas?"
                />
  
                {renderValidationError(
                  'search'
                )}
  
                <TextInput
                  value={
                    searchCategory?.name ??
                    ''
                  }
                  style={
                    textStyles.input
                  }
                  placeholder="Pertenece a categoría"
                  onTouchStart={() =>
                    onClickInput(
                      itemTypes.SEARCHING
                    )
                  }
                />
  
                {renderValidationError(
                  'idSearch'
                )}
              </>
            )}
  
            <View style={styles.line}>
              <Text
                style={
                  styles.urgencyLabel
                }
              >
                Nivel de Urgencia
              </Text>
  
              <View
                style={
                  styles.ratingContainer
                }
              >
                <SelectRating
                  value={urgency}
                  onChange={
                    setUrgency
                  }
                />
              </View>
            </View>
  
            <View style={styles.line}>
              <Text
                style={
                  styles.urgencyLabel
                }
              >
                ¿Intercambios en todo
                el pais?
              </Text>
  
              <Switch
                value={acrossCountry}
                onValueChange={
                  setAcrossCountry
                }
              />
            </View>
          </View>
        
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
  
    formContainer: {
      marginTop: 10,
      marginHorizontal: 10,
    },
  
    line: {
      ...globalStyles.containerHorizontal,
  
      marginVertical: 5,
  
      alignItems: 'center',
    },
  
    imageDescLine: {
      ...globalStyles.containerHorizontal,
  
      marginBottom: 10,
    },
  
    urgencyLabel: {
      ...textStyles.label,
  
      flex: 2,
  
      marginHorizontal: 10,
    },
  
    ratingContainer: {
      flex: 3,
    },
  
    pictureImage: {

      width: 150,
      height: 150,
    },
  
    descriptionInput: {
      ...globalStyles.pharagraphInput,
  
      flex: 7,
  
      borderWidth: 0,
  
      height: '100%',
    },
  
    buttonOffer: {
    //   ...buttonStyles.small,
  
      backgroundColor:
        colors.PURPLE,
  
      marginRight: 8,
    },
  
    buttonSearch: {
    //   ...buttonStyles.small,
  
      backgroundColor:
        colors.BLUE_LIGHT,
  
      marginRight: 8,
    },
  
    errorContainer: {
      paddingLeft: 10,
  
      marginBottom: 8,
    },
  
    errorText: {
      fontSize: 12,
  
      color: 'red',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    button: {
      ...buttonStyles.link,
  
      justifyContent:
        'center',
  
      alignItems: 'center',
    },
  });
  
  export default ItemForm;
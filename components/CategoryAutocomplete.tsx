import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';

import AutocompleteListItem from './AutocompleteListItem';
import {
    Category,
  } from '../hooks/categoriesHook';

// export type CategoryOption = {
//   id: number | string;
//   name: string;
//   subCategories?: CategoryOption[];
// };

type Props = {
  options: Category[];
  type: string;
  onSelect: (item: Category, type: string) => void;
  onCancel?: () => void;
  navigation?: any;
};

const CategoryAutocomplete: React.FC<Props> = ({
  options,
  type,
  onSelect,
  onCancel,
  navigation,
}) => {
  const [input, setInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Category[]>([]);
  const [showFiltered, setShowFiltered] = useState(false);

  const sourceOptions = options ?? [];

  const onChangeInputText = (text: string) => {
    setInput(text);

    if (!text.trim()) {
      setFilteredOptions([]);
      setShowFiltered(false);
      return;
    }

    const filtered = sourceOptions.filter((option) =>
      option.name.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredOptions(filtered);
    setShowFiltered(true);
  };

  const handleClick = (item: Category) => {
    console.log("categoryAutocomplete::::::::category name:::", item.name);
   // if (!item.subCategories || item.subCategories.length === 0) {
      setInput('');
      setFilteredOptions([]);
      setShowFiltered(false);

      onSelect(item, type);
      onCancel?.();

      return;
    //}

    // navigate deeper if subcategories exist
    // navigation?.push?.('Autocomplete', {
    //   options: item.subCategories,
    //   type,
    // });
  };

  const dataToRender = useMemo(() => {
    if (showFiltered) return filteredOptions;
    return sourceOptions;
  }, [showFiltered, filteredOptions, sourceOptions]);

  return (
    <View style={styles.screen}>
      <View style={styles.searchBox}>
        <TextInput
          value={input}
          placeholder="Ingresa al menos una letra"
          style={styles.searchText}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeInputText}
        />
      </View>

      <View style={styles.itemsContainer}>
        {dataToRender.length === 0 ? (
          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyText}>No hay opciones</Text>
          </View>
        ) : (
          <FlatList
            keyboardShouldPersistTaps= "always"
            data={dataToRender}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <AutocompleteListItem
                item={item}
                onClick={handleClick}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default CategoryAutocomplete;

const styles = StyleSheet.create({
  screen: {
    height: '95%',
    width: '100%',
    paddingTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  itemsContainer: {
    width: '95%',
    flex: 1,
    marginLeft: 5,
  },
  searchBox: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  searchText: {
    fontSize: 18,
  },
  emptyText: {
    fontSize: 18,
  },
  emptyTextContainer: {
    paddingTop: 15,
    paddingLeft: 10,
  },
});
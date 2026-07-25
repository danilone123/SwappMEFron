import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  
  // TouchableOpacity,
} from 'react-native';

import { TouchableOpacity, GestureHandlerRootView } from 'react-native-gesture-handler';

import {
    Category,
  } from '../hooks/categoriesHook';

// export type AutocompleteItem = {
//   id: number | string;
//   name: string;
// };

type Props = {
  item: Category;
  onClick: (item: Category) => void;
  selectedItems?: Category[] | null;
};

const AutocompleteListItem: React.FC<Props> = ({
  item,
  onClick,
  selectedItems,
}) => {
  const isSelected =
    selectedItems?.some(
      (selected) => selected.name === item.name
    ) ?? false;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <TouchableOpacity
      onPress={() => onClick(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.listItem,
          isSelected && styles.listSelectedItem,
        ]}
      >
        <Text style={styles.textList}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

export default AutocompleteListItem;

const styles = StyleSheet.create({
  listItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  listSelectedItem: {
    backgroundColor: 'gray',
  },

  textList: {
    fontSize: 18,
  },
});
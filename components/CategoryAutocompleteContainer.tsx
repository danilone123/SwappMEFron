import React, { FC } from 'react';
import {
  Modal,
  View,
  Button,
  Text,
  StyleSheet,
} from 'react-native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import CategoryAutocomplete from './CategoryAutocomplete';
import {
    Category,
  } from '../hooks/categoriesHook';

const Stack = createNativeStackNavigator();

// export type CategoryOption = {
//   id: string | number;
//   name: string;
//   subCategories?: CategoryOption[];
// };

export type Props = {
  visible: boolean;
  onCancel: () => void;
  options: Category[];
  type: string;
  textSelected: (
    item: Category,
    type: string
  ) => void;
};

const HeaderLeft = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  return (
    <Button
      title="Atrás"
      onPress={onCancel}
      color="black"
    />
  );
};

const CategoryAutocompleteContainer: FC<Props> = ({
  visible,
  onCancel,
  options,
  type,
  textSelected,
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <Stack.Navigator
        screenOptions={{
          presentation: 'modal',
          headerTitle: 'Categorias',
          headerLeft: () => (
            <HeaderLeft onCancel={onCancel} />
          ),
        }}
      >
        <Stack.Screen name="Autocomplete">
          {(props) => (
            <CategoryAutocomplete
              {...props}
              options={options}
              type={type}
              onSelect={textSelected}
              onCancel={onCancel}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </Modal>
  );
};

export default CategoryAutocompleteContainer;
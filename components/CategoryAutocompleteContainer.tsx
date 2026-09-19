import React, { FC } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryAutocomplete from './CategoryAutocomplete';
import {
    Category,
  } from '../hooks/categoriesHook';

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

const CategoryAutocompleteContainer: FC<Props> = ({
  visible,
  onCancel,
  options,
  type,
  textSelected,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPressIn={onCancel}
            onPress={onCancel}
            android_ripple={{ color: '#D6D6D6' }}
          >
            <Text style={styles.backButtonText}>Atrás</Text>
          </Pressable>
          <Text style={styles.title}>Categorias</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <CategoryAutocomplete
            options={options}
            type={type}
            onSelect={textSelected}
            onCancel={onCancel}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CategoryAutocompleteContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    elevation: 1,
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 108,
  },
  content: {
    flex: 1,
  },
  backButton: {
    minWidth: 108,
    minHeight: 44,
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});

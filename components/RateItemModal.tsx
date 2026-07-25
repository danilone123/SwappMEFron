import React, { FC, useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import SelectRatingItem from './SelectRatingItem';
import { colors, textStyles } from '../styles';

interface RateItemModalProps {
  visible: boolean;
  onCancel: () => void;
  onAccept: (rating: number) => void;
}

const RateItemModal: FC<RateItemModalProps> = ({
  visible,
  onCancel,
  onAccept,
}) => {
  const [rating, setRating] = useState<number>(0);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleAccept = useCallback(() => {
    onAccept(rating);
  }, [onAccept, rating]);

  return (
    <Modal
      style={styles.modal}
      isVisible={visible}
      onBackdropPress={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.titleContainer}>
          {/* style={textStyles.title_H2} */}
            <Text >Calificación</Text>
          </View>

          <SelectRatingItem
            rating={rating}
            onRatingPressed={setRating}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCancel}
          >
            <Text style={textStyles.link_H1}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleAccept}
          >
            <Text style={textStyles.link_H1}>Calificar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 30,
  },
  container: {
    backgroundColor: colors.WHITE,
  },
  body: {
    width: '100%',
    padding: 20,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    padding: 15,
    marginHorizontal: 3,
  },
});

export default React.memo(RateItemModal);
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

import { colors, textStyles } from '../styles';

interface AnnouncementModalProps {
  visible: boolean;
  message: string;
  title?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  visible,
  message,
  title = 'Atención',
  onClose,
  onSuccess,
}) => {
  const handleAccept = () => {
      console.log("class announcementModal:::: handleAccept", onSuccess)
    onClose();          // Close the modal
    onSuccess?.();      // Execute callback if provided
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleAccept}
      onBackButtonPress={handleAccept}
      useNativeDriver
    >
      <View style={styles.container}>
      {/* style={styles.title} */}
        <Text >{title}</Text>

        <Text style={styles.message}>
          {message}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAccept}
        >
          <Text style={styles.buttonText}>
            Aceptar
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AnnouncementModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 24,
  },
  title: {
    ...textStyles.title_H2,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

import { colors, textStyles } from '../styles';

type OfferCommentProps = {
  visible: boolean;
  onCancel: () => void;
  onAccept: (message: string) => void;
};

const OfferComment: React.FC<OfferCommentProps> = ({
  visible,
  onCancel,
  onAccept,
}) => {
  const [message, setMessage] = useState<string>('');

  const handleCancel = () => {
    setMessage('');
    onCancel();
  };

  const handleAccept = () => {
    onAccept(message);
    setMessage('');
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleCancel}
      style={styles.modalStyle}
      useNativeDriver
    >
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <View style={styles.title}>
              {/* style={textStyles.title_H2} */}
            <Text >Comentar</Text>
          </View>

          <TextInput
            style={textStyles.input}
            placeholder="Escribe un comentario si deseas"
            autoCapitalize="none"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            <Text style={textStyles.link_H1}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAccept}>
            <Text style={textStyles.link_H1}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalStyle: {
      flex: 1,
      margin: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    container: {
      margin: 20,
      backgroundColor: colors.WHITE,
      borderRadius: 10,
      overflow: 'hidden',
    },
    bodyContainer: {
      justifyContent: 'center',
      flexDirection: 'column',
      width: '100%',
      padding: 20,
    },
    title: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
    },
    button: {
      padding: 15,
      marginHorizontal: 3,
    },
  });

export default OfferComment;
import React, { FC } from 'react';
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import HTML from 'react-native-render-html';
import { colors } from '../styles';
import { useWindowDimensions } from 'react-native';

type ConditionsModalProps = {
  visible: boolean;
  onCancel: () => void;
  onAccept: (message?: string) => void;
  termsAndConditions?: boolean;
};

const conditionsHtmlContent = `
        <html>        
        <body>
          <div style="margin: 12px;" > 
            <h3>Hola! Te recordamos que tu publicación no puede contener artículos relacionados con lo siguiente:</h3>
          </div>
          <div style="margin: 12px;">
            <ul style="">
              <li>Productos o servicios ilegales</li>
              <li>Drogas (ya sean recetadas, recreativas o de otro tipo)</li>
              <li>Productos de tabaco o artículos relacionados</li>
              <li>Alcohol</li>
              <li>Suplementos alimentarios no seguros</li>
              <li>Armas, municiones o explosivos</li>
              <li>Animales</li>
              <li>Productos o servicios para adultos</li>
              <li>Fluidos y partes del cuerpo</li>
              <li>Productos médicos y de salud</li>
              <li>Artículos o productos que muestren posturas sexuales explícitas</li>
              <li>Servicios de apuestas con dinero real</li>
              <li>Servicios de citas</li>
              <li>Productos o artículos que faciliten o motiven el acceso no autorizado a medios digitales</li>
              <li>Servicios digitales y de suscripción, incluidos enlaces a ventas, renovaciones o actualizaciones de una suscripción o su procesamiento</li>
              <li>Modelos comerciales, productos, artículos o servicios que determinemos que son o pueden ser fraudulentos, engañosos u ofensivos, que son o pueden ser explotadores o inapropiados o que ejerzan o puedan ejercer una presión indebida en grupos objetivo</li>
              <li>Moneda real, virtual o falsa</li>
              <li>Infracción de derechos de terceros</li>      
            </ul>
          </div>
        </body>
        </html>

`;

const termsHtmlContent = `
        <html>        
        <body>
          <div style="margin: 12px; color : blue" > 
            <h2>Política de intercambio SWAPP</h2>
          </div>
          <div>
            <ol style="text-align: justify; text-justify: inter-word;">
              <li>Cuando ofreces productos y/o servicios para el intercambio, se consideran que todos los mensajes, archivos multimedia relacionados con estos productos y/o servicios constituyen una transacción. Todas las transacciones deben cumplir las políticas descritas a continuación.</li>
              <li>Tu eres el único responsable de tus transacciones y de coordinar las condiciones del intercambio con otros usuarios.</li>
              <li>Todos los artículos o servicios que intercambies a través de la aplicación deben ser reales, válidos y deben estar disponibles para su intercambio.</li>
              <li>No es nuestra responsabilidad procesar, ni concretar los intercambios realizados entre usuarios.</li>
              <li>Tu eres el único responsable de todas las obligaciones, tarifas y cargos adicionales que puede generar un intercambio.</li>
              <li>Los usuarios de SWAPP aceptan que podrán ejecutarse conversaciones a través de su WhatsApp o por medio de llamadas para finalizar y coordinar los intercambios, una vez aceptadas las ofertas realizadas y/o recibidas</li>              
              <li>Debes tratar a todos los usuarios de modo amable y cordial, se prohíben tratos despectivos, que inciten al odio o promuevan la discriminación.</li>                
            </ol>
          </div>

          <div style="margin-left: 12px">
            <h3>Se prohíbe intercambiar lo siguiente:</h3>
            <div>
              <div>
                <span><b>a. Productos o servicios ilegales</b></span>
                <p>Política: Se prohíbe que los usuarios realicen transacciones (intercambios) relacionados con productos o servicios ilegales.</p>
              </div>

              <div>
                <b>b. Drogas (ya sean recetadas, recreativas o de otro tipo)</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones (intercambios) relacionados con drogas recetadas, recreativas o ilegales.</p>
              </div>
              
              <div>
                <b>c. Productos de tabaco o artículos relacionados</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones (intercambios) relacionados con tabaco y artículos relacionados</p>
              </div>

              <div>
                <b>d. Alcohol</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas al intercambio de alcohol.</p>
              </div>

              <div>
                <b>e. Suplementos alimentarios no seguros</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio de suplementos alimentarios no seguros.</p>
              </div>

              <div>
                <b>f. Armas, municiones o explosivos</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio o el uso de armas, municiones o explosivos.</p>
              </div>

              <div>
                <b>g. Animales</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio de animales.</p>
              </div>

              <div>
                <b>h. Productos o servicios para adultos</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio o el uso de productos o servicios para adultos.</p>
              </div>

              <div>
                <b>i. Fluidos y partes del cuerpo</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio de fluidos o partes del cuerpo humano.</p>
              </div>

              <div>
                <b>j. Productos médicos y de salud</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con ciertos productos de salud, incluidos dispositivos médicos y productos para dejar de fumar que contengan nicotina.</p>
              </div>

              <div>
                <b>k. Artículos o productos que muestren posturas sexuales explícitas</b>
                <p>Política: Se prohíbe que los usuarios exhiban productos o servicios de un modo sexualmente sugerente.</p>
              </div>

              <div>
                <b>l. Servicios de apuestas con dinero real</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con apuestas, juegos de habilidad o loterías, incluidos casinos online, apuestas deportivas, bingo o póquer (si se apuesta dinero), o bien faciliten estos servicios.</p>
              </div>

              <div>
                <b>m. Servicios de citas</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con servicios de citas en línea o faciliten dichos servicios.</p>
              </div>

              <div>
                <b>n. Productos o artículos que faciliten o motiven el acceso no autorizado a medios digitales</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio de dispositivos que faciliten o fomenten la transmisión de contenido digital sin autorización o de un modo que interfiera con la funcionalidad de los dispositivos electrónicos.</p>
              </div>

              <div>
                <b>o. Servicios digitales y de suscripción, incluidos enlaces a ventas, renovaciones o actualizaciones de una suscripción o su procesamiento</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio (incluidas renovaciones y actualizaciones, etc.) de contenido, suscripciones o cuentas digitales.</p>
              </div>

              <div>
                <b>p. Modelos comerciales, productos, artículos o servicios que determinemos que son o pueden ser fraudulentos, engañosos u ofensivos, que son o pueden ser explotadores o inapropiados o que ejerzan o puedan ejercer una presión indebida en grupos objetivo</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con ofertas o productos engañosos, falsos u ofensivos.</p>
              </div>              
            
              <div>
                <b>q. Moneda real, virtual o falsa</b>
                <p>Política: Se prohíbe que los usuarios realicen transacciones relacionadas con el intercambio de moneda real, virtual o falsa.</p>
              </div>
            
              <div>
                <b>r. Infracción de derechos de terceros</b>
                <p>Política: Las transacciones no pueden incluir contenido que infrinja o vulnere los derechos de propiedad intelectual de terceros, incluidos los derechos de autor o las marcas comerciales. Esto incluye, entre otras cosas, el intercambio de productos falsificados, como artículos de imitación que lleven el nombre o logotipo de una marca o incluyan características distintivas de los productos de otra empresa con el fin de imitar un producto genuino.</p>
              </div>              
            </div>
          </div>

        </body>
        </html>
`;

const ConditionsModal: FC<ConditionsModalProps> = ({
  visible,
  onCancel,
  onAccept,
  termsAndConditions,
}) => {
  const { width } = useWindowDimensions();

  const htmlContent =
    termsAndConditions
      ? termsHtmlContent
      : conditionsHtmlContent;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.container}>
        <ScrollView>
          <HTML
            contentWidth={width}
            source={{ html: htmlContent }}
          />
        </ScrollView>
      </View>

      <View style={styles.buttonsContainer}>
        {termsAndConditions ? (
          <TouchableOpacity
            style={styles.buttonAccept}
            onPress={() => onAccept()}
          >
            <Text style={styles.acceptText}>
              Entendido
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonAccept}
              onPress={() => onAccept()}
            >
              <Text style={styles.acceptText}>
                Aceptar
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

export default ConditionsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  buttonAccept: {
    backgroundColor: colors.BLUE,
    padding: 12,
    borderRadius: 10,
    width: '40%',
    margin: 10,
    alignItems: 'center',
  },

  buttonCancel: {
    borderWidth: 1,
    borderColor: colors.BLUE,
    padding: 12,
    borderRadius: 10,
    width: '40%',
    margin: 10,
    alignItems: 'center',
  },

  acceptText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  cancelText: {
    color: colors.BLUE,
    fontWeight: '600',
    fontSize: 16,
  },
});
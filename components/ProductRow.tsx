import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { textStyles, colors, globalStyles } from '../styles';

type ProductRowProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color?: StyleProp<TextStyle>;
  type: string;
  title: string;
};

const ProductRow: React.FC<ProductRowProps> = ({
  icon,
  color,
  type,
  title,
}) => {
  return (
    <View style={[styles.line, styles.modLine]}>
      <View style={styles.containerLeft}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={typeof color === 'string' ? color : '#000'}/>

        <Text style={[ textStyles.title_H2 as TextStyle, {color: colors.BLUE, fontSize: 17, paddingBottom : 3}]}> 
            {type + ": "}
          </Text>
      <Text style={ [ textStyles.title_H2 as TextStyle, {color: colors.BLUE, fontSize: 17, paddingBottom : 3}] }>
            {title}
      </Text>       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent:"flex-start",
    alignItems: "center",
    flex: 1,
    height: "500%",
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: 10,
  },
  separatorContainer: {flex:0.1},
  headerContainer: {
    flex:3,
    justifyContent:"flex-start",
    width: '100%',
    padding : 10,
    marginBottom : 10,    
  },
  iconHeader : {    
    fontSize: 20, 
    paddingEnd : 5, 
    paddingBottom: 5
  },  

  modLine: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  line: { ... globalStyles.borders,
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  lineNoPaddingVert: { ... globalStyles.borders,
    flex: 0.7,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingVertical: 0,
    padding : 10,
    marginBottom : 10,
    marginTop : 10,
  },
    
  containerLeft: {
    width: "100%",
    height: "100%",
    flex: 5,
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems: "center",
  },
  containerRight: {
    width: "100%",
    height: "100%",
    flex: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },  
//     text: {
//     ...textStyles.title_H2,
//     textAlign: 'center',
//   },
});

export default ProductRow;
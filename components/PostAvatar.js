import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native'
import { fontSizes } from '../styles';

const PostAvatar = ({ name }) => (
    <View style={ styles.padding } >
      <View style={ styles.row }>
        <Image style={styles.avatar} source={ require("../assets/icono-mi-perfil.png") } />      
        <Text style={ styles.text } >{name}</Text>
      </View>    
    </View>  
  );
  
  const padding = 12;
  const profileImageSize = 34;
  const styles = StyleSheet.create({
    text: { 
        fontWeight: "bold",
        fontSize: 18 
    },  
    row: {
      flexDirection: "row",    
      alignItems: "center"
    },
    padding: {
      padding,
      paddingStart : 8
    },
    avatar: {
      aspectRatio: 1,
      backgroundColor: "#D8D8D8",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "#979797",
      borderRadius: profileImageSize / 2,
      width: profileImageSize,
      height: profileImageSize,
      resizeMode: "cover",
      marginRight: padding
    }
  });

  export default PostAvatar;
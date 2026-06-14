import React from 'react'
import {View, StyleSheet, ActivityIndicator, StatusBar} from 'react-native'
import {globalStyles,colors} from '../styles'

const LoadingIndicator = props => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={props.size ==null? 'small': props.size} color={colors.BLUE} />
      <StatusBar barStyle="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent: 'center',
  },
});

export default LoadingIndicator;
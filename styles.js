import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
// COLOR
export const colors = {
  PRIMARY: '#005D64',
  SECONDARY: '#CA3F27',
  INPUT_TEXT: '#8b8b8b',
  INPUT_BACK: '#E6E6E6',
  MAIN: '#29ABE2',
  SCREEN_BACK: '#FFF',
  HIGHLIGHT_TEXT: '#8b8b8b',
  BLACK_LIGHT: '#8b8b8b',
  GRAY: '#E6E6E6',
  GRAY_LIGHT: '#F8F8F8',
  BLACK: '#000',
  BLUE: '#00B6FF',
  BLUE_LIGHT: '#652FE8',
  RED: '#FF5700',
  WHITE: '#FFF',
  GREEN: '#8CC63F',
  PURPLE: '#4D1162'
}
// TYPOGRAPHY
const scalingFactors = {
  small: 40,
  normal: 30,
  middle: 25,
  big: 20,
}
const extraConstants = {
  BUTTON_BORDER_RADIOUS: 10,
  BUTTON_BORDER_RADIOUS_SMALL: 5,
  INPUT_BORDER_RADIOUS: 10,
  INPUT_BORDER_RADIOUS_SMALL: 5,
}

export const iconSizes = {
  small: (width / scalingFactors.small) * 1.3,
  normal: (width / scalingFactors.normal) * 1.3,
  middle: (width / scalingFactors.middle) * 1.3,
  big: (width / scalingFactors.big) * 1.3,
}

export const fontSizes = {
  H1: {
    fontSize: width / scalingFactors.big,
    lineHeight: (width / scalingFactors.big) * 1.3,
  },
  H2: {
    fontSize: width / scalingFactors.normal,
    lineHeight: (width / scalingFactors.normal) * 1.3,
  },
  NORMAL: {
    fontSize: width / scalingFactors.normal,
    lineHeight: (width / scalingFactors.normal) * 1.3,
  },
  MIDDLE: {
    fontSize: width / scalingFactors.middle,
    lineHeight: (width / scalingFactors.middle) * 1.3,
  },
  P: {
    fontSize: width / scalingFactors.normal,
    lineHeight: (width / scalingFactors.normal) * 1.3,
  },
  SMALL: {
    fontSize: width / scalingFactors.small,
  },
}

export const textStyles = {
  link : { ... fontSizes.middle,
    color: '#29ABE2'
  },
  link_H1 : { ... fontSizes.MIDDLE,
    color: '#29ABE2'
  },
  buttonBig : { ... fontSizes.NORMAL,
    color: colors.SCREEN_BACK,
    fontWeight: 'bold',
  },
  buttonSmall : { ... fontSizes.NORMAL,
    color: colors.SCREEN_BACK,
    fontWeight: 'bold',
  },
  title : { ... fontSizes.H1,
    color: colors.PRIMARY,
    fontWeight: 'bold',
  },
  title_H2 : { ... fontSizes.MIDDLE,
    color: colors.INPUT_TEXT,
    fontWeight: 'bold',
  },
  label_normal : { ... fontSizes.NORMAL,
    color: colors.INPUT_TEXT,
  },
  label : { ... fontSizes.MIDDLE,
    color: colors.INPUT_TEXT,
  },
  highlight : { ... fontSizes.MIDDLE,
    color: colors.INPUT_TEXT,
    padding: 5,
    fontWeight: 'bold',
  },
  input : { ... fontSizes.MIDDLE,
    color: '#8b8b8b'
  },
  pharagrah : { ... fontSizes.MIDDLE,
    color: '#8b8b8b'
  },
  categoriesCenterImage: {... fontSizes.H1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  categoriesSubtitle: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold'
  },
  categoriesTitle: {fontSize: 24,
    color: 'black',
    fontWeight: 'bold'
  }

}

export const buttonStyles = {
  big: {
    width:"80%",
    backgroundColor:colors.BLUE,
    borderRadius:extraConstants.BUTTON_BORDER_RADIOUS,
    height:50,
    width: (width * 0.5),
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  small: {
    backgroundColor:colors.BLUE,
    borderRadius:extraConstants.BUTTON_BORDER_RADIOUS_SMALL,
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  link: {
    height:50,
  },
  bordered: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems:"center",
    borderColor:colors.BLUE,
    borderRadius:extraConstants.BUTTON_BORDER_RADIOUS,
  },
  buttonCommune: {
    width:"100%",
    backgroundColor:colors.MAIN,
    borderRadius:25,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    paddingHorizontal: 10
  }
}

// GLOBAL STYLES
export const globalStyles = {
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.WHITE ,
    alignItems: "center",
  },
  input:{
    width:"100%",
    backgroundColor:colors.INPUT_BACK,
    borderRadius:extraConstants.INPUT_BORDER_RADIOUS,
    height:40,
    // marginBottom:20,
    justifyContent:"center",
    padding:10,
    paddingLeft: 20
  },
  smallInput:{
    width:"100%",
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius:extraConstants.INPUT_BORDER_RADIOUS_SMALL,
    height:25,
    justifyContent:"center",
    padding:3,
    paddingHorizontal:10,
  },
  multivalueText:{
    width:"100%",
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius:extraConstants.INPUT_BORDER_RADIOUS_SMALL,
    height:35,
    justifyContent:"center",
    padding:3,
    paddingHorizontal:10,
  },
  pharagraphInput: {
    borderWidth: 1,
    borderColor: colors.GRAY,
    borderRadius:extraConstants.INPUT_BORDER_RADIOUS_SMALL,
    justifyContent:"flex-start",
    padding:5,
    paddingHorizontal:10,
  },
  borders: {
    padding: 3,
    margin: 3,
  },
  containerHorizontal: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  icon_normal: {
    maxHeight: iconSizes.normal,
    height: iconSizes.normal,
    width: iconSizes.normal,
    maxWidth: iconSizes.normal,
  },
  icon_text: {
    maxHeight: iconSizes.normal,
    height: iconSizes.normal,
    width: iconSizes.normal,
    maxWidth: iconSizes.normal,
    marginRight: 8,
  },
  separator: {
    borderBottomWidth: 3,
    borderBottomColor: colors.GRAY,
    width: '100%'
  },
}
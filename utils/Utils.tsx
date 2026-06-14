import {ValidationType} from '../screens/ItemFormScreen'
import * as ImageManipulator from "expo-image-manipulator";

export function validateEmptyField(text: string) {
    if (text === undefined) {
      return false;
    }
  
    if (text !== null && text.length > 0) {
          return true;
      } else {
            //invalid field
        return false;
    }
  }
  
  export function validateEmail(text: string) {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        return false;
      } else {
        return true;
      }
  }
  
  export function validateRegex(text: string, regex?: RegExp) {
      if (regex?.test(text) === false) {
        return false;
      } else {
        return true;
      }
  }

  type ValidationRule = {
    type: 'regex' | 'empty' | 'compare' | 'checkbox';
    value: any;
    description: string;
    regex?: RegExp;
    otherComponent?: any;
  };
  
  export function executeValidations(validations: any) {
    //var resultDictionary = [];
    const resultDictionary: Record<string, ValidationType> = {};
    for (var key in validations) {
      var element = validations[key];
      element.map((o: ValidationRule) => {
        if (o.type === 'regex') {
          let valid = validateRegex(o.value, o.regex);
          if (valid === false) {
            resultDictionary[key] = {valid: false , description: o.description};
            return
          }
        } else if (o.type === 'empty') {
          let valid = validateEmptyField(o.value);
          if(valid === false) {
            resultDictionary[key] = {valid: false , description: o.description};
            return
          }
        } else if (o.type === 'compare') {
          if (o.value !== o.otherComponent) {
            resultDictionary[key] = {valid: false , description: o.description};
            return
          }
        } else if (o.type === 'checkbox') {
          if (o.value === false) {
            resultDictionary[key] = {valid: false , description: o.description};
          }
        }
      });
    }
    return resultDictionary;
  } 


  // export const compressImage = async (uri: string) => {
  //   const result = await ImageResizer.createResizedImage(
  //     uri,
  //     1000,      // max width
  //     1000,      // max height
  //     "JPEG",
  //     70         // quality (0–100)
  //   );
  
  //   return result;
  // };


type CompressOptions = {
  width?: number;
  compress?: number;
  format?: ImageManipulator.SaveFormat;
};

export const compressImage = async (
  uri: string,
  options: CompressOptions = {}
) => {
  const {
    width = 512,
    compress = 0.8,
    format = ImageManipulator.SaveFormat.JPEG,
  } = options;

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [
      {
        resize: {
          width,
        },
      },
    ],
    {
      compress,
      format,
      base64: false,
    }
  );

  return {
    uri: result.uri,
    width: result.width,
    height: result.height,
  };
};
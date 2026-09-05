import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Android 8+ requires a channel before notifications can be displayed with
  // predictable importance. This is a no-op on iOS.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  let isGranted = currentPermissions.granted;

  // A denied permission can only be requested again while the OS permits it.
  if (!isGranted && currentPermissions.canAskAgain) {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    isGranted = requestedPermissions.granted;
  }

  // The user declined notifications, or the OS no longer permits another prompt.
  if (!isGranted) {
    console.log('Push notification permission was not granted');
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error('EAS projectId not found');
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token.data;
};

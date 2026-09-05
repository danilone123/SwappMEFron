import type { NavigationContainerRef, ParamListBase } from '@react-navigation/native';

export type NotificationDestination =
  | { name: 'home' }
  | { name: 'replyQuestions' }
  | { name: 'descriptionQuestion'; post: unknown };

/**
 * Converts untrusted push data into one of the few destinations the app supports.
 * Keeping this function free of React/Expo APIs makes the routing contract easy to
 * unit test and prevents arbitrary backend-provided route names from being used.
 */
export function getNotificationDestination(data: unknown): NotificationDestination {
  if (!data || typeof data !== 'object') {
    return { name: 'home' };
  }

  const payload = data as Record<string, unknown>;

  switch (payload.type) {
    case 'replyQuestionsScreen':
      return { name: 'replyQuestions' };

    case 'descriptionScreen':
      // The current DescriptionQuestionScreen renders a PostItem synchronously.
      // Do not navigate to it without that required data.
      if (payload.post && typeof payload.post === 'object') {
        return { name: 'descriptionQuestion', post: payload.post };
      }
      return { name: 'home' };

    case 'homeScreen':
    default:
      return { name: 'home' };
  }
}

export function navigateFromNotification(
  navigation: NavigationContainerRef<ParamListBase>,
  data: unknown,
) {
  const destination = getNotificationDestination(data);

  switch (destination.name) {
    case 'replyQuestions':
      navigation.navigate('Portal', {
        screen: 'Portal',
        params: { initialTab: 'questions' },
      });
      return;

    case 'descriptionQuestion':
      navigation.navigate('Home', {
        screen: 'DescriptionQuestion',
        params: { post: destination.post },
      });
      return;

    case 'home':
      navigation.navigate('Home', { screen: 'Dashboard' });
  }
}

import type { NavigationContainerRef, ParamListBase } from '@react-navigation/native';

export type NotificationDestination =
  | { name: 'home' }
  | { name: 'replyQuestions' }
  | { name: 'descriptionQuestion'; post?: unknown; itemId: string }
  | { name: 'offersReceived' }
  | { name: 'offersMadeReceived' }

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
    case 'offersReceivedScreen':
      return { name: 'offersReceived' };

    case 'offersMadeScreen':
      return {name: 'offersMadeReceived'}

    case 'replyQuestionsScreen':
      return { name: 'replyQuestions' };

    case 'descriptionScreen':
      // Preserve the legacy payload while routing it through Dashboard, which
      // can use its existing feed data or let the screen fetch the item.
      if (
        payload.post &&
        typeof payload.post === 'object' &&
        typeof (payload.post as Record<string, unknown>).id === 'string'
      ) {
        return {
          name: 'descriptionQuestion',
          post: payload.post,
          itemId: (payload.post as Record<string, string>).id,
        };
      }
      return { name: 'home' };

    case 'descriptionQuestionScreen': {
      const resource = payload.resource;
      const itemId =
        typeof payload.itemID === 'string'
          ? payload.itemID
          : resource && typeof resource === 'object'
          ? (resource as Record<string, unknown>).itemID
          : undefined;

      if (typeof itemId === 'string' && itemId.length > 0) {
        return { name: 'descriptionQuestion', itemId };
      }

      return { name: 'home' };
    }

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
        // A tab can remain mounted after it is first visited. Supply a new
        // token for every notification tap so the Questions screen knows to
        // fetch current data instead of showing its previous result.
        params: { initialTab: 'questions', notificationRefreshKey: Date.now() },
      });
      return;

    case 'descriptionQuestion':
      // Dashboard resolves this item against its loaded home feed before it
      // opens the question screen. This also keeps the tab transition visible.
      navigation.navigate('Home', {
        screen: 'Dashboard',
        params: {
          itemId: destination.itemId,
        },
      });
      return;

    case 'home':
      navigation.navigate('Home', { screen: 'Dashboard' });

    case 'offersReceived':
      navigation.navigate('Portal', {
        screen: 'Portal',
        params: { initialTab: 'offers_in', notificationRefreshKey: Date.now() },
      });
      return;

    case 'offersMadeReceived':
      navigation.navigate('Portal', {
        screen: 'Portal',
        params: { initialTab: 'offers_out', notificationRefreshKey: Date.now() },
      });
      return;
  }
}

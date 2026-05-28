import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationStatus = 'SAFE' | 'WARNING' | 'CRITICAL';

const CHANNEL_ID = 'quby-alerts';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications() {
  if (!Device.isDevice) {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Quby Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 300, 150, 300],
      sound: 'default',
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  const finalPermissions = currentPermissions.granted
    ? currentPermissions
    : await Notifications.requestPermissionsAsync();

  return finalPermissions.granted;
}

export async function notifyForStatus(
  status: NotificationStatus,
  alerts: string[],
) {
  const hasPermission = await setupNotifications();

  if (!hasPermission) {
    return;
  }

  const contentByStatus = {
    SAFE: {
      title: 'Quby: Air quality normal',
      body: 'Your room is back in a safe range.',
    },
    WARNING: {
      title: 'Quby: Safe warning',
      body: alerts[0] ?? 'Air quality is outside the selected profile range.',
    },
    CRITICAL: {
      title: 'Quby: Critical alert',
      body: alerts[0] ?? 'Air quality is critical. Ventilate immediately.',
    },
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      ...contentByStatus[status],
      sound: 'default',
      priority:
        status === 'CRITICAL'
          ? Notifications.AndroidNotificationPriority.MAX
          : Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null,
  });
}

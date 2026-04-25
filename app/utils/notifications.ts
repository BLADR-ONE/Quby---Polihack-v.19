import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let lastCo2NotificationTime = 0;

// Handler doar pe telefon, nu pe web
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () =>
      ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      } as any),
  });
}

export async function requestNotificationPermission() {
  // Pentru web/browser
  if (Platform.OS === 'web') {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    return;
  }

  // Pentru telefon
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    console.log('Notification permission not granted');
  }
}

export async function notifyHighCo2(co2: number) {
  // Trimitem notificare doar daca CO2 trece de 1000 ppm
  if (co2 <= 1000) {
    return;
  }

  const now = Date.now();

  // Nu trimite notificari foarte des
  // Maxim o notificare la 5 minute
  if (now - lastCo2NotificationTime < 5 * 60 * 1000) {
    return;
  }

  lastCo2NotificationTime = now;

  // Varianta pentru web/browser
  if (Platform.OS === 'web') {
    if ('Notification' in window) {
      let permission = Notification.permission;

      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      if (permission === 'granted') {
        new Notification('Quby air alert', {
          body: `CO₂ is ${co2} ppm. Open the window.`,
        });
      } else {
        alert(`CO₂ is ${co2} ppm. Open the window.`);
      }
    } else {
      alert(`CO₂ is ${co2} ppm. Open the window.`);
    }

    return;
  }

  // Varianta pentru telefon
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Quby air alert',
      body: `CO₂ is ${co2} ppm. Open the window.`,
    },
    trigger: null,
  });
}
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { QubyProvider } from '../context/QubyContext';

export default function RootLayout() {
  return (
    <QubyProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="auto" />
    </QubyProvider>
  );
}
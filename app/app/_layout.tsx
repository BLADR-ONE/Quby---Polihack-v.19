import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { QubyProvider } from '@/context/QubyContext';

export default function RootLayout() {
  return (
    <QubyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="dark" />
    </QubyProvider>
  );
}

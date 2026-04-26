import { StyleSheet, Text, View } from 'react-native';

import { useQuby } from '@/context/QubyContext';

export default function SettingsScreen() {
  const { activeProfileData, bluetoothState, historyMode } = useQuby();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Simple preferences for the current demo.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Active profile</Text>
        <Text style={styles.value}>{activeProfileData.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Connection source</Text>
        <Text style={styles.value}>{bluetoothState}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>History storage</Text>
        <Text style={styles.value}>{historyMode}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tracked sensors</Text>
        <Text style={styles.value}>Temperature, humidity, CO2, fumes, smoke</Text>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>What comes next</Text>
        <Text style={styles.noteBody}>
          - Premium Features {"\n"}
          - Home Assistant Integration {"\n"}
          - Bluetooth phone Connection {"\n"}
          - Database data collection {"\n"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ecfeff',
    padding: 20,
    paddingTop: 56,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    color: '#1d4ed8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  label: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  noteCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 24,
    padding: 18,
    marginTop: 4,
  },
  noteTitle: {
    color: '#1d4ed8',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  noteBody: {
    color: '#1e3a8a',
    fontSize: 14,
    lineHeight: 20,
  },
});

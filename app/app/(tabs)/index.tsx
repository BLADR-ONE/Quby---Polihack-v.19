import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useQuby } from '@/context/QubyContext';

export default function HomeScreen() {
  const { activeProfileData, alerts, reading, recommendation, status } =
    useQuby();

  const logoSource =
    status === 'SAFE'
      ? require('@/assets/images/logo.png')
      : status === 'WARNING'
        ? require('@/assets/images/logo2.png')
        : require('@/assets/images/logo3.png');

  const statusStyles =
    status === 'SAFE'
      ? { card: styles.safeCard, text: styles.safeText }
      : status === 'WARNING'
        ? { card: styles.warningCard, text: styles.warningText }
        : { card: styles.criticalCard, text: styles.criticalText };

  const sensors = [
    { label: 'Temperature', value: `${reading.temperature}°C`, hint: 'Indoor comfort' },
    { label: 'Humidity', value: `${reading.humidity}%`, hint: 'Air moisture' },
    { label: 'CO2', value: `${reading.co2} ppm`, hint: `Limit ${activeProfileData.co2Max}` },
    { label: 'Fumes', value: `${reading.fumes} ppm`, hint: `Limit ${activeProfileData.fumesMax}` },
    { label: 'Smoke', value: `${reading.smoke} ppm`, hint: `Limit ${activeProfileData.smokeMax}` },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>Your everyday companionr</Text>
          <Text style={styles.title}>Quby</Text>
          <Text style={styles.subtitle}>
            Docked at Home,
            {"\n"}ready Everywhere.
          </Text>
        </View>

        <Image resizeMode="contain" source={logoSource} style={styles.heroLogo} />
      </View>

      <View style={[styles.statusCard, statusStyles.card]}>
        <Text style={styles.statusLabel}>Current air status</Text>
        <Text style={[styles.statusValue, statusStyles.text]}>{status}</Text>
        <Text style={styles.statusBody}>{recommendation}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Active profile</Text>
        <View style={styles.profileRow}>
          <Text style={styles.profileIcon}>{activeProfileData.icon}</Text>
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{activeProfileData.name}</Text>
            <Text style={styles.cardBody}>{activeProfileData.description}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Live sensor data</Text>
      <View style={styles.grid}>
        {sensors.map((sensor) => (
          <View key={sensor.label} style={styles.sensorCard}>
            <Text style={styles.sensorLabel}>{sensor.label}</Text>
            <Text style={styles.sensorValue}>{sensor.value}</Text>
            <Text style={styles.sensorHint}>{sensor.hint}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Alerts</Text>
        {alerts.length === 0 ? (
          <Text style={styles.cardBody}>No profile alerts right now.</Text>
        ) : (
          alerts.map((alert) => (
            <Text key={alert} style={styles.alertText}>
              • {alert}
            </Text>
          ))
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Recommendations</Text>
        <Text style={styles.cardBody}>
          Quby checks temperature, humidity, CO2, fumes, and smoke, then adapts
          the result to the selected profile.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ecfeff',
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: '#81d8d0',
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
  },
  heroCopy: {
    maxWidth: '70%',
  },
  eyebrow: {
    color: '#0c6170',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0c6170',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: '#00000',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    // paddingRight: 2,
  },
  heroLogo: {
    position: 'absolute',
    right: 6,
    bottom: 8,
    width: 130,
    height: 130,
  },
  statusCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  safeCard: {
    backgroundColor: '#dcfce7',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  criticalCard: {
    backgroundColor: '#fee2e2',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  statusValue: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 8,
    borderColor: '#C0C0C0',
  },
  safeText: {
    color: '#15803d',
  },
  warningText: {
    color: '#d97706',
  },
  criticalText: {
    color: '#dc2626',
  },
  statusBody: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderColor: '#C0C0C0',
    borderWidth: 2,

  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardBody: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,

  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileIcon: {
    fontSize: 34,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sensorCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  sensorLabel: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  sensorValue: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },
  sensorHint: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 8,
  },
  alertText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
});

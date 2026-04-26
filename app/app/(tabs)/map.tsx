import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MAP_POINTS } from '@/data/mock';

export default function MapScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Map</Text>
      <Text style={styles.subtitle}>
        Mock places from Cluj-Napoca where Quby checked the air.
      </Text>

      <View style={styles.mapCard}>
        <View style={styles.mapCanvas}>
          <View style={styles.river} />
          <View style={styles.routeOne} />
          <View style={styles.routeTwo} />
          {MAP_POINTS.map((point) => (
            <View
              key={point.name}
              style={[
                styles.pin,
                { top: point.top, left: point.left, backgroundColor: point.color },
              ]}
            >
              <Text style={styles.pinText}>{point.icon}</Text>
            </View>
          ))}
        </View>
      </View>

      {MAP_POINTS.map((point) => (
        <View key={point.name} style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationName}>{point.name}</Text>
            <Text style={styles.locationTime}>{point.time}</Text>
          </View>
          <Text style={[styles.locationStatus, { color: point.color }]}>
            {point.status}
          </Text>
          <Text style={styles.locationInfo}>
            Temp {point.temperature}°C • Humidity {point.humidity}% • CO2 {point.co2}
          </Text>
        </View>
      ))}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Next step</Text>
        <Text style={styles.noteBody}>
          Later this tab can save real GPS positions together with sensor
          readings from the phone and ESP32.
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
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    color: '#3f6212',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
  },
  mapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 14,
    marginBottom: 16,

  },
  mapCanvas: {
    height: 270,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    overflow: 'hidden',
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  river: {
    position: 'absolute',
    width: 360,
    height: 50,
    backgroundColor: '#bae6fd',
    top: 110,
    left: -40,
    transform: [{ rotate: '-12deg' }],
  },
  routeOne: {
    position: 'absolute',
    width: 180,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#84cc16',
    top: 70,
    left: 40,
    transform: [{ rotate: '18deg' }],
  },
  routeTwo: {
    position: 'absolute',
    width: 160,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#84cc16',
    top: 168,
    left: 94,
    transform: [{ rotate: '-16deg' }],
  },
  pin: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  pinText: {
    fontSize: 22,
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  locationName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
  locationTime: {
    color: '#64748b',
    fontSize: 12,
  },
  locationStatus: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  locationInfo: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#fef9c3',
    borderRadius: 24,
    padding: 18,
    marginTop: 4,
  },
  noteTitle: {
    color: '#854d0e',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  noteBody: {
    color: '#854d0e',
    fontSize: 14,
    lineHeight: 20,
  },
});

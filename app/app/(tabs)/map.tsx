import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const locations = [
  {
    name: 'Home',
    status: 'Good air quality',
    time: 'Today, 10:30',
    temperature: '23°C',
    humidity: '48%',
    co2: '820 ppm',
  },
  {
    name: 'Park Walk',
    status: 'Fresh outdoor air',
    time: 'Today, 12:10',
    temperature: '21°C',
    humidity: '52%',
    co2: '610 ppm',
  },
  {
    name: 'Near Road',
    status: 'Smoke/fumes warning',
    time: 'Today, 13:25',
    temperature: '24°C',
    humidity: '45%',
    co2: '980 ppm',
  },
];

export default function MapScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quby Map</Text>
      <Text style={styles.subtitle}>
        See the places where Quby checked the air quality.
      </Text>

      <View style={styles.mapCard}>
        <View style={styles.mapBackground}>
          <View style={[styles.pin, styles.pinOne]}>
            <Text style={styles.pinText}>🏠</Text>
          </View>

          <View style={[styles.pin, styles.pinTwo]}>
            <Text style={styles.pinText}>🌳</Text>
          </View>

          <View style={[styles.pin, styles.pinThree]}>
            <Text style={styles.pinText}>🚗</Text>
          </View>

          <View style={styles.routeLineOne} />
          <View style={styles.routeLineTwo} />
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Tracked route</Text>
        <Text style={styles.infoText}>
          This map shows where Quby was used and what air quality was detected in each place.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Visited places</Text>

      {locations.map((location) => (
        <View key={location.name} style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationTime}>{location.time}</Text>
          </View>

          <Text style={styles.locationStatus}>{location.status}</Text>

          <View style={styles.sensorRow}>
            <Text style={styles.sensorText}>Temp: {location.temperature}</Text>
            <Text style={styles.sensorText}>Humidity: {location.humidity}</Text>
          </View>

          <Text style={styles.sensorText}>CO₂: {location.co2}</Text>
        </View>
      ))}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Next step</Text>
        <Text style={styles.noteText}>
          Later, this page can use real GPS locations from the phone and save them together with the sensor readings.
        </Text>
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0F0',
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 30,
    color: '#1E293B',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 21,
  },

  mapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    marginBottom: 16,
  },

  mapBackground: {
    height: 260,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
  },

  pin: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#2563EB',
    zIndex: 2,
  },

  pinText: {
    fontSize: 22,
  },

  pinOne: {
    top: 45,
    left: 35,
  },

  pinTwo: {
    top: 130,
    left: 145,
  },

  pinThree: {
    top: 70,
    right: 35,
    borderColor: '#DC2626',
  },

  routeLineOne: {
    position: 'absolute',
    width: 135,
    height: 5,
    backgroundColor: '#60A5FA',
    top: 110,
    left: 70,
    transform: [{ rotate: '35deg' }],
    borderRadius: 999,
  },

  routeLineTwo: {
    position: 'absolute',
    width: 120,
    height: 5,
    backgroundColor: '#60A5FA',
    top: 120,
    right: 60,
    transform: [{ rotate: '-25deg' }],
    borderRadius: 999,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },

  locationCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },

  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },

  locationName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  locationTime: {
    fontSize: 12,
    color: '#64748B',
  },

  locationStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 10,
  },

  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },

  sensorText: {
    fontSize: 13,
    color: '#475569',
  },

  noteCard: {
    backgroundColor: '#EFF6FF',
    padding: 18,
    borderRadius: 18,
    marginTop: 4,
  },

  noteTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 6,
  },

  noteText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
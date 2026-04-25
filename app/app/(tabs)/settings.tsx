import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useQuby } from '../../context/QubyContext';

export default function SettingsScreen() {
  const { activeProfileData } = useQuby();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Manage Quby preferences.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Active Profile</Text>
        <Text style={styles.value}>{activeProfileData.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Monitoring Mode</Text>
        <Text style={styles.value}>Indoor Air Quality</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sensors</Text>
        <Text style={styles.value}>Temperature, Humidity, CO₂, Particles</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Anonymous Data Sharing</Text>
        <Text style={styles.value}>Off</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Clear History</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Firebase history and real ESP32 sensor readings will be added after the basic interface is working.
      </Text>
    </View>
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
    fontWeight: '800',
    marginTop: 30,
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  note: {
    marginTop: 18,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },
});
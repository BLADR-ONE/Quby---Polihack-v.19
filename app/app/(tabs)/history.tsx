import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>Saved air quality readings and alerts.</Text>

      <View style={styles.historyCard}>
        <Text style={styles.time}>Today, 10:42</Text>
        <Text style={styles.eventTitle}>Humidity warning</Text>
        <Text style={styles.eventText}>
          Humidity was too high for Baby Mode. Ventilation was recommended.
        </Text>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.time}>Today, 10:30</Text>
        <Text style={styles.eventTitle}>Air quality normal</Text>
        <Text style={styles.eventText}>
          Temperature, humidity and air quality were within comfort limits.
        </Text>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.time}>Yesterday, 21:15</Text>
        <Text style={styles.eventTitle}>VOC level increased</Text>
        <Text style={styles.eventText}>
          Air quality dropped. The room needed fresh air.
        </Text>
      </View>

      <Text style={styles.note}>
        Later, this data will come from Firebase.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F8FB',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 30,
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
  },
  time: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 5,
  },
  eventText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  note: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 10,
    lineHeight: 19,
  },
});
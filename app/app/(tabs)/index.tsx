import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useQuby } from '../../context/QubyContext';

export default function DashboardScreen() {
  const {
    activeProfileData,
    reading,
    status,
    alerts,
    recommendation,
  } = useQuby();

  const statusCardStyle =
    status === 'SAFE'
      ? styles.safeCard
      : status === 'WARNING'
        ? styles.warningCard
        : styles.criticalCard;

  const statusTextStyle =
    status === 'SAFE'
      ? styles.safeText
      : status === 'WARNING'
        ? styles.warningText
        : styles.criticalText;

  return (
    <View style={styles.screen}>
      <View style={styles.fixedHero}>
        <Image
          source={require('../../assets/images/logowide.png')}
          style={styles.heroLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentPanel}>
          <View style={styles.heroTextBox}>
            <Text style={styles.heroTitle}>Quby Home</Text>
            <Text style={styles.heroSubtitle}>Indoor air quality checker</Text>
          </View>

          <View style={[styles.statusCard, statusCardStyle]}>
            <Text style={styles.statusLabel}>Air Status</Text>
            <Text style={[styles.statusText, statusTextStyle]}>{status}</Text>
            <Text style={styles.statusMessage}>{recommendation}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Active Profile</Text>
            <Text style={styles.infoText}>{activeProfileData.name}</Text>
          </View>

          <Text style={styles.sectionTitle}>Live Sensor Data</Text>

          <View style={styles.grid}>
            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>Temperature</Text>
              <Text style={styles.sensorValue}>{reading.temperature}°C</Text>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>Humidity</Text>
              <Text style={styles.sensorValue}>{reading.humidity}%</Text>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>CO₂</Text>
              <Text style={styles.sensorValue}>{reading.co2} ppm</Text>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>PM2.5</Text>
              <Text style={styles.sensorValue}>{reading.pm25} µg/m³</Text>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>PM10</Text>
              <Text style={styles.sensorValue}>{reading.pm10} µg/m³</Text>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>Particles</Text>
              <Text style={styles.sensorValue}>{reading.particlesStatus}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Alerts</Text>

            {alerts.length === 0 ? (
              <Text style={styles.infoText}>No alerts for this profile.</Text>
            ) : (
              alerts.map((alert, index) => (
                <Text key={index} style={styles.alertText}>
                  • {alert}
                </Text>
              ))
            )}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What Quby checks</Text>
            <Text style={styles.infoText}>
              Quby monitors temperature, humidity, CO₂ and particle levels, then adapts alerts based on the selected profile.
            </Text>
          </View>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },

  fixedHero: {
    position: 'absolute',
    top: 25,
    left: 20,
    right: 20,
    height: 170,
    backgroundColor: '#CFFAFE',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },

  heroLogo: {
    width: '100%',
    height: '100%',
  },

  scroll: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'transparent',
  },

  scrollContent: {
    paddingTop: 220,
  },

  contentPanel: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    minHeight: 850,
  },

  heroTextBox: {
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
  },

  heroSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },

  statusCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },

  safeCard: {
    backgroundColor: '#DCFCE7',
  },

  warningCard: {
    backgroundColor: '#FEF3C7',
  },

  criticalCard: {
    backgroundColor: '#FEE2E2',
  },

  statusLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },

  statusText: {
    fontSize: 34,
    fontWeight: '900',
    marginVertical: 5,
  },

  safeText: {
    color: '#15803D',
  },

  warningText: {
    color: '#D97706',
  },

  criticalText: {
    color: '#DC2626',
  },

  statusMessage: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  sensorCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },

  sensorTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },

  sensorValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },

  alertText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 5,
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
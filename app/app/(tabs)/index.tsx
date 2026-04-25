import React, { useEffect } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useQuby } from '../../context/QubyContext';

import {
  notifyHighCo2,
  requestNotificationPermission,
} from '../../utils/notifications';

export default function DashboardScreen() {
  const {
    activeProfileData,
    reading,
    status,
    alerts,
    recommendation,
  } = useQuby();

  const isCo2High = reading.co2 > 1000;

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    notifyHighCo2(reading.co2);
  }, [reading.co2]);

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
          source={require('../../assets/images/logo.png')}
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

            <View style={styles.profileRow}>
              <Text style={styles.profileIcon}>{activeProfileData.icon}</Text>

              <View style={styles.profileTextBox}>
                <Text style={styles.profileName}>{activeProfileData.name}</Text>
                <Text style={styles.infoText}>
                  {activeProfileData.description}
                </Text>
              </View>
            </View>
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

            <View style={isCo2High ? styles.co2AlertCard : styles.sensorCard}>
              <Text style={styles.sensorTitle}>CO₂</Text>

              <Text style={isCo2High ? styles.co2AlertValue : styles.sensorValue}>
                {reading.co2} ppm
              </Text>

              {isCo2High ? (
                <View style={styles.co2NotificationBox}>
                  <Text style={styles.co2NotificationTitle}>
                    Quby air alert
                  </Text>

                  <Text style={styles.co2NotificationText}>
                    CO₂ is high. Open the window.
                  </Text>
                </View>
              ) : (
                <Text style={styles.co2GoodText}>
                  CO₂ level is normal.
                </Text>
              )}

              <Pressable
                style={styles.notificationButton}
                onPress={requestNotificationPermission}
              >
                <Text style={styles.notificationButtonText}>
                  Enable notifications
                </Text>
              </Pressable>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>Fumes</Text>
              <Text style={styles.sensorValue}>{reading.fumes} µg/m³</Text>
            </View>

            <View style={styles.sensorCard}>
              <Text style={styles.sensorTitle}>Smoke</Text>
              <Text style={styles.sensorValue}>{reading.smoke} µg/m³</Text>
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
    backgroundColor: '#FFFFFF',
  },

  fixedHero: {
    position: 'absolute',
    top: 25,
    left: 20,
    right: 20,
    height: 170,
    backgroundColor: '#81D8D0',
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
    backgroundColor: '#F0F0F0',
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

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  profileIcon: {
    fontSize: 34,
  },

  profileTextBox: {
    flex: 1,
  },

  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
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

  co2AlertCard: {
    width: '48%',
    backgroundColor: '#FEF2F2',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
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

  co2AlertValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#DC2626',
  },

  co2NotificationBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },

  co2NotificationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 3,
  },

  co2NotificationText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
    lineHeight: 17,
  },

  co2GoodText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '700',
    marginTop: 8,
  },

  notificationButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  notificationButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
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
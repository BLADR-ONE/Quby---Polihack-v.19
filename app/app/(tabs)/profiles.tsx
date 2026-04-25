import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PROFILE_ORDER, ProfileKey, PROFILES } from '../../constants/profiles';
import { useQuby } from '../../context/QubyContext';

export default function ProfilesScreen() {
  const { activeProfile, setActiveProfile } = useQuby();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Health Profiles</Text>
      <Text style={styles.subtitle}>
        Select the sensitivity mode based on the room's occupant.
      </Text>

      {PROFILE_ORDER.map((key: ProfileKey) => {
        const profile = PROFILES[key];
        const isSelected = activeProfile === key;

        return (
          <TouchableOpacity
            key={key}
            style={[styles.profileCard, isSelected && styles.selectedCard]}
            onPress={() => setActiveProfile(key)}
          >
            <View style={styles.profileHeader}>
              <View style={styles.profileMainInfo}>
                <View style={styles.iconBox}>
                  <Text style={styles.profileIcon}>{profile.icon}</Text>
                </View>

                <View style={styles.profileTextBox}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileDescription}>
                    {profile.description}
                  </Text>
                </View>
              </View>

              {isSelected && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
              )}
            </View>

            <View style={styles.parametersBox}>
              <Text style={styles.parametersTitle}>Recommended limits</Text>

              <View style={styles.parameterRow}>
                <Text style={styles.parameterLabel}>Temperature</Text>
                <Text style={styles.parameterValue}>
                  {profile.tempMin}°C - {profile.tempMax}°C
                </Text>
              </View>

              <View style={styles.parameterRow}>
                <Text style={styles.parameterLabel}>Humidity</Text>
                <Text style={styles.parameterValue}>
                  {profile.humidityMin}% - {profile.humidityMax}%
                </Text>
              </View>

              <View style={styles.parameterRow}>
                <Text style={styles.parameterLabel}>CO₂</Text>
                <Text style={styles.parameterValue}>
                  max {profile.co2Max} ppm
                </Text>
              </View>

              <View style={styles.parameterRow}>
                <Text style={styles.parameterLabel}>Fumes particles</Text>
                <Text style={styles.parameterValue}>
                  max {profile.fumesMax} µg/m³
                </Text>
              </View>

              <View style={styles.parameterRow}>
                <Text style={styles.parameterLabel}>Smoke particles</Text>
                <Text style={styles.parameterValue}>
                  max {profile.smokeMax} µg/m³
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Note</Text>
        <Text style={styles.infoText}>
          These modes are not medical diagnoses. They only adjust alert sensitivity for temperature, humidity, CO₂ and particle levels.
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
    fontWeight: '800',
    marginTop: 30,
    color: '#1E293B',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 21,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },

  selectedCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 3,
    borderColor: '#2563EB',
  },

  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  profileMainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileIcon: {
    fontSize: 28,
  },

  profileTextBox: {
    flex: 1,
  },

  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 5,
  },

  profileDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },

  activeBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    height: 30,
  },

  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  parametersBox: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
  },

  parametersTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },

  parameterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  parameterLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  parameterValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginTop: 8,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 20,
  },

  bottomSpace: {
    height: 40,
  },
});
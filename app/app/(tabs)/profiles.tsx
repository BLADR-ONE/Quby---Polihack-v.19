import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PROFILE_ORDER, ProfileKey, PROFILES } from '@/constants/profiles';
import { useQuby } from '@/context/QubyContext';

export default function ProfilesScreen() {
  const { activeProfile, setActiveProfile } = useQuby();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profiles</Text>
      <Text style={styles.subtitle}>
        Change how sensitive Quby is for each type of user.
      </Text>

      {PROFILE_ORDER.map((profileKey: ProfileKey) => {
        const profile = PROFILES[profileKey];
        const isActive = activeProfile === profileKey;

        return (
          <TouchableOpacity
            key={profileKey}
            activeOpacity={0.9}
            onPress={() => setActiveProfile(profileKey)}
            style={[styles.card, isActive && styles.activeCard]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.headerMain}>
                <Text style={styles.icon}>{profile.icon}</Text>
                <View style={styles.headerCopy}>
                  <Text style={styles.name}>{profile.name}</Text>
                  <Text style={styles.description}>{profile.description}</Text>
                </View>
              </View>
              {isActive ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACTIVE</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.thresholds}>
              <Text style={styles.thresholdTitle}>Thresholds</Text>
              <Text style={styles.thresholdLine}>
                Temp: {profile.tempMin}°C to {profile.tempMax}°C
              </Text>
              <Text style={styles.thresholdLine}>
                Humidity: {profile.humidityMin}% to {profile.humidityMax}%
              </Text>
              <Text style={styles.thresholdLine}>CO2: max {profile.co2Max}</Text>
              <Text style={styles.thresholdLine}>Fumes: max {profile.fumesMax}</Text>
              <Text style={styles.thresholdLine}>Smoke: max {profile.smokeMax}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Important</Text>
        <Text style={styles.noteBody}>
          These profiles are not medical diagnoses. They only change alert
          sensitivity for the demo.
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
    color: '#64748b',
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
    borderColor: '#C0C0C0',
    borderWidth: 2,
  },
  activeCard: {
    borderColor: '#0f766e',
    backgroundColor: '#ecfeff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerMain: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    fontSize: 34,
  },
  headerCopy: {
    flex: 1,
  },
  name: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  description: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f766e',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  thresholds: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 14,
    marginTop: 16,
  },
  thresholdTitle: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  thresholdLine: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 6,
  },
  noteCard: {
    backgroundColor: '#cffafe',
    borderRadius: 24,
    padding: 18,
    marginTop: 6,
  },
  noteTitle: {
    color: '#155e75',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  noteBody: {
    color: '#155e75',
    fontSize: 14,
    lineHeight: 20,
  },
});

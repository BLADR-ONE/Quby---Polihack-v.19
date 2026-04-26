import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { HISTORY_ITEMS } from '@/data/mock';

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>
        Previous air readings and alerts from your tips.
      </Text>

      {HISTORY_ITEMS.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.time}>{item.time}</Text>
          <Text style={styles.event}>{item.title}</Text>
          <Text style={styles.body}>{item.summary}</Text>
          <Text style={styles.meta}>
            {item.profile} • {item.status}
          </Text>
        </View>
      ))}


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
    color: '#9d174d',
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
  time: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 6,
  },
  event: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  body: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    color: '#be185d',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
  noteCard: {
    backgroundColor: '#ffe4e6',
    borderRadius: 24,
    padding: 18,
    marginTop: 2,
  },
  noteTitle: {
    color: '#9f1239',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  noteBody: {
    color: '#9f1239',
    fontSize: 14,
    lineHeight: 20,
  },
});

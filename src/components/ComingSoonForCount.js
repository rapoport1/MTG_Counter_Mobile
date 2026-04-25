import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { useSettings } from '../context/SettingsContext';

export function ComingSoonForCount({ count, onBack }) {
  const { theme } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ThemeDecoration theme={theme} />
      <View style={styles.content}>
        <Sparkles size={48} color={theme.accent} strokeWidth={1.2} style={{ marginBottom: 16, alignSelf: 'center' }} />
        <Text style={[styles.title, { color: theme.text }]}>{count}-player layout</Text>
        <Text style={[styles.description, { color: theme.textMuted }]}>
          This player count isn't supported yet.
        </Text>
        <Pressable onPress={onBack} style={[styles.backButton, { borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
          <Text style={{ color: theme.text, fontSize: 14, fontWeight: '500', textAlign: 'center' }}>
            ← Back to landing
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    zIndex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center'
  },
  description: {
    fontSize: 15,
    maxWidth: 260,
    lineHeight: 22,
    textAlign: 'center'
  },
  backButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  }
});

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Settings as SettingsIcon } from 'lucide-react-native';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { useSettings } from '../context/SettingsContext';

export const Landing = ({ onStart, onSettings }) => {
  const { theme, playerCount, setPlayerCount, startingLife } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ThemeDecoration theme={theme} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.time, { color: theme.textDim }]}>9:41</Text>
          <Pressable onPress={onSettings} style={styles.iconButton} accessibilityLabel="Settings">
            <SettingsIcon size={24} color={theme.textMuted} strokeWidth={1.5} />
          </Pressable>
        </View>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>MTG Life</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted, fontStyle: theme.name === 'Fantasy' ? 'italic' : 'normal' }]}>
            Commander tracker
          </Text>
        </View>
        <Text style={[styles.prompt, { color: theme.text }]}>How many players?</Text>
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const selected = playerCount === n;
            return (
              <Pressable key={n} onPress={() => setPlayerCount(n)} style={[
                styles.gridButton,
                {
                  backgroundColor: selected ? theme.accentBg : theme.surface,
                  borderColor: selected ? theme.accentBorder : theme.surfaceBorder,
                  borderWidth: selected ? 2 : 0.5,
                }
              ]}>
                <Text style={{
                  color: selected ? theme.accentText : theme.text,
                  fontSize: 26,
                  fontWeight: '500'
                }}>{n}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.settingsRow}>
          <Pressable onPress={onSettings} style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
            <Text style={[styles.settingsCardLabel, { color: theme.textDim }]}>LIFE</Text>
            <Text style={[styles.settingsCardValueBig, { color: theme.text }]}>{startingLife}</Text>
          </Pressable>
          <Pressable onPress={onSettings} style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
            <Text style={[styles.settingsCardLabel, { color: theme.textDim }]}>THEME</Text>
            <Text style={[styles.settingsCardValueSmall, { color: theme.text }]}>{theme.name}</Text>
          </Pressable>
        </View>
        <Pressable onPress={onStart} style={[styles.startButton, { backgroundColor: theme.button }]}>
          <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: '500' }}>
            Start game
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  time: {
    fontSize: 12,
  },
  iconButton: {
    padding: 4,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 44
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    letterSpacing: 0.3
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4
  },
  prompt: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 20
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  gridButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  settingsRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  settingsCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  settingsCardLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  settingsCardValueBig: {
    fontSize: 20,
    fontWeight: '500'
  },
  settingsCardValueSmall: {
    fontSize: 15,
    fontWeight: '500'
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  }
});

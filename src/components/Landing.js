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

        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>Lifeforge</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted, fontStyle: theme.name === 'Fantasy' ? 'italic' : 'normal' }]}>
            Arcanist's Ledger
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
        <Pressable onPress={onSettings} style={[styles.settingsButton, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
          <SettingsIcon size={20} color={theme.textMuted} strokeWidth={2} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 15, fontWeight: '500' }}>Game Settings</Text>
            <Text style={{ color: theme.textDim, fontSize: 13, marginTop: 2 }}>{startingLife} Life • {theme.name} Theme</Text>
          </View>
        </Pressable>
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
  titleSection: {
    alignItems: 'center',
    marginTop: 80
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
  settingsButton: {
    marginTop: 'auto',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  }
});

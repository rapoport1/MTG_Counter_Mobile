import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { Toggle } from './ui/Toggle';
import { THEMES } from '../constants/themes';
import { useSettings } from '../context/SettingsContext';

export const Settings = ({ onBack }) => {
  const { theme, themeKey, setThemeKey, startingLife, setStartingLife, toggles, setToggles } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ThemeDecoration theme={theme} />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.text} strokeWidth={1.75} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        </View>
        
        <Text style={[styles.sectionLabel, { color: theme.textDim }]}>THEME</Text>
        <View style={styles.grid3}>
          {Object.entries(THEMES).map(([key, t]) => {
            const selected = themeKey === key;
            return (
              <Pressable key={key} onPress={() => setThemeKey(key)} style={[
                styles.themeButton,
                {
                  backgroundColor: selected ? theme.accentBg : theme.surface,
                  borderColor: selected ? theme.accentBorder : theme.surfaceBorder,
                  borderWidth: selected ? 2 : 0.5,
                }
              ]}>
                <Text style={{
                  color: selected ? theme.accentText : theme.text,
                  fontSize: 13,
                  fontWeight: '500',
                  textAlign: 'center'
                }}>{t.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textDim }]}>STARTING LIFE</Text>
        <View style={styles.grid5}>
          {[20, 30, 40, 50, 60].map((n) => {
            const selected = startingLife === n;
            return (
              <Pressable key={n} onPress={() => setStartingLife(n)} style={[
                styles.lifeButton,
                {
                  backgroundColor: selected ? theme.accentBg : theme.surface,
                  borderColor: selected ? theme.accentBorder : theme.surfaceBorder,
                  borderWidth: selected ? 2 : 0.5,
                }
              ]}>
                <Text style={{
                  color: selected ? theme.accentText : theme.text,
                  fontSize: 15,
                  fontWeight: '500',
                  textAlign: 'center'
                }}>{n}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textDim, marginBottom: 4 }]}>GAME</Text>
        <View style={styles.togglesContainer}>
          {[
            { key: 'partnerCommanders', label: 'Partner commanders' },
            { key: 'poisonCounters', label: 'Poison counters' },
            { key: 'rapidIncrement', label: 'Rapid increment on hold' },
            { key: 'keepAwake', label: 'Keep screen awake' },
            { key: 'haptic', label: 'Haptic feedback' }
          ].map(({ key, label }) => (
            <View key={key} style={[styles.toggleRow, { borderBottomColor: theme.surfaceBorder, borderBottomWidth: 0.5 }]}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>{label}</Text>
              <Toggle theme={theme} checked={toggles[key]} onChange={(v) => setToggles({ ...toggles, [key]: v })} />
            </View>
          ))}
          <View style={styles.toggleRowLast}>
            <View style={styles.toggleTextContainer}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>AI Judge</Text>
              <Text style={[styles.toggleSubtext, { color: theme.textDim }]}>Coming soon · mobile only</Text>
            </View>
            <Toggle theme={theme} checked={false} onChange={() => {}} disabled />
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.surfaceBorder, borderTopWidth: 0.5 }]}>
          <Text style={{ color: theme.textDim, fontSize: 11, textAlign: 'center' }}>
            MTG Life · v4 prototype
          </Text>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 24
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 10,
    fontWeight: '500'
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
    justifyContent: 'space-between'
  },
  themeButton: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 8,
  },
  grid5: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 24,
    justifyContent: 'space-between'
  },
  lifeButton: {
    width: '18%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  togglesContainer: {
    flexDirection: 'column'
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14
  },
  toggleRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14
  },
  toggleLabel: {
    fontSize: 14,
    flex: 1,
    paddingRight: 12
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 12
  },
  toggleSubtext: {
    fontSize: 11,
    marginTop: 2
  },
  footer: {
    marginTop: 28,
    paddingTop: 20,
    alignItems: 'center'
  }
});

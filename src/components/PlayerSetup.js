import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { PLAYER_COLORS } from '../../constants/players';
import { ThemeDecoration } from './ui/ThemeDecoration';
import { PlayerSetupRow } from './PlayerSetupRow';
import { useSettings } from '../../context/SettingsContext';

export function PlayerSetup({ onBack, onBegin }) {
  const { theme, playerCount } = useSettings();

  const [players, setPlayers] = useState(() =>
    Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      colorId: PLAYER_COLORS[i % PLAYER_COLORS.length].id,
      commander: null,
      partner: null
    }))
  );

  function updatePlayer(id, updates) {
    setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ThemeDecoration theme={theme} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton} accessibilityLabel="Back">
            <ArrowLeft size={24} color={theme.text} strokeWidth={1.75} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Players</Text>
        </View>
        
        <Text style={[styles.helpText, { color: theme.textDim }]}>
          Tap the color circle to cycle. Commander art is optional and searched live from Scryfall.
        </Text>
        
        <ScrollView style={styles.listContainer}>
          {players.map((p) => (
            <PlayerSetupRow
              key={p.id}
              player={p}
              onUpdate={(updates) => updatePlayer(p.id, updates)}
            />
          ))}
        </ScrollView>
        
        <Pressable onPress={() => onBegin(players)} style={[styles.beginButton, { backgroundColor: theme.button }]}>
          <Text style={{ color: theme.buttonText, fontSize: 16, fontWeight: '500' }}>
            Begin game
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
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500'
  },
  helpText: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 18
  },
  listContainer: {
    flex: 1,
  },
  beginButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  }
});

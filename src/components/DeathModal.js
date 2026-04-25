import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Skull } from 'lucide-react-native';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function DeathModal({ player, onConfirm, onCancel }) {
  const { theme } = useSettings();
  
  if (!player) return null;
  const color = getColor(player.colorId);

  return (
    <Pressable style={styles.overlay} onPress={onCancel}>
      <Pressable style={[styles.modal, { backgroundColor: theme.bg, borderColor: color.border, borderWidth: 1 }]} onPress={(e) => e.stopPropagation()}>
        <Skull size={48} color={theme.danger} strokeWidth={1.4} style={{ marginBottom: 12, alignSelf: 'center' }} />
        <Text style={[styles.title, { color: theme.text }]}>Eliminate {player.name}?</Text>
        <Text style={[styles.description, { color: theme.textDim }]}>
          Player is at 1 life. Confirm elimination, or cancel to keep them in the game. You can undo this if it was a mistake.
        </Text>
        <View style={styles.buttonGroup}>
          <Pressable onPress={onConfirm} style={[styles.confirmButton, { backgroundColor: theme.danger }]}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', textAlign: 'center' }}>Eliminate</Text>
          </Pressable>
          <Pressable onPress={onCancel} style={[styles.cancelButton, { borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
            <Text style={{ color: theme.text, fontSize: 14, textAlign: 'center' }}>Cancel — keep them alive</Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 30
  },
  modal: {
    borderRadius: 16,
    padding: 22,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center'
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center'
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 8
  },
  confirmButton: {
    borderRadius: 8,
    padding: 14,
  },
  cancelButton: {
    borderRadius: 8,
    padding: 12,
  }
});

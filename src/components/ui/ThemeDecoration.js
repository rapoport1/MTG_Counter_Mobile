import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ThemeDecoration({ theme }) {
  if (theme.name === 'Simple' || theme.name === 'Dark') return null;

  if (theme.name === 'Neon') {
    return (
      <View style={styles.neonBg}>
        <View style={[styles.neonBlob1, { backgroundColor: theme.accentBg }]} />
        <View style={[styles.neonBlob2, { backgroundColor: theme.accentBg }]} />
      </View>
    );
  }

  if (theme.name === 'Fantasy') {
    return (
      <View style={[styles.fantasyBg, { borderColor: theme.accentBorder }]}>
        <View style={[styles.fantasyCorner, { top: 0, left: 0, borderBottomColor: theme.accentBorder, borderRightColor: theme.accentBorder, borderBottomWidth: 1, borderRightWidth: 1 }]} />
        <View style={[styles.fantasyCorner, { top: 0, right: 0, borderBottomColor: theme.accentBorder, borderLeftColor: theme.accentBorder, borderBottomWidth: 1, borderLeftWidth: 1 }]} />
        <View style={[styles.fantasyCorner, { bottom: 0, left: 0, borderTopColor: theme.accentBorder, borderRightColor: theme.accentBorder, borderTopWidth: 1, borderRightWidth: 1 }]} />
        <View style={[styles.fantasyCorner, { bottom: 0, right: 0, borderTopColor: theme.accentBorder, borderLeftColor: theme.accentBorder, borderTopWidth: 1, borderLeftWidth: 1 }]} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  neonBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
    opacity: 0.15
  },
  neonBlob1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '60%',
    height: '40%',
    borderRadius: 9999,
  },
  neonBlob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '50%',
    height: '50%',
    borderRadius: 9999,
  },
  fantasyBg: {
    position: 'absolute',
    top: 8, left: 8, right: 8, bottom: 8,
    opacity: 0.3,
    borderWidth: 1
  },
  fantasyCorner: {
    position: 'absolute',
    width: 20,
    height: 20
  }
});

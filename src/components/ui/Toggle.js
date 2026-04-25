import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';

export function Toggle({ checked, onChange, disabled, theme }) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[
        styles.toggleContainer,
        {
          backgroundColor: checked ? (disabled ? theme.surfaceBorder : theme.accent) : theme.surfaceBorder,
          opacity: disabled ? 0.5 : 1,
        }
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked }}
    >
      <View style={[
        styles.toggleKnob,
        {
          backgroundColor: theme.bg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
          transform: [{ translateX: checked ? 20 : 2 }]
        }
      ]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center'
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  }
});

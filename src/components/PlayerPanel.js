import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Skull } from 'lucide-react-native';
import { useHoldGesture } from '../hooks/useHoldGesture';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function PlayerPanel({ player, displayDelta, rotated, onLifeTick, onTryDie }) {
  const { toggles } = useSettings();
  const rapidIncrement = toggles.rapidIncrement;
  const poisonEnabled = toggles.poisonCounters;

  const color = getColor(player.colorId);
  const bgImage = player.commander && player.commander.artUrl;

  const plusHandlers = useHoldGesture({
    onTrigger: () => { if (!player.isDead) onLifeTick(+1); },
    enabled: rapidIncrement && !player.isDead
  });
  const minusHandlers = useHoldGesture({
    onTrigger: () => {
      if (player.isDead) return;
      if (player.life <= 1) {
        onTryDie();
        return;
      }
      onLifeTick(-1);
    },
    enabled: rapidIncrement && !player.isDead && player.life > 1
  });

  const isDead = player.isDead;
  const lowGentle = !isDead && player.life > 4 && player.life <= 9;
  const lowUrgent = !isDead && player.life <= 4 && player.life > 0;

  const textColor = isDead ? 'rgba(255,255,255,0.5)' : (bgImage ? '#FFFFFF' : color.hex);
  const textShadow = bgImage ? { textShadowColor: 'rgba(0,0,0,0.65)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 6 } : {};

  const highestCmd = Math.max(0, ...Object.values(player.commanderDamage || {}));

  const hasDelta = !isDead && displayDelta !== undefined && displayDelta !== 0;
  const deltaColor = displayDelta > 0 ? (bgImage ? '#86EFAC' : '#16A34A') : (bgImage ? '#FCA5A5' : '#B91C1C');

  const innerContent = (
    <View style={[styles.container, { borderColor: color.border, borderWidth: 1, transform: [{ rotate: rotated ? '180deg' : '0deg' }], backgroundColor: bgImage ? undefined : color.light, opacity: isDead ? 0.55 : 1 }]}>
      {!isDead && (
        <>
          <Pressable
            {...plusHandlers}
            accessibilityLabel={`Increase ${player.name} life`}
            style={styles.tapAreaTop}
          />
          <Pressable
            {...minusHandlers}
            accessibilityLabel={`Decrease ${player.name} life`}
            style={styles.tapAreaBottom}
          />
        </>
      )}

      <View style={styles.content} pointerEvents="none">
        <Text style={[styles.playerName, { color: textColor }, textShadow]} numberOfLines={1}>
          {player.name}
        </Text>
        
        {isDead ? (
          <>
            <Skull size={48} color={textColor} strokeWidth={1.4} style={styles.skull} />
            <Text style={[styles.eliminatedText, { color: textColor }, textShadow]}>ELIMINATED</Text>
          </>
        ) : (
          <>
            <Text style={[
              styles.deltaText,
              { color: deltaColor, opacity: hasDelta ? 1 : 0 },
              bgImage ? { textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 } : {}
            ]}>
              {hasDelta ? (displayDelta > 0 ? `+${displayDelta}` : `${displayDelta}`) : '+0'}
            </Text>
            <Text style={[styles.lifeText, { color: textColor }, textShadow]}>
              {player.life}
            </Text>
            <Text style={[styles.statsText, { color: textColor }, textShadow]}>
              CMD {highestCmd}{poisonEnabled ? ` · POI ${player.poison || 0}` : ''}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  if (bgImage) {
    return (
      <ImageBackground source={{ uri: bgImage }} style={styles.bgImage} imageStyle={{ borderRadius: 14 }}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: color.tint }]} />
        {innerContent}
      </ImageBackground>
    );
  }

  return innerContent;
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    borderRadius: 14,
  },
  container: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  tapAreaTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: '50%',
    zIndex: 2
  },
  tapAreaBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, height: '50%',
    zIndex: 2
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    zIndex: 3
  },
  playerName: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.9,
    letterSpacing: 0.5,
    marginBottom: 4,
    maxWidth: '90%',
  },
  skull: {
    marginTop: 6,
    marginBottom: 6,
    opacity: 0.7
  },
  eliminatedText: {
    fontSize: 12,
    opacity: 0.55,
    letterSpacing: 1.4
  },
  deltaText: {
    height: 24,
    fontSize: 20,
    fontWeight: '500',
  },
  lifeText: {
    fontSize: 72,
    fontWeight: '500',
    lineHeight: 80,
  },
  statsText: {
    fontSize: 11,
    opacity: 0.8,
    marginTop: 10,
    letterSpacing: 0.5
  }
});

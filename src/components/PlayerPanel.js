import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Animated, ScrollView } from 'react-native';
import { Skull, Droplet, Shield, X } from 'lucide-react-native';
import { useHoldGesture } from '../hooks/useHoldGesture';
import { getColor } from '../constants/players';
import { useSettings } from '../context/SettingsContext';

export function PlayerPanel({ player, displayDelta, rotated, onLifeTick, onTryDie, onPoisonTick, onCommanderDamageTick, allPlayers }) {
  const { toggles, theme } = useSettings();
  const rapidIncrement = toggles.rapidIncrement;
  const poisonEnabled = toggles.poisonCounters;

  const [isEditingStats, setIsEditingStats] = useState(false);

  const color = getColor(player.colorId);
  const bgImage = player.commander && player.commander.artUrl;

  const plusHandlers = useHoldGesture({
    onTrigger: () => { if (!player.isDead && !isEditingStats) onLifeTick(+1); },
    enabled: rapidIncrement && !player.isDead && !isEditingStats
  });
  const minusHandlers = useHoldGesture({
    onTrigger: () => {
      if (player.isDead || isEditingStats) return;
      if (player.life <= 1) {
        onTryDie();
        return;
      }
      onLifeTick(-1);
    },
    enabled: rapidIncrement && !player.isDead && !isEditingStats && player.life > 1
  });

  const isDead = player.isDead;
  const lowGentle = !isDead && player.life > 4 && player.life <= 9;
  const lowUrgent = !isDead && player.life <= 4 && player.life > 0;

  useEffect(() => {
    if (isDead) {
      setIsEditingStats(false);
    }
  }, [isDead]);

  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (lowGentle || lowUrgent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: lowUrgent ? 0.35 : 0.15,
            duration: lowUrgent ? 500 : 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: lowUrgent ? 500 : 800,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [lowGentle, lowUrgent]);

  const textColor = isDead ? 'rgba(255,255,255,0.5)' : (bgImage ? '#FFFFFF' : color.hex);
  const textShadow = bgImage ? { textShadowColor: 'rgba(0,0,0,0.65)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 6 } : {};

  const highestCmd = Math.max(0, ...Object.values(player.commanderDamage || {}));
  const hasDelta = !isDead && displayDelta !== undefined && displayDelta !== 0;
  const deltaColor = displayDelta > 0 ? (bgImage ? '#86EFAC' : '#16A34A') : (bgImage ? '#FCA5A5' : '#B91C1C');

  const opponents = allPlayers ? allPlayers.filter(p => p.id !== player.id) : [];

  const innerContent = (
    <View style={[styles.container, { borderColor: color.border, borderWidth: 1, transform: [{ rotate: rotated ? '180deg' : '0deg' }], backgroundColor: bgImage ? undefined : color.light, opacity: isDead ? 0.55 : 1 }]}>
      
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#ef4444', opacity: pulseAnim }]} pointerEvents="none" />
      
      {!isDead && !isEditingStats && (
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

      {isEditingStats ? (
        <View style={[styles.statsEditor, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
          <Pressable style={styles.closeEditorBtn} onPress={() => setIsEditingStats(false)}>
            <X color="white" size={24} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.statsScroll}>
            <Text style={styles.editorTitle}>Edit Stats for {player.name}</Text>
            
            {poisonEnabled && (
              <View style={styles.statRow}>
                <Droplet color="#a855f7" size={20} />
                <Text style={styles.statLabel}>Poison</Text>
                <View style={styles.statControls}>
                  <Pressable onPress={() => onPoisonTick(-1)} style={styles.statBtn}><Text style={styles.statBtnText}>-</Text></Pressable>
                  <Text style={styles.statValue}>{player.poison || 0}</Text>
                  <Pressable onPress={() => onPoisonTick(1)} style={styles.statBtn}><Text style={styles.statBtnText}>+</Text></Pressable>
                </View>
              </View>
            )}

            {opponents.flatMap(opp => {
              const rows = [];
              rows.push({
                key: opp.id.toString(),
                label: opp.commander ? opp.commander.name : `${opp.name}'s CMD`,
                isPartner: false,
                oppId: opp.id,
                colorId: opp.colorId
              });
              if (opp.partner) {
                rows.push({
                  key: `${opp.id}_partner`,
                  label: opp.partner.name,
                  isPartner: true,
                  oppId: opp.id,
                  colorId: opp.colorId
                });
              }
              return rows;
            }).map(row => (
              <View key={row.key} style={styles.statRow}>
                <View style={[styles.colorDot, { backgroundColor: getColor(row.colorId).hex }]} />
                <Text style={styles.statLabel} numberOfLines={1}>{row.label}</Text>
                <View style={styles.statControls}>
                  <Pressable onPress={() => onCommanderDamageTick(row.oppId, row.isPartner, -1)} style={styles.statBtn}><Text style={styles.statBtnText}>-</Text></Pressable>
                  <Text style={styles.statValue}>{(player.commanderDamage && player.commanderDamage[row.key]) || 0}</Text>
                  <Pressable onPress={() => onCommanderDamageTick(row.oppId, row.isPartner, 1)} style={styles.statBtn}><Text style={styles.statBtnText}>+</Text></Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content} pointerEvents="box-none">
          <Text style={[styles.playerName, { color: textColor }, textShadow]} numberOfLines={1}>
            {player.name}
          </Text>
          
          {isDead ? (
            <View pointerEvents="none" style={{alignItems:'center'}}>
              <Skull size={48} color={textColor} strokeWidth={1.4} style={styles.skull} />
              <Text style={[styles.eliminatedText, { color: textColor }, textShadow]}>ELIMINATED</Text>
            </View>
          ) : (
            <View pointerEvents="none" style={{alignItems:'center'}}>
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
            </View>
          )}

          {!isDead && (
            <Pressable 
              style={styles.statsTextWrapper} 
              onPress={() => setIsEditingStats(true)}
              hitSlop={15}
            >
              <Text style={[styles.statsText, { color: textColor }, textShadow]}>
                CMD {highestCmd}{poisonEnabled ? ` · POI ${player.poison || 0}` : ''}
              </Text>
            </Pressable>
          )}
        </View>
      )}
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
  bgImage: { flex: 1, borderRadius: 14 },
  container: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  tapAreaTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%', zIndex: 2 },
  tapAreaBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', zIndex: 2 },
  content: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 8, zIndex: 3 },
  playerName: { fontSize: 13, fontWeight: '500', opacity: 0.9, letterSpacing: 0.5, marginBottom: 4, maxWidth: '90%' },
  skull: { marginTop: 6, marginBottom: 6, opacity: 0.7 },
  eliminatedText: { fontSize: 12, opacity: 0.55, letterSpacing: 1.4 },
  deltaText: { height: 24, fontSize: 20, fontWeight: '500' },
  lifeText: { fontSize: 72, fontWeight: '500', lineHeight: 80 },
  statsTextWrapper: { padding: 4, marginTop: 6, zIndex: 4 },
  statsText: { fontSize: 11, opacity: 0.8, letterSpacing: 0.5, textDecorationLine: 'underline' },
  statsEditor: { ...StyleSheet.absoluteFillObject, zIndex: 10, padding: 12 },
  closeEditorBtn: { position: 'absolute', top: 8, right: 8, zIndex: 20, padding: 8 },
  statsScroll: { paddingTop: 20, paddingBottom: 20, alignItems: 'center' },
  editorTitle: { color: 'white', fontSize: 16, fontWeight: '500', marginBottom: 20 },
  statRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 16, paddingHorizontal: 12 },
  colorDot: { width: 14, height: 14, borderRadius: 7, marginHorizontal: 3 },
  statLabel: { color: 'white', fontSize: 14, flex: 1, marginLeft: 8 },
  statControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statBtn: { backgroundColor: 'rgba(255,255,255,0.2)', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  statBtnText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  statValue: { color: 'white', fontSize: 18, width: 28, textAlign: 'center', fontWeight: '500' }
});

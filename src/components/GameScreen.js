import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, StatusBar } from 'react-native';
import { Undo2, Scale, MoreHorizontal } from 'lucide-react-native';
import { PlayerPanel } from './PlayerPanel';
import { DeathModal } from './DeathModal';
import { ComingSoonForCount } from './ComingSoonForCount';
import { getLayout } from '../utils/layout';
import { useSettings } from '../context/SettingsContext';
import { useGameEngine } from '../hooks/useGameEngine';

export function GameScreen({ initialPlayers, onEndGame }) {
  const { theme, toggles } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    players,
    displayDeltas,
    pendingPlayer,
    canUndo,
    actions
  } = useGameEngine(initialPlayers, toggles);

  const layout = getLayout(players.length);
  if (!layout) {
    return <ComingSoonForCount count={players.length} onBack={onEndGame} />;
  }

  let playerIndex = 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar hidden={true} />
      <View style={styles.grid}>
        {layout.rows.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((slot, cIdx) => {
              const p = players[playerIndex++];
              return (
                <View key={p.id} style={styles.slotWrapper}>
                  <PlayerPanel
                    player={p}
                    displayDelta={displayDeltas[p.id]}
                    rotated={slot.rotated}
                    onLifeTick={(delta) => actions.onLifeTick(p.id, delta)}
                    onPoisonTick={(delta) => actions.onPoisonTick(p.id, delta)}
                    onCommanderDamageTick={(sourceId, isPartner, delta) => actions.onCommanderDamageTick(p.id, sourceId, isPartner, delta)}
                    onTryDie={() => actions.tryDie(p.id)}
                    allPlayers={players}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={[styles.centerMenuWrapper, players.length === 1 && { justifyContent: 'flex-end', paddingBottom: 60 }]} pointerEvents="box-none">
          <View style={[styles.centerMenu, { backgroundColor: theme.bg, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
            <Pressable
              onPress={actions.undo}
              disabled={!canUndo}
              style={[styles.iconButton, { opacity: !canUndo ? 0.35 : 1 }]}
              accessibilityLabel="Undo"
            >
              <Undo2 size={18} color={theme.textMuted} strokeWidth={1.75} />
            </Pressable>
            <Pressable
              disabled
              style={[styles.iconButton, { opacity: 0.35 }]}
              accessibilityLabel="AI Judge (coming soon)"
            >
              <Scale size={18} color={theme.textMuted} strokeWidth={1.75} />
            </Pressable>
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={styles.iconButton}
              accessibilityLabel="Menu"
            >
              <MoreHorizontal size={18} color={theme.textMuted} strokeWidth={1.75} />
            </Pressable>
          </View>
        </View>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={[styles.menuContainer, { backgroundColor: theme.bg, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.menuTitle, { color: theme.text }]}>Menu</Text>
            <View style={styles.menuItems}>
              <Pressable onPress={() => { actions.restart(); setMenuOpen(false); }} style={[styles.menuButton, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
                <Text style={[styles.menuButtonTitle, { color: theme.text }]}>Restart game</Text>
                <Text style={[styles.menuButtonSub, { color: theme.textDim }]}>Keeps players, resets life</Text>
              </Pressable>
              <Pressable onPress={onEndGame} style={[styles.menuButton, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
                <Text style={[styles.menuButtonTitle, { color: theme.text }]}>End game</Text>
                <Text style={[styles.menuButtonSub, { color: theme.textDim }]}>Returns to landing page</Text>
              </Pressable>
              <Pressable onPress={() => setMenuOpen(false)} style={[styles.cancelButton, { borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
                <Text style={{ color: theme.text, textAlign: 'center', fontSize: 14 }}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <DeathModal player={pendingPlayer} onConfirm={actions.confirmDeath} onCancel={actions.cancelDeath} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 6,
  },
  grid: {
    flex: 1,
    flexDirection: 'column',
    gap: 6
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 6
  },
  slotWrapper: {
    flex: 1
  },
  centerMenuWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerMenu: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  iconButton: {
    padding: 7,
    borderRadius: 999
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  menuContainer: {
    borderRadius: 14,
    padding: 18,
    width: '100%'
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  menuItems: {
    flexDirection: 'column',
    gap: 8
  },
  menuButton: {
    borderRadius: 8,
    padding: 12,
  },
  menuButtonTitle: {
    fontWeight: '500',
    fontSize: 14
  },
  menuButtonSub: {
    fontSize: 12,
    marginTop: 2
  },
  cancelButton: {
    borderRadius: 8,
    padding: 12,
    marginTop: 4
  }
});

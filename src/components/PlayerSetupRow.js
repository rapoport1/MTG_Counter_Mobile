import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { X } from 'lucide-react-native';
import { PLAYER_COLORS, getColor } from '../constants/players';
import { CommanderSearch } from './CommanderSearch';
import { useSettings } from '../context/SettingsContext';

export function PlayerSetupRow({ player, onUpdate }) {
  const { theme, toggles } = useSettings();
  const partnerEnabled = toggles.partnerCommanders;

  const [searchingSlot, setSearchingSlot] = useState(null);
  const color = getColor(player.colorId);

  function cycleColor() {
    const idx = PLAYER_COLORS.findIndex((c) => c.id === player.colorId);
    const next = PLAYER_COLORS[(idx + 1) % PLAYER_COLORS.length];
    onUpdate({ colorId: next.id });
  }

  function handleSelect(slot, commander) {
    onUpdate({ [slot]: commander });
    setSearchingSlot(null);
  }

  const renderCommanderTag = (commander, slotKey) => (
    <View style={[styles.tagContainer, { backgroundColor: 'rgba(0,0,0,0.1)', borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
      {commander.smallUrl ? (
        <ImageBackground source={{ uri: commander.smallUrl }} style={styles.tagImage} imageStyle={{ borderRadius: 4 }} />
      ) : (
        <View style={[styles.tagPlaceholder, { backgroundColor: color.hex }]} />
      )}
      <Text style={[styles.tagName, { color: theme.text }]} numberOfLines={1}>{commander.name}</Text>
      <Pressable onPress={() => {
        if (slotKey === 'commander') {
          onUpdate({ commander: null, partner: null });
        } else {
          onUpdate({ partner: null });
        }
      }} style={styles.clearButton}>
        <X size={16} color={theme.textDim} />
      </Pressable>
    </View>
  );

  return (
    <View style={[
      styles.rowContainer,
      {
        backgroundColor: theme.surface,
        borderColor: theme.surfaceBorder,
        borderWidth: 0.5,
        borderLeftColor: color.hex,
        borderLeftWidth: 4
      }
    ]}>
      <View style={styles.inputGroup}>
        <Pressable
          onPress={cycleColor}
          accessibilityLabel="Change player color"
          style={[styles.colorCycleButton, { backgroundColor: color.hex }]}
        />
        <TextInput
          value={player.name}
          onChangeText={(text) => onUpdate({ name: text })}
          selectTextOnFocus={true}
          maxLength={20}
          style={[styles.nameInput, { color: theme.text }]}
        />
      </View>
      
      <View style={styles.commanderSection}>
        {player.commander ? (
          renderCommanderTag(player.commander, 'commander')
        ) : searchingSlot === 'commander' ? (
          <CommanderSearch onSelect={(c) => handleSelect('commander', c)} onCancel={() => setSearchingSlot(null)} />
        ) : (
          <Pressable onPress={() => setSearchingSlot('commander')} style={[styles.addButton, { borderColor: theme.surfaceBorder, borderWidth: 0.5, borderStyle: 'dashed' }]}>
            <Text style={{ color: theme.textMuted, fontSize: 13 }}>+ Add commander</Text>
          </Pressable>
        )}
      </View>

      {partnerEnabled && player.commander && player.commander.hasPartner && (
        <View style={styles.partnerSection}>
          {player.partner ? (
            renderCommanderTag(player.partner, 'partner')
          ) : searchingSlot === 'partner' ? (
            <CommanderSearch onSelect={(c) => handleSelect('partner', c)} onCancel={() => setSearchingSlot(null)} isPartnerSearch={true} />
          ) : (
            <Pressable onPress={() => setSearchingSlot('partner')} style={[styles.addButton, { borderColor: theme.surfaceBorder, borderWidth: 0.5, borderStyle: 'dashed' }]}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>+ Add partner commander</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  colorCycleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 4
  },
  commanderSection: {
    marginTop: 8
  },
  partnerSection: {
    marginTop: 6
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 4,
    borderRadius: 6
  },
  tagImage: {
    width: 26,
    height: 26,
    borderRadius: 4,
  },
  tagPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 4,
  },
  tagName: {
    fontSize: 14,
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  }
});

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Landing } from './src/components/Landing';
import { Settings } from './src/components/Settings';
import { PlayerSetup } from './src/components/PlayerSetup';
import { GameScreen } from './src/components/GameScreen';
import { useSettings, SettingsProvider } from './src/context/SettingsContext';

function AppContent() {
  const { theme, startingLife } = useSettings();
  const [screen, setScreen] = useState('landing');
  const [gamePlayers, setGamePlayers] = useState(null);

  function handleBegin(setupPlayers) {
    const initialized = setupPlayers.map((p) => ({
      ...p,
      life: startingLife,
      poison: 0,
      commanderDamage: {},
      isDead: false
    }));
    setGamePlayers(initialized);
    setScreen('game');
  }

  function endGame() {
    setGamePlayers(null);
    setScreen('landing');
  }

  return (
    <SafeAreaView style={[styles.appWrapper, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={theme.name === 'Dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.appRelative}>
        {screen === 'landing' && (
          <Landing onStart={() => setScreen('player-setup')} onSettings={() => setScreen('settings')} />
        )}
        {screen === 'settings' && (
          <Settings onBack={() => setScreen('landing')} />
        )}
        {screen === 'player-setup' && (
          <PlayerSetup onBack={() => setScreen('landing')} onBegin={handleBegin} />
        )}
        {screen === 'game' && gamePlayers && (
          <GameScreen initialPlayers={gamePlayers} onEndGame={endGame} />
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
  appRelative: {
    flex: 1,
    position: 'relative'
  }
});

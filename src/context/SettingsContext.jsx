import React, { createContext, useContext, useState } from 'react';
import { THEMES } from '../constants/themes';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [themeKey, setThemeKey] = useState('simple');
  const [playerCount, setPlayerCount] = useState(4);
  const [startingLife, setStartingLife] = useState(40);
  const [toggles, setToggles] = useState({
    partnerCommanders: true,
    poisonCounters: true,
    rapidIncrement: true,
    keepAwake: true,
    haptic: true
  });

  const theme = THEMES[themeKey];

  return (
    <SettingsContext.Provider
      value={{
        themeKey, setThemeKey,
        theme,
        playerCount, setPlayerCount,
        startingLife, setStartingLife,
        toggles, setToggles
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

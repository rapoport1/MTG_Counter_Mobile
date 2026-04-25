import { useState, useRef, useEffect } from 'react';

const MERGE_WINDOW_MS = 900;
const DISPLAY_LINGER_MS = 1400;

export function useGameEngine(initialPlayers, toggles) {
  const [players, setPlayers] = useState(initialPlayers);
  const [history, setHistory] = useState([]);
  const [displayDeltas, setDisplayDeltas] = useState({});
  const [pendingDeath, setPendingDeath] = useState(null);

  const historyRef = useRef([]);
  const clearTimersRef = useRef({});

  useEffect(() => { historyRef.current = history; }, [history]);

  function scheduleDisplayClear(playerId) {
    if (clearTimersRef.current[playerId]) clearTimeout(clearTimersRef.current[playerId]);
    clearTimersRef.current[playerId] = setTimeout(() => {
      setDisplayDeltas((d) => {
        const n = { ...d };
        delete n[playerId];
        return n;
      });
      delete clearTimersRef.current[playerId];
    }, DISPLAY_LINGER_MS);
  }

  function onLifeTick(playerId, direction) {
    setPlayers((ps) => ps.map((p) => (p.id === playerId ? { ...p, life: Math.max(-99, Math.min(999, p.life + direction)) } : p)));

    const now = Date.now();
    const last = historyRef.current[historyRef.current.length - 1];
    const shouldMerge = last && last.type === 'life' && last.playerId === playerId && (now - last.timestamp) < MERGE_WINDOW_MS;

    let newDelta;
    let newHistory;
    if (shouldMerge) {
      newDelta = last.delta + direction;
      newHistory = [...historyRef.current.slice(0, -1), { ...last, delta: newDelta, timestamp: now }];
    } else {
      newDelta = direction;
      newHistory = [...historyRef.current, { type: 'life', playerId, delta: direction, timestamp: now }].slice(-50);
    }
    historyRef.current = newHistory;
    setHistory(newHistory);

    setDisplayDeltas((d) => ({ ...d, [playerId]: newDelta }));
    scheduleDisplayClear(playerId);

    if (toggles.haptic && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(8); } catch (e) {}
    }
  }

  function tryDie(playerId) {
    setPendingDeath(playerId);
  }

  function confirmDeath() {
    if (pendingDeath == null) return;
    const playerId = pendingDeath;
    const prevLife = players.find((p) => p.id === playerId)?.life ?? 1;
    setPlayers((ps) => ps.map((p) => (p.id === playerId ? { ...p, isDead: true, life: 0 } : p)));
    const newHistory = [...historyRef.current, { type: 'death', playerId, prevLife }].slice(-50);
    historyRef.current = newHistory;
    setHistory(newHistory);
    setPendingDeath(null);

    if (toggles.haptic && typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([20, 40, 20]); } catch (e) {}
    }
  }

  function cancelDeath() {
    setPendingDeath(null);
  }

  function undo() {
    if (historyRef.current.length === 0) return;
    const last = historyRef.current[historyRef.current.length - 1];
    if (last.type === 'life') {
      setPlayers((ps) => ps.map((p) => (p.id === last.playerId ? { ...p, life: p.life - last.delta } : p)));
      if (clearTimersRef.current[last.playerId]) clearTimeout(clearTimersRef.current[last.playerId]);
      setDisplayDeltas((d) => ({ ...d, [last.playerId]: -last.delta }));
      clearTimersRef.current[last.playerId] = setTimeout(() => {
        setDisplayDeltas((d) => {
          const n = { ...d };
          delete n[last.playerId];
          return n;
        });
        delete clearTimersRef.current[last.playerId];
      }, 1500);
    } else if (last.type === 'death') {
      setPlayers((ps) => ps.map((p) => (p.id === last.playerId ? { ...p, isDead: false, life: last.prevLife } : p)));
    }
    const newHistory = historyRef.current.slice(0, -1);
    historyRef.current = newHistory;
    setHistory(newHistory);
  }

  function restart() {
    setPlayers(initialPlayers);
    setHistory([]);
    historyRef.current = [];
    setDisplayDeltas({});
    setPendingDeath(null);
    Object.values(clearTimersRef.current).forEach((t) => clearTimeout(t));
    clearTimersRef.current = {};
  }

  const pendingPlayer = pendingDeath != null ? players.find((p) => p.id === pendingDeath) : null;
  const canUndo = history.length > 0;

  return {
    players,
    displayDeltas,
    pendingPlayer,
    canUndo,
    actions: {
      onLifeTick,
      tryDie,
      confirmDeath,
      cancelDeath,
      undo,
      restart
    }
  };
}

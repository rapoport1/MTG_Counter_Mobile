import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useDebounce } from '../../hooks/useDebounce';
import { searchScryfall, filterPopular } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

export function CommanderSearch({ onSelect, onCancel }) {
  const { theme } = useSettings();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [state, setState] = useState({ results: filterPopular(''), source: 'popular', error: null, loading: false });

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length === 0) {
      setState({ results: filterPopular(''), source: 'popular', error: null, loading: false });
      return;
    }
    if (q.length < 2) {
      setState({ results: [], source: 'empty', error: null, loading: false });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    searchScryfall(q).then((result) => {
      if (cancelled) return;
      if (result.results.length > 0) {
        setState({ results: result.results, source: 'api', error: null, loading: false });
      } else {
        const popular = filterPopular(q);
        setState({ results: popular, source: 'popular', error: result.error, loading: false });
      }
    });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const showBanner = state.source === 'popular' && state.error === 'unreachable' && debouncedQuery.trim().length >= 2;

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
        <Search size={16} color={theme.textDim} strokeWidth={1.5} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search commanders..."
          placeholderTextColor={theme.textDim}
          autoFocus
          style={[styles.input, { color: theme.text }]}
        />
        <Pressable onPress={onCancel} style={styles.cancelButton}>
          <X size={16} color={theme.textDim} />
        </Pressable>
      </View>

      {state.loading && <Text style={[styles.message, { color: theme.textDim }]}>Searching...</Text>}
      
      {!state.loading && showBanner && (
        <Text style={[styles.banner, { color: theme.textDim }]}>Scryfall unreachable — showing popular matches</Text>
      )}
      
      {!state.loading && state.source === 'popular' && debouncedQuery.trim().length === 0 && state.results.length > 0 && (
        <Text style={[styles.popularLabel, { color: theme.textDim }]}>POPULAR COMMANDERS</Text>
      )}
      
      {!state.loading && state.results.length > 0 && (
        <ScrollView style={styles.resultsList} nestedScrollEnabled>
          {state.results.map((r) => (
            <Pressable key={r.id} onPress={() => onSelect(r)} style={[
              styles.resultButton,
              { backgroundColor: theme.surface, borderColor: theme.surfaceBorder, borderWidth: 0.5 }
            ]}>
              {r.smallUrl ? (
                <Image source={{ uri: r.smallUrl }} style={styles.resultImage} />
              ) : (
                <View style={[styles.resultImagePlaceholder, { backgroundColor: theme.accentBg, borderColor: theme.surfaceBorder, borderWidth: 0.5 }]}>
                  <Text style={{ color: theme.textDim, fontSize: 11 }}>?</Text>
                </View>
              )}
              <Text style={[styles.resultName, { color: theme.text }]} numberOfLines={1}>{r.name}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      
      {!state.loading && state.results.length === 0 && debouncedQuery.trim().length >= 2 && (
        <Text style={[styles.message, { color: theme.textDim }]}>No matches</Text>
      )}
      
      {!state.loading && debouncedQuery.trim().length === 1 && (
        <Text style={[styles.message, { color: theme.textDim }]}>Keep typing...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  cancelButton: {
    padding: 4,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8
  },
  banner: {
    fontSize: 11,
    paddingTop: 6,
    paddingHorizontal: 2
  },
  popularLabel: {
    fontSize: 11,
    paddingTop: 6,
    paddingHorizontal: 2,
    letterSpacing: 0.5
  },
  resultsList: {
    marginTop: 6,
    maxHeight: 180,
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 6,
    marginBottom: 4
  },
  resultImage: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  resultImagePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultName: {
    fontSize: 14,
    flex: 1
  }
});

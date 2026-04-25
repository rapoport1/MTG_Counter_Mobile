import { POPULAR_COMMANDERS } from '../constants/commanders';

export async function tryFetch(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (e) {
    return null;
  }
}

const scryfallCache = new Map();
const MAX_CACHE_SIZE = 50;

function setCache(key, value) {
  if (scryfallCache.size >= MAX_CACHE_SIZE) {
    const firstKey = scryfallCache.keys().next().value;
    scryfallCache.delete(firstKey);
  }
  scryfallCache.set(key, value);
}

export async function searchScryfall(query) {
  const cacheKey = query.toLowerCase().trim();
  if (scryfallCache.has(cacheKey)) {
    return scryfallCache.get(cacheKey);
  }

  const q = encodeURIComponent(`${query} t:legendary`);
  const res = await tryFetch(`https://api.scryfall.com/cards/search?q=${q}&unique=cards&order=edhrec`);
  
  if (!res) return { results: [], error: 'unreachable' };
  
  if (res.status === 404) {
    const emptyResult = { results: [], error: null };
    setCache(cacheKey, emptyResult);
    return emptyResult;
  }
  
  if (!res.ok) return { results: [], error: 'api_error' };
  
  try {
    const data = await res.json();
    const results = (data.data || []).slice(0, 6).map((card) => {
      const face = card.image_uris ? card : card.card_faces && card.card_faces[0];
      const imgs = face && face.image_uris;
      return {
        id: card.id,
        name: card.name,
        artUrl: (imgs && imgs.art_crop) || null,
        smallUrl: (imgs && imgs.small) || null
      };
    });
    const successResult = { results, error: null };
    setCache(cacheKey, successResult);
    return successResult;
  } catch (e) {
    return { results: [], error: 'parse_error' };
  }
}

export function filterPopular(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    return POPULAR_COMMANDERS.slice(0, 6).map((name) => ({
      id: `popular:${name}`, name, artUrl: null, smallUrl: null
    }));
  }
  return POPULAR_COMMANDERS.filter((n) => n.toLowerCase().includes(q))
    .slice(0, 6)
    .map((name) => ({ id: `popular:${name}`, name, artUrl: null, smallUrl: null }));
}

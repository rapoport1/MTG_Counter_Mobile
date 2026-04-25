export const PLAYER_COLORS = [
  { id: 'blue',   name: 'Blue',   hex: '#2563eb', light: 'rgba(37,99,235,0.2)',  tint: 'rgba(37,99,235,0.55)',  border: 'rgba(37,99,235,0.5)' },
  { id: 'red',    name: 'Red',    hex: '#dc2626', light: 'rgba(220,38,38,0.2)',  tint: 'rgba(220,38,38,0.55)',  border: 'rgba(220,38,38,0.5)' },
  { id: 'green',  name: 'Green',  hex: '#16a34a', light: 'rgba(22,163,74,0.2)',  tint: 'rgba(22,163,74,0.55)',  border: 'rgba(22,163,74,0.5)' },
  { id: 'purple', name: 'Purple', hex: '#9333ea', light: 'rgba(147,51,234,0.2)', tint: 'rgba(147,51,234,0.55)', border: 'rgba(147,51,234,0.5)' },
  { id: 'amber',  name: 'Amber',  hex: '#d97706', light: 'rgba(217,119,6,0.2)',  tint: 'rgba(217,119,6,0.55)',  border: 'rgba(217,119,6,0.5)' },
  { id: 'pink',   name: 'Pink',   hex: '#db2777', light: 'rgba(219,39,119,0.2)', tint: 'rgba(219,39,119,0.55)', border: 'rgba(219,39,119,0.5)' }
];

export function getColor(id) {
  return PLAYER_COLORS.find((c) => c.id === id) || PLAYER_COLORS[0];
}

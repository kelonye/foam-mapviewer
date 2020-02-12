const COLORS = {
  applied: '#ffc966',
  challenged: 'hsl(204, 88%, 52%)',
  listing: '#28af60',
};

const COLORS_STYLE = [];
Object.entries(COLORS).forEach(([k, v]) => {
  COLORS_STYLE.push(k);
  COLORS_STYLE.push(v);
});
COLORS_STYLE.push('black');

export default {
  id: 'pois',
  type: 'circle',
  source: 'pois',
  paint: {
    'circle-color': ['match', ['get', 'status'], ...COLORS_STYLE],
    'circle-radius': 4,
  },
};

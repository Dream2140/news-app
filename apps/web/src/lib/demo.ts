/**
 * Static demo data used by cosmetic widgets that don't (yet) have
 * real backend endpoints. Kept in one module so it's obvious what is
 * fabricated and easy to replace when real APIs arrive.
 */

export interface TickerItem {
  tag: string;
  text: string;
}

export const TICKER_ITEMS: TickerItem[] = [
  { tag: 'BREAKING', text: 'Synaptix получил FDA-разрешение на клинические испытания →' },
  { tag: 'MARKETS', text: 'NVDA +4.2%  TSLA −1.8%  BTC $118 420  ETH $4 011' },
  { tag: 'CYBERSPORT', text: 'T1 взяли LCK 3:2 — Faker MVP восьмой раз' },
  { tag: 'LIVE', text: 'Starship V3 прямой эфир — T-00:43:12' },
  { tag: 'TECH', text: 'OpenAI O5 вышел в закрытое превью — waitlist открыт' },
  { tag: 'POLITIC', text: 'ЕС одобрил квантовый акт — 412 за, 68 против' },
  { tag: 'WEATHER', text: 'Токио 14°C дождь PM2.5: 28 уровень шума: 62 dB' },
];

export interface WorldHotspot {
  lat: number;
  lng: number;
  city: string;
  intensity: number;
  count: number;
}

export const WORLD_HOTSPOTS: WorldHotspot[] = [
  { lat: 35.68, lng: 139.65, city: 'TOKYO', intensity: 0.95, count: 142 },
  { lat: 37.56, lng: 126.97, city: 'SEOUL', intensity: 0.88, count: 98 },
  { lat: 50.85, lng: 4.35, city: 'BRUSSELS', intensity: 0.62, count: 41 },
  { lat: 42.36, lng: -71.05, city: 'BOSTON', intensity: 0.7, count: 56 },
  { lat: 37.77, lng: -122.41, city: 'SF BAY', intensity: 0.91, count: 120 },
  { lat: 1.35, lng: 103.82, city: 'SINGAPORE', intensity: 0.54, count: 32 },
  { lat: 52.23, lng: 21.01, city: 'WARSAW', intensity: 0.74, count: 58 },
  { lat: 24.71, lng: 46.67, city: 'RIYADH', intensity: 0.48, count: 22 },
  { lat: 51.51, lng: -0.13, city: 'LONDON', intensity: 0.82, count: 89 },
  { lat: 55.75, lng: 37.62, city: 'MOSCOW', intensity: 0.66, count: 47 },
  { lat: 39.9, lng: 116.4, city: 'BEIJING', intensity: 0.79, count: 71 },
  { lat: -33.86, lng: 151.2, city: 'SYDNEY', intensity: 0.38, count: 14 },
  { lat: -23.55, lng: -46.63, city: 'SÃO PAULO', intensity: 0.52, count: 28 },
];

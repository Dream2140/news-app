'use client';

import { useState } from 'react';

interface Spot {
  lat: number;
  lng: number;
  city: string;
  intensity: number;
  count: number;
}

const HOTSPOTS: Spot[] = [
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

const proj = (lat: number, lng: number) => ({
  x: (lng + 180) * (1000 / 360),
  y: (90 - lat) * (500 / 180),
});

export default function WorldMap() {
  const [hovered, setHovered] = useState<Spot | null>(null);
  const pts = HOTSPOTS;
  const totalSignals = pts.reduce((a, p) => a + p.count, 0);

  return (
    <div className="map-wrap frame">
      <div className="corner-bl" />
      <div className="corner-br" />
      <div className="map-head between">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <span className="chip" style={{ color: 'var(--mag)' }}>
            <span className="chip-dot" />
            GLOBAL HEATMAP
          </span>
          <span className="label">realtime · последние 60 мин</span>
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-dim)' }}>
          {totalSignals} signals · {pts.length} nodes active
        </div>
      </div>
      <div className="map-svg-wrap">
        <svg viewBox="0 0 1000 500" className="map-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="gridp" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(42,245,255,0.06)"
                strokeWidth="0.5"
              />
            </pattern>
            <radialGradient id="glowM">
              <stop offset="0%" stopColor="rgba(255,43,214,0.55)" />
              <stop offset="100%" stopColor="rgba(255,43,214,0)" />
            </radialGradient>
            <radialGradient id="glowC">
              <stop offset="0%" stopColor="rgba(42,245,255,0.45)" />
              <stop offset="100%" stopColor="rgba(42,245,255,0)" />
            </radialGradient>
          </defs>
          <rect width="1000" height="500" fill="url(#gridp)" />
          <g opacity="0.35" fill="none" stroke="rgba(160,200,255,0.25)" strokeWidth="0.9">
            <path d="M 120 130 q 30 -40 90 -30 q 60 10 80 60 q 20 50 -10 90 q -30 40 -80 30 q -60 -10 -80 -60 q -30 -60 0 -90 z" />
            <path d="M 260 300 q 20 -10 40 10 q 20 40 10 90 q -10 40 -30 50 q -30 10 -40 -30 q -10 -60 20 -120 z" />
            <path d="M 470 130 q 40 -20 80 0 q 30 20 20 50 q -10 30 -60 40 q -50 0 -60 -40 q -5 -30 20 -50 z" />
            <path d="M 490 200 q 40 -10 70 20 q 20 40 10 100 q -20 60 -50 70 q -40 0 -50 -60 q -10 -80 20 -130 z" />
            <path d="M 600 110 q 80 -30 180 0 q 80 30 90 90 q 0 60 -80 80 q -120 20 -180 -20 q -50 -40 -40 -100 q 10 -40 30 -50 z" />
            <path d="M 790 340 q 40 -10 70 10 q 20 30 -10 50 q -40 20 -70 10 q -30 -20 0 -50 q 5 -15 10 -20 z" />
          </g>
          <g stroke="rgba(255,43,214,0.25)" strokeWidth="0.6" fill="none">
            {pts.slice(0, 8).map((p, i) => {
              const a = proj(p.lat, p.lng);
              const next = pts[(i + 1) % pts.length];
              const b = proj(next.lat, next.lng);
              return (
                <path
                  key={i}
                  d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 60}, ${b.x} ${b.y}`}
                  strokeDasharray="2 4"
                />
              );
            })}
          </g>
          {pts.map((p, i) => {
            const { x, y } = proj(p.lat, p.lng);
            const r = 3 + p.intensity * 6;
            const glow = p.intensity > 0.75 ? 'url(#glowM)' : 'url(#glowC)';
            const col = p.intensity > 0.75 ? 'var(--mag)' : 'var(--cyn)';
            return (
              <g
                key={i}
                onMouseEnter={() => setHovered(p)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={x} cy={y} r={r * 5} fill={glow} />
                <circle cx={x} cy={y} r={r} fill={col} />
                <circle cx={x} cy={y} r={r} fill="none" stroke={col} className="mappulse" />
                <text
                  x={x + 10}
                  y={y + 3}
                  fill="#e8ecff"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  letterSpacing="1"
                >
                  {p.city} <tspan fill="var(--ink-ghost)">· {p.count}</tspan>
                </text>
              </g>
            );
          })}
        </svg>
        {hovered && (
          <div className="map-tip">
            <div
              style={{
                color: 'var(--mag)',
                fontWeight: 700,
                letterSpacing: '0.14em',
              }}
            >
              {hovered.city}
            </div>
            <div>
              signals: <b>{hovered.count}</b>
            </div>
            <div>
              intensity: <b>{(hovered.intensity * 100).toFixed(0)}%</b>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

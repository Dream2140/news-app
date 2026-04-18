'use client';

import { useEffect, useState } from 'react';

export default function LivePanel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1400);
    return () => clearInterval(t);
  }, []);

  const metrics = [
    {
      label: 'VIEWERS',
      value: (2418044 + ((tick * 37) % 9000)).toLocaleString('ru-RU'),
      color: 'var(--cyn)',
    },
    { label: 'BREAKING/H', value: String(14 + (tick % 5)), color: 'var(--red)' },
    { label: 'SIGNAL/Q', value: '97.' + (10 + (tick % 90)) + '%', color: 'var(--lim)' },
    {
      label: 'TREND INDEX',
      value: (72.4 + Math.sin(tick / 3) * 6).toFixed(1),
      color: 'var(--mag)',
    },
  ];

  const bars = Array.from(
    { length: 24 },
    (_, i) => 40 + Math.sin((tick + i) * 0.6) * 30 + ((i * 13) % 30),
  );

  return (
    <div className="live-panel frame">
      <div className="corner-bl" />
      <div className="corner-br" />
      <div
        className="between"
        style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}
      >
        <span className="chip chip-live">
          <span className="chip-dot" />
          LIVE · REALTIME
        </span>
        <span className="label mono">updated 00:0{tick % 10}</span>
      </div>
      <div className="live-grid">
        {metrics.map((m) => (
          <div key={m.label} className="live-cell">
            <div className="label">{m.label}</div>
            <div className="display" style={{ fontSize: 28, color: m.color, marginTop: 4 }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>
      <div className="live-graph">
        <div className="label" style={{ margin: '0 0 8px' }}>
          GLOBAL ENGAGEMENT // 24H
        </div>
        <div className="bar-row">
          {bars.map((h, i) => (
            <div
              key={i}
              className="bar"
              style={{
                height: h + '%',
                background:
                  i === 23
                    ? 'var(--mag)'
                    : 'linear-gradient(180deg, var(--cyn), rgba(42,245,255,0.1))',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

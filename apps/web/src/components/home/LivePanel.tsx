'use client';

import { useEffect, useState } from 'react';

/**
 * Decorative live-feed panel. The metrics and graph are demo values (no backend
 * metrics endpoint exists yet) — the "DEMO" tag is intentional so the visual
 * noise doesn't masquerade as real data.
 */
export default function LivePanel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1400);
    return () => clearInterval(t);
  }, []);

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
          LIVE · DEMO
        </span>
        <span className="label mono" style={{ color: 'var(--ink-ghost)' }}>
          visualization
        </span>
      </div>
      <div className="live-graph">
        <div className="label" style={{ margin: '0 0 8px' }}>
          SIGNAL WAVEFORM // 24H
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

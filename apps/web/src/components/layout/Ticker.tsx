'use client';

import { useEffect, useState } from 'react';

const TICKER_ITEMS = [
  { tag: 'BREAKING', text: 'Synaptix получил FDA-разрешение на клинические испытания →' },
  { tag: 'MARKETS', text: 'NVDA +4.2%  TSLA −1.8%  BTC $118 420  ETH $4 011' },
  { tag: 'CYBERSPORT', text: 'T1 взяли LCK 3:2 — Faker MVP восьмой раз' },
  { tag: 'LIVE', text: 'Starship V3 прямой эфир — T-00:43:12' },
  { tag: 'TECH', text: 'OpenAI O5 вышел в закрытое превью — waitlist открыт' },
  { tag: 'POLITIC', text: 'ЕС одобрил квантовый акт — 412 за, 68 против' },
  { tag: 'WEATHER', text: 'Токио 14°C дождь PM2.5: 28 уровень шума: 62 dB' },
];

export default function Ticker() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' JST',
      );
    };
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);

  const stream = TICKER_ITEMS.concat(TICKER_ITEMS);

  return (
    <div className="ticker">
      <div className="ticker-tag">
        <span className="dot-pulse" />
        LIVE FEED
      </div>
      <div className="ticker-track">
        <div className="ticker-run">
          {stream.map((t, i) => (
            <span key={i}>
              <b>[{t.tag}]</b>
              <i>▸ </i>
              {t.text}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: '0 14px',
          borderLeft: '1px solid var(--line)',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          color: 'var(--ink-dim)',
          whiteSpace: 'nowrap',
        }}
      >
        {time}
      </div>
    </div>
  );
}

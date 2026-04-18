'use client';

import { useEffect, useState } from 'react';
import { TICKER_ITEMS, type TickerItem } from '@/lib/demo';

interface TickerProps {
  items?: TickerItem[];
}

export default function Ticker({ items = TICKER_ITEMS }: TickerProps) {
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

  if (items.length === 0) return null;

  // Duplicate once for seamless CSS marquee.
  const stream = items.concat(items);

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
      <div className="ticker-clock mono">{time}</div>
    </div>
  );
}

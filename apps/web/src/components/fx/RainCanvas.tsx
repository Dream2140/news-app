'use client';

import { useEffect, useRef } from 'react';

export default function RainCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let drops: {
      x: number;
      y: number;
      len: number;
      v: number;
      o: number;
      hue: string;
    }[] = [];

    const init = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
      const count = Math.floor(W / 4);
      drops = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        len: 8 + Math.random() * 18,
        v: 7 + Math.random() * 10,
        o: 0.1 + Math.random() * 0.35,
        hue: Math.random() < 0.5 ? 'rgba(42,245,255,' : 'rgba(255,43,214,',
      }));
    };

    init();

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      for (const d of drops) {
        ctx.strokeStyle = d.hue + d.o + ')';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.len);
        ctx.stroke();
        d.y += d.v;
        if (d.y > H) {
          d.y = -d.len;
          d.x = Math.random() * W;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('resize', init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', init);
    };
  }, []);

  return <canvas ref={ref} className="fx-rain" aria-hidden />;
}

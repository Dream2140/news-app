import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="stage" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
      <div className="big-code glitch" data-text="404">
        404
      </div>
      <div className="display" style={{ fontSize: 28, marginTop: 20 }}>
        SIGNAL LOST
      </div>
      <div className="label mono" style={{ marginTop: 8, color: 'var(--ink-dim)' }}>
        404 // запрошенный узел не найден в сети
      </div>
      <Link href="/" className="btn btn-cyn" style={{ marginTop: 32, display: 'inline-block' }}>
        ← BACK TO FEED
      </Link>
    </div>
  );
}

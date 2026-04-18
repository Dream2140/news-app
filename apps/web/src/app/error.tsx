'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="stage" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
      <div className="big-code glitch" data-text="ERR">
        ERR
      </div>
      <div className="display" style={{ fontSize: 24, marginTop: 20, color: 'var(--red)' }}>
        ::: SYSTEM FAULT :::
      </div>
      <div
        className="mono"
        style={{ marginTop: 12, color: 'var(--ink-dim)', fontSize: 12, wordBreak: 'break-word' }}
      >
        {error.message}
      </div>
      <button type="button" onClick={reset} className="btn btn-mag" style={{ marginTop: 32 }}>
        ↻ RETRY
      </button>
    </div>
  );
}

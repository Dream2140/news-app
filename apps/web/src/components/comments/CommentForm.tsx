'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import type { IComment } from '@newsapp/shared';

const MAX_COMMENT_LENGTH = 5000;

export default function CommentForm({
  newsId,
  onCreated,
}: {
  newsId: string;
  onCreated: (c: IComment) => void;
}) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiClient.post('/comment', {
        content: content.trim(),
        newsId,
      });
      onCreated(res.data.data);
      setContent('');
    } catch {
      /* ignore */
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="frame"
        style={{
          padding: 16,
          textAlign: 'center',
          marginBottom: 16,
          color: 'var(--ink-dim)',
        }}
      >
        <div className="corner-bl" />
        <div className="corner-br" />
        <span className="label mono">⚷ авторизуйтесь, чтобы оставить отклик</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-new frame">
      <div className="corner-bl" />
      <div className="corner-br" />
      <div className="between" style={{ marginBottom: 8 }}>
        <span className="label">NEW REPLY // отклик</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-ghost)' }}>
          {content.length}/{MAX_COMMENT_LENGTH}
        </span>
      </div>
      <textarea
        className="input"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="> введите сообщение в канал…"
        maxLength={MAX_COMMENT_LENGTH}
        style={{ resize: 'vertical', fontFamily: 'JetBrains Mono, monospace' }}
      />
      <div className="between" style={{ marginTop: 10 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-ghost)' }}>
          канал: #{newsId.slice(-6)}
        </span>
        <button type="submit" className="btn btn-mag" disabled={!content.trim() || isLoading}>
          {isLoading ? 'SENDING…' : 'TRANSMIT ↗'}
        </button>
      </div>
    </form>
  );
}

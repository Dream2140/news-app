'use client';

import { useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api-client';
import type { IComment } from '@newsapp/shared';

export default function CommentsList({ newsId }: { newsId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/comment/news-comments/${newsId}`)
      .then((res) => setComments(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [newsId]);

  const handleCreated = (comment: IComment) => setComments((prev) => [comment, ...prev]);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/comment/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="comments-wrap">
      <div className="between" style={{ marginBottom: 12 }}>
        <span className="chip" style={{ color: 'var(--cyn)' }}>
          <span className="chip-dot" />
          COMMENTS · {comments.length}
        </span>
        <span className="label mono" style={{ color: 'var(--ink-dim)' }}>
          thread // открытый канал
        </span>
      </div>

      <CommentForm newsId={newsId} onCreated={handleCreated} />

      {isLoading ? (
        <div
          className="label mono"
          style={{ textAlign: 'center', padding: 24, color: 'var(--ink-dim)' }}
        >
          ::: LOADING THREAD :::
        </div>
      ) : comments.length === 0 ? (
        <div className="frame" style={{ padding: 32, textAlign: 'center', marginTop: 12 }}>
          <div className="corner-bl" />
          <div className="corner-br" />
          <div className="label mono" style={{ color: 'var(--ink-dim)' }}>
            ◫ канал пуст · будь первым
          </div>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              canDelete={c.user === user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { IComment } from '@newsapp/shared';

interface CommentItemProps {
  comment: IComment;
  canDelete: boolean;
  onDelete: (id: string) => void;
}

export default function CommentItem({ comment, canDelete, onDelete }: CommentItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const date = new Date(comment.publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="comment frame">
      <div className="corner-bl" />
      <div className="corner-br" />
      <div className="comment-av">
        <div className="comment-av-hex">{comment.nickname?.[0]?.toUpperCase() ?? '?'}</div>
      </div>
      <div className="comment-body">
        <div className="row gap-3" style={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="comment-nick">@{comment.nickname}</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-ghost)' }}>
            {date}
          </span>
        </div>
        <div className="comment-text">{comment.content}</div>
      </div>
      {canDelete && !confirmOpen && (
        <button
          type="button"
          className="icon-btn comment-del"
          onClick={() => setConfirmOpen(true)}
          aria-label="Delete"
        >
          ✕
        </button>
      )}
      {canDelete && confirmOpen && (
        <div className="comment-confirm">
          <span className="mono" style={{ fontSize: 11 }}>
            delete?
          </span>
          <button
            type="button"
            className="btn btn-cyn"
            style={{ padding: '4px 10px', fontSize: 10 }}
            onClick={() => setConfirmOpen(false)}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="btn btn-mag"
            style={{
              padding: '4px 10px',
              fontSize: 10,
              background: 'var(--red)',
              color: '#05060c',
            }}
            onClick={() => {
              onDelete(comment._id);
              setConfirmOpen(false);
            }}
          >
            DELETE
          </button>
        </div>
      )}
    </div>
  );
}

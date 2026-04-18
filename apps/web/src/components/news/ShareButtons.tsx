'use client';

import { useSnackbar } from '@/contexts/SnackbarContext';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const { showSnackbar } = useSnackbar();
  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      showSnackbar('Link copied to buffer', 'success');
    } catch {
      showSnackbar('Failed to copy', 'error');
    }
  };

  const shareTwitter = () =>
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`,
      '_blank',
    );
  const shareTelegram = () =>
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`,
      '_blank',
    );
  const shareFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
      '_blank',
    );

  return (
    <div className="rail-item share-rail">
      <div className="label">SHARE</div>
      <div className="share-row">
        <button type="button" className="icon-btn" onClick={handleCopyLink} title="Copy link">
          ⛓
        </button>
        <button type="button" className="icon-btn" onClick={shareTwitter} title="X">
          𝕏
        </button>
        <button type="button" className="icon-btn" onClick={shareTelegram} title="Telegram">
          ✈
        </button>
        <button type="button" className="icon-btn" onClick={shareFacebook} title="Facebook">
          f
        </button>
      </div>
    </div>
  );
}

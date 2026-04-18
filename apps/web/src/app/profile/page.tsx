'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import EditProfile from '@/components/profile/EditProfile';
import ChangePassword from '@/components/profile/ChangePassword';

type Tab = 'saved' | 'history' | 'activity' | 'settings';

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState<Tab>('settings');

  if (!isAuthenticated) redirect('/');

  return (
    <div className="stage profile-wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="sec-head">
        <span className="sec-num">§ PROFILE</span>
        <h2 className="sec-title">ИДЕНТИФИКАЦИЯ УЗЛА</h2>
      </div>

      <div className="profile-card frame">
        <div className="corner-bl" />
        <div className="corner-br" />
        <div className="profile-head">
          <div className="profile-av">
            <div className="profile-av-ring" />
            <div className="profile-av-hex">{user?.nickname?.[0]?.toUpperCase() ?? 'K'}</div>
          </div>
          <div className="profile-meta">
            <div className="chip" style={{ color: 'var(--mag)', display: 'inline-flex' }}>
              <span className="chip-dot" />
              ACTIVE NODE
            </div>
            <div className="display" style={{ fontSize: 28, marginTop: 8 }}>
              @{user?.nickname}
            </div>
            <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 12, marginTop: 4 }}>
              {user?.email} · role: <b style={{ color: 'var(--cyn)' }}>{user?.role}</b>
            </div>
          </div>
          <div className="profile-stats">
            <div className="rail-item">
              <div className="label">SAVED</div>
              <div className="display" style={{ fontSize: 22, color: 'var(--yel)' }}>
                00
              </div>
            </div>
            <div className="rail-item">
              <div className="label">READ</div>
              <div className="display" style={{ fontSize: 22, color: 'var(--cyn)' }}>
                142
              </div>
            </div>
            <div className="rail-item">
              <div className="label">KARMA</div>
              <div className="display" style={{ fontSize: 22, color: 'var(--lim)' }}>
                97%
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          {(['saved', 'history', 'activity', 'settings'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={'seg' + (tab === t ? ' active' : '')}
              onClick={() => setTab(t)}
            >
              {t === 'saved' && 'СОХРАНЁННОЕ'}
              {t === 'history' && 'ИСТОРИЯ'}
              {t === 'activity' && 'АКТИВНОСТЬ'}
              {t === 'settings' && 'НАСТРОЙКИ'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {tab === 'saved' && (
          <div className="frame" style={{ padding: 48, textAlign: 'center' }}>
            <div className="corner-bl" />
            <div className="corner-br" />
            <div className="label mono" style={{ color: 'var(--ink-dim)' }}>
              ◫ пока ничего не сохранено
            </div>
          </div>
        )}
        {tab === 'history' && (
          <div className="frame" style={{ padding: 48, textAlign: 'center' }}>
            <div className="corner-bl" />
            <div className="corner-br" />
            <div className="label mono" style={{ color: 'var(--ink-dim)' }}>
              история сигналов появится здесь
            </div>
          </div>
        )}
        {tab === 'activity' && (
          <div className="frame" style={{ padding: 48, textAlign: 'center' }}>
            <div className="corner-bl" />
            <div className="corner-br" />
            <div className="label mono" style={{ color: 'var(--ink-dim)' }}>
              лог активности · скоро
            </div>
          </div>
        )}
        {tab === 'settings' && (
          <div className="profile-settings">
            <div className="frame" style={{ padding: 24 }}>
              <div className="corner-bl" />
              <div className="corner-br" />
              <div className="chip" style={{ color: 'var(--cyn)', display: 'inline-flex' }}>
                <span className="chip-dot" />
                EDIT PROFILE
              </div>
              <div style={{ marginTop: 16 }}>
                <EditProfile />
              </div>
            </div>
            <div className="frame" style={{ padding: 24, marginTop: 24 }}>
              <div className="corner-bl" />
              <div className="corner-br" />
              <div className="chip" style={{ color: 'var(--mag)', display: 'inline-flex' }}>
                <span className="chip-dot" />
                ROTATE KEY
              </div>
              <div style={{ marginTop: 16 }}>
                <ChangePassword />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

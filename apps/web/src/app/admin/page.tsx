'use client';

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { UserRole } from '@newsapp/shared';
import UserList from '@/components/admin/UserList';
import FetchNews from '@/components/admin/FetchNews';
import AddNews from '@/components/admin/AddNews';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || user?.role !== UserRole.ADMIN) redirect('/');

  return (
    <div className="stage" style={{ paddingTop: 24, paddingBottom: 64 }}>
      <div className="sec-head">
        <span className="sec-num">§ ADMIN</span>
        <h2 className="sec-title">ЦЕНТР УПРАВЛЕНИЯ</h2>
        <span className="chip chip-live">
          <span className="chip-dot" />
          ROOT ACCESS
        </span>
      </div>

      <div className="frame" style={{ padding: 24, marginBottom: 24 }}>
        <div className="corner-bl" />
        <div className="corner-br" />
        <div className="chip" style={{ color: 'var(--cyn)', display: 'inline-flex' }}>
          <span className="chip-dot" />
          ADD NEWS SIGNAL
        </div>
        <div style={{ marginTop: 16 }}>
          <AddNews />
        </div>
      </div>

      <div className="frame" style={{ padding: 24, marginBottom: 24 }}>
        <div className="corner-bl" />
        <div className="corner-br" />
        <div className="chip" style={{ color: 'var(--yel)', display: 'inline-flex' }}>
          <span className="chip-dot" />
          FETCH EXTERNAL
        </div>
        <div style={{ marginTop: 16 }}>
          <FetchNews />
        </div>
      </div>

      <div className="frame" style={{ padding: 24 }}>
        <div className="corner-bl" />
        <div className="corner-br" />
        <div className="chip" style={{ color: 'var(--mag)', display: 'inline-flex' }}>
          <span className="chip-dot" />
          NODES · USERS
        </div>
        <div style={{ marginTop: 16 }}>
          <UserList />
        </div>
      </div>
    </div>
  );
}

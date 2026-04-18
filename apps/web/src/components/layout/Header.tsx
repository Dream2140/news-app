'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import { CATEGORIES } from '@/lib/categories';
import { NewsCategory, UserRole } from '@newsapp/shared';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    };
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const activeCategory = (() => {
    if (pathname === '/') {
      return (searchParams.get('category') as NewsCategory | null) ?? NewsCategory.ALL;
    }
    return null;
  })();

  return (
    <>
      <header className="site-head">
        <div className="site-head-top">
          <Link href="/" className="brand" aria-label="Dream News">
            <div className="brand-mark">
              <div className="brand-hex" />
              <div className="brand-hex-inner" />
            </div>
            <div>
              <div className="brand-main">
                <span>DREAM</span>
                <span className="brand-dot">.</span>
                <span style={{ color: 'var(--mag)' }}>NEWS</span>
              </div>
              <div className="brand-sub mono">агрегатор сигналов</div>
            </div>
          </Link>

          <div className="head-meta">
            <span className="mono">{time}</span>
          </div>

          <div className="head-actions">
            {searchOpen ? (
              <form onSubmit={submit} className="head-search">
                <span className="mono" style={{ color: 'var(--cyn)' }}>
                  ›
                </span>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="search // поиск по базе"
                  className="input"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 8,
                    width: 220,
                    boxShadow: 'none',
                  }}
                  onBlur={() => {
                    if (!query) setSearchOpen(false);
                  }}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery('');
                  }}
                  aria-label="Close search"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(true)}
                title="Search"
                aria-label="Search"
              >
                ⌕
              </button>
            )}

            {isAuthenticated && user ? (
              <div style={{ position: 'relative' }}>
                <button
                  className="avatar-btn"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account"
                >
                  {user.nickname?.[0]?.toUpperCase() ?? 'K'}
                </button>
                {menuOpen && (
                  <>
                    <div
                      onClick={() => setMenuOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                      aria-hidden
                    />
                    <div
                      className="frame"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        minWidth: 200,
                        background: 'var(--bg-1)',
                        zIndex: 51,
                      }}
                    >
                      <div className="corner-bl" />
                      <div className="corner-br" />
                      <div
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--line)',
                          fontWeight: 600,
                        }}
                      >
                        @{user.nickname}
                      </div>
                      {user.role === UserRole.ADMIN && (
                        <button
                          className="aside-item"
                          style={{ padding: '10px 14px', borderTop: 'none', width: '100%' }}
                          onClick={() => {
                            setMenuOpen(false);
                            router.push('/admin');
                          }}
                        >
                          Admin Panel
                        </button>
                      )}
                      <button
                        className="aside-item"
                        style={{ padding: '10px 14px', borderTop: 'none', width: '100%' }}
                        onClick={() => {
                          setMenuOpen(false);
                          router.push('/profile');
                        }}
                      >
                        Profile
                      </button>
                      <button
                        className="aside-item"
                        style={{
                          padding: '10px 14px',
                          borderTop: '1px solid var(--line)',
                          width: '100%',
                          color: 'var(--red)',
                        }}
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                      >
                        LOG OUT ↗
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button className="btn btn-cyn" onClick={() => setLoginOpen(true)}>
                LOG IN
              </button>
            )}
          </div>
        </div>

        <nav className="site-nav" aria-label="Categories">
          <div className="nav-inner">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.id;
              const href = c.id === NewsCategory.ALL ? '/' : `/?category=${c.id}`;
              return (
                <Link
                  key={c.id}
                  href={href}
                  className={'nav-pill' + (isActive ? ' active' : '')}
                  style={{ ['--cat' as string]: c.color }}
                >
                  <span className="nav-pill-jp">{c.jp}</span>
                  <span className="nav-pill-name">{c.ru.toUpperCase()}</span>
                  <span className="nav-pill-en">{c.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

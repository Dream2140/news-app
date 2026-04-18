import Link from 'next/link';

const NETWORK_LINKS = ['Channels', 'Sources', 'API', 'Terminal'];
const COMPANY_LINKS = ['Manifesto', 'Ethics', 'Careers', 'Press'];
const LEGAL_LINKS = ['Privacy', 'Terms', 'Licenses', 'Cookies'];

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="stage">
        <div className="foot-row">
          <div>
            <div className="display" style={{ fontSize: 26 }}>
              DREAM<span style={{ color: 'var(--mag)' }}>.</span>NEWS
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 6 }}>
              агрегатор сигналов
            </div>
            <div className="jp" style={{ color: 'var(--ink-ghost)', marginTop: 10 }}>
              情報は力なり
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
              <a
                href="https://github.com/Dream2140/news-app"
                target="_blank"
                rel="noreferrer"
                className="foot-link"
              >
                GitHub ↗
              </a>
            </div>
          </div>
          <div className="foot-cols">
            <div>
              <div className="label">NETWORK</div>
              {NETWORK_LINKS.map((x) => (
                <Link key={x} href="#" className="foot-link">
                  {x}
                </Link>
              ))}
            </div>
            <div>
              <div className="label">COMPANY</div>
              {COMPANY_LINKS.map((x) => (
                <Link key={x} href="#" className="foot-link">
                  {x}
                </Link>
              ))}
            </div>
            <div>
              <div className="label">LEGAL</div>
              {LEGAL_LINKS.map((x) => (
                <Link key={x} href="#" className="foot-link">
                  {x}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} Dream News</span>
        </div>
      </div>
    </footer>
  );
}

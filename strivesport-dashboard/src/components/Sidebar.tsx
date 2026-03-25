import { PageId, Workspace } from '../types';

const NAV_ITEMS: { id: PageId; label: string; mvp?: boolean }[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'pl',        label: 'Monthly P&L' },
  { id: 'bridge',    label: 'Revenue Bridge' },
  { id: 'channels',  label: 'Channels & Products' },
  { id: 'scenario',  label: 'Scenario Model' },
  { id: 'risks',     label: 'Risks & Insights' },
  { id: 'import',    label: 'Import Data', mvp: true },
];

interface Props {
  ws: Workspace;
  active: PageId;
  setActive: (p: PageId) => void;
  onBack: () => void;
}

export default function Sidebar({ ws, active, setActive, onBack }: Props) {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-inner">
          <div className="sb-icon" style={{ background: ws.color }}>{ws.initials}</div>
          <span className="sb-name">{ws.name}</span>
        </div>
        <button className="sb-back" onClick={onBack} title="All workspaces">←</button>
      </div>

      <div className="sb-ws">Workspace</div>
      <div className="sb-co">
        <div className="sb-co-name">{ws.plan}</div>
        <div className="sb-co-sub">2 entities · FY2027</div>
      </div>

      <div className="sb-divider" />
      <div className="sb-section">Views</div>

      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`sb-item${active === item.id ? ' active' : ''}`}
          onClick={() => setActive(item.id)}
        >
          <span className="sb-dot" />
          {item.label}
          {item.mvp && (
            <span className="badge ba" style={{ marginLeft: 'auto', fontSize: 9 }}>MVP</span>
          )}
        </button>
      ))}

      <div className="sb-footer">
        Built for Una Platform Analyst · March 2026<br />
        <span style={{ color: 'var(--accent)' }}>React + TypeScript + Chart.js</span>
      </div>
    </aside>
  );
}
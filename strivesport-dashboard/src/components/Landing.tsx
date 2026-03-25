import { useState } from 'react';
import { PageId, Workspace } from '../types';
import { WORKSPACES } from '../data/strivesport';

// ── TOPBAR ────────────────────────────────────────────────────
const PAGE_TITLES: Record<PageId, string> = {
  overview: 'Overview',
  pl:       'Monthly P&L',
  bridge:   'Revenue Bridge',
  channels: 'Channels & Products',
  scenario: 'Scenario Model',
  risks:    'Risks & Insights',
  import:   'Import Data',
};

interface TopbarProps {
  page: PageId;
  ws: Workspace;
}

export function Topbar({ page, ws }: TopbarProps) {
  return (
    <div className="topbar">
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{PAGE_TITLES[page]}</div>
        <div style={{ fontSize: 10.5, color: 'var(--t3)' }}>{ws.name} · FY2027 Planning</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10.5, color: 'var(--t3)', fontFamily: 'var(--mono)' }}>
          March 2026
        </span>
        <span className="badge bp">Live Model</span>
      </div>
    </div>
  );
}

// ── MVPModal ─────────────────────────────────────────────────
function MVPModal({ onClose }: { onClose: () => void }) {
  const features = [
    'Parse .xlsx and auto-map planning dimensions',
    'Detect entities, months, line items automatically',
    'Flag formula errors and anomalies on import',
    'Diff against prior period uploads',
    'Inject context into AI analyst automatically',
  ];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="badge ba" style={{ marginBottom: 11 }}>MVP Feature</div>
        <h2>Import is on the roadmap</h2>
        <p>
          A production build uses a Node.js backend with <strong>SheetJS</strong> to parse
          uploaded workbooks, auto-detect dimensions, validate integrity, and spin up a workspace
          with charts and AI analyst pre-loaded.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {features.map(f => (
            <div key={f} className="modal-feature">
              <span className="modal-check">✓</span>
              {f}
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn btn-p" onClick={onClose}>Got it</button>
          <button className="btn btn-g" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────
interface LandingProps {
  onSelect: (ws: Workspace) => void;
}

export function Landing({ onSelect }: LandingProps) {
  const [modal, setModal] = useState(false);

  return (
    <div className="landing">
      <nav className="l-nav">
        <div className="l-logo">
          <div className="l-logo-icon">U</div>
          <span className="l-logo-name">Una</span>
          <span className="l-logo-sub">FP&A Platform</span>
        </div>
        <span className="badge bp">Demo Build · March 2026</span>
      </nav>

      <div className="l-hero">
        <div className="l-eyebrow">Platform Analyst Exercise</div>
        <h1>Your Planning Workspaces</h1>
        <p>
          Each workspace is a full FP&A model — income statements, scenario modeling,
          channel analysis, and an AI analyst. Select one to open, or import a new dataset.
        </p>

        <div className="ws-grid">
          {WORKSPACES.map(ws => (
            <div key={ws.id} className="ws-card" onClick={() => onSelect(ws)}>
              <div className="ws-card-ribbon">
                <span className="badge bg">Live</span>
              </div>
              <div className="ws-card-icon" style={{ background: ws.color }}>{ws.initials}</div>
              <div className="ws-card-name">{ws.name}</div>
              <div className="ws-card-meta">{ws.plan}<br />2 entities · 10+ products</div>
              <div className="ws-card-tags">
                {ws.tags.map(t => <span key={t} className="badge bp">{t}</span>)}
              </div>
            </div>
          ))}

          <div className="ws-card ws-new" onClick={() => setModal(true)}>
            <div style={{ fontSize: 28, color: 'var(--t3)', marginBottom: 9 }}>+</div>
            <div className="ws-card-name">Import New Workspace</div>
            <div style={{ fontSize: 11, color: 'var(--t2)' }}>
              Upload an Excel or CSV file to auto-generate a full planning dashboard
            </div>
          </div>

          <div className="ws-card ws-new" style={{ opacity: .5 }} onClick={() => setModal(true)}>
            <div style={{ fontSize: 22, color: 'var(--t3)', marginBottom: 9 }}>⟳</div>
            <div className="ws-card-name">Connect Una Platform</div>
            <div style={{ fontSize: 11, color: 'var(--t2)' }}>
              Sync live data directly from a Una account — no manual exports
            </div>
          </div>
        </div>

        <p style={{ fontSize: 11, color: 'var(--t3)' }}>
          In production: workspaces would be multi-tenant, role-based, and sync with Una's data model.
          This demo uses the StriveSport exercise dataset.
        </p>
      </div>

      {modal && <MVPModal onClose={() => setModal(false)} />}
    </div>
  );
}
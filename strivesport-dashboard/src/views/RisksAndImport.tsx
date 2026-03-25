// Risks.tsx
export function Risks() {
  const risks = [
    { cat: 'Revenue',     t: 'br', title: 'Q4 Concentration Risk',        detail: 'Nov + Dec account for ~26% of full-year consolidated revenue. One missed holiday season can wipe $4–5M from the annual plan. Recommend formal Q4 scenario planning with a weekly flash reporting cadence.', like: 'High', impact: 'High' },
    { cat: 'Margin',      t: 'br', title: 'Wholesale Margin Dilution',     detail: 'Wholesale GM is ~16.5% vs 62.5% Retail / 58.5% Online. ProTeamOutfitters accounts for 52K units at a 22% discount. Every 5pp mix shift to wholesale costs ~$320K in gross profit.', like: 'High', impact: 'High' },
    { cat: 'Plan',        t: 'ba', title: 'Aggressive 14× Revenue Ramp',   detail: 'The 2027 plan is ~14× the 2026 actuals. Channel capacity — NYC retail throughput and online order volume — should be stress-tested before board presentation.', like: 'Medium', impact: 'High' },
    { cat: 'Cash',        t: 'ba', title: 'Inventory Build & Cash Drain',  detail: 'Ending inventory grows materially through December. Large Q4 purchase orders could create AP/cash timing mismatches. Set a minimum cash floor trigger.', like: 'Medium', impact: 'Medium' },
    { cat: 'Data',        t: 'ba', title: 'Premium Nov Formula Error',     detail: 'Sheet 51_Workforce_Premium has a cell reference error producing −$148M in November workforce cost, propagating through the 3FS. Must be resolved before any board review.', like: 'Low', impact: 'Medium' },
    { cat: 'Opportunity', t: 'bb', title: 'Retail Conversion Upside',      detail: 'NYC flagship runs at 22% foot traffic conversion. Improving to 25% lifts retail revenue by ~$540K with minimal incremental cost. High ROI lever.', like: 'Medium', impact: 'High' },
    { cat: 'Opportunity', t: 'bb', title: 'Windbreaker GM Outperformance', detail: 'Lightweight Windbreakers achieve ~68% GM in Retail — highest of any USA Inc product. Increasing SKU weighting and piloting a Premium windbreaker could lift blended margin.', like: 'Low', impact: 'Medium' },
  ];

  const lk: Record<string, string> = { High: 'br', Medium: 'ba', Low: 'bg' };

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Risks & Insights</div>
        <div className="page-subtitle">CFO-level risk register with likelihood and impact assessment</div>
      </div>
      {risks.map((r, i) => (
        <div className="risk-item" key={i}>
          <div>
            <div style={{ marginBottom: 4 }}><span className={`badge ${r.t}`}>{r.cat}</span></div>
            <div className="risk-title">{r.title}</div>
            <div className="risk-detail">{r.detail}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="risk-badge-label">Likelihood</div>
            <span className={`badge ${lk[r.like]}`}>{r.like}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="risk-badge-label">Impact</div>
            <span className={`badge ${lk[r.impact]}`}>{r.impact}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ImportData.tsx
import { useState } from 'react';

export function ImportData() {
  const [modal, setModal] = useState(false);

  const cards = [
    { t: 'Excel / CSV Upload',    s: 'Upload .xlsx or .csv and auto-map to planning dimensions', tag: 'MVP' },
    { t: 'Connect Una Platform',  s: 'Pull live data directly from a Una account',               tag: 'Roadmap' },
    { t: 'Google Sheets Sync',    s: 'Link a Sheet and sync on schedule or on-demand',           tag: 'Roadmap' },
    { t: 'API / Webhook',         s: 'Push data from your ERP, CRM, or data warehouse',          tag: 'Roadmap' },
  ];

  const features = [
    'Parse .xlsx and auto-map planning dimensions',
    'Detect entities, months, line items automatically',
    'Flag formula errors and anomalies on import',
    'Diff against prior period uploads',
    'Inject context into AI analyst automatically',
  ];

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Import Data</div>
        <div className="page-subtitle">Connect your planning workbook directly to this dashboard</div>
      </div>

      <div className="g2" style={{ marginBottom: 13 }}>
        {cards.map(item => (
          <div className="card" key={item.t} style={{ cursor: 'pointer' }} onClick={() => setModal(true)}>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 7 }}>
                <div className="card-title" style={{ fontSize: 13 }}>{item.t}</div>
                <span className={`badge ${item.tag === 'MVP' ? 'ba' : 'bp'}`}>{item.tag}</span>
              </div>
              <div className="card-sub" style={{ marginBottom: 12 }}>{item.s}</div>
              <button className="btn btn-g btn-sm">Learn more</button>
            </div>
          </div>
        ))}
      </div>

      <div className="upload-zone" onClick={() => setModal(true)}>
        <div style={{ fontSize: 26, opacity: .3, marginBottom: 9 }}>↑</div>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 3 }}>Drop your planning workbook here</div>
        <div style={{ fontSize: 11.5, color: 'var(--t2)' }}>
          Supports .xlsx, .csv — auto-maps to Revenue, COGS, OpEx dimensions
        </div>
      </div>

      {modal && (
        <div className="overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="badge ba" style={{ marginBottom: 11 }}>MVP Feature</div>
            <h2>Import is on the roadmap</h2>
            <p>
              A production build would use a Node.js backend with <strong>SheetJS</strong> to parse
              workbooks, auto-detect dimensions, validate integrity, and spin up a workspace with
              charts and AI pre-loaded.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {features.map(f => (
                <div key={f} className="modal-feature">
                  <span className="modal-check">✓</span>{f}
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-p" onClick={() => setModal(false)}>Got it</button>
              <button className="btn btn-g" onClick={() => setModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// MonthlyPL.tsx
import { useState } from 'react';
import { WorkspaceData } from '../types';
import { fmtFull, fmtPct, sum, MONTHS } from '../utils/format';

interface PLProps { data: WorkspaceData; onEdit: (key: keyof WorkspaceData, i: number, v: number) => void; }

export function MonthlyPL({ data, onEdit }: PLProps) {
  const [ent, setEnt] = useState<'usa' | 'prem'>('usa');
  const isUsa = ent === 'usa';
  const r   = isUsa ? data.usaRev   : data.premRev;
  const c   = isUsa ? data.usaCogs  : data.premCogs;
  const o   = isUsa ? data.usaOpex  : data.premOpex;
  const dep = isUsa ? data.usaDepr  : data.premDepr;
  const r26 = isUsa ? data.usa26Rev : data.prem26Rev;
  const keys = isUsa
    ? { r: 'usaRev', c: 'usaCogs', o: 'usaOpex', dep: 'usaDepr' }
    : { r: 'premRev', c: 'premCogs', o: 'premOpex', dep: 'premDepr' };

  const gp  = r.map((_, i) => r[i] - c[i]);
  const ni  = r.map((_, i) => r[i] - c[i] - o[i] - dep[i]);

  type Row = { l: string; d: number[]; key?: keyof WorkspaceData; edit?: boolean; indent?: boolean; neg?: boolean; pct?: boolean; bold?: boolean };
  const rows: Row[] = [
    { l: 'Net Revenue',    d: r,   key: keys.r as keyof WorkspaceData,   edit: true },
    { l: 'COGS',           d: c,   key: keys.c as keyof WorkspaceData,   edit: true, indent: true, neg: true },
    { l: 'Gross Profit',   d: gp,  bold: true },
    { l: 'GM %',           d: gp.map((_, i) => gp[i] / r[i]), pct: true, indent: true },
    { l: 'OpEx',           d: o,   key: keys.o as keyof WorkspaceData,   edit: true, indent: true, neg: true },
    { l: 'Depreciation',   d: dep, key: keys.dep as keyof WorkspaceData, edit: true, indent: true, neg: true },
    { l: 'Net Income',     d: ni,  bold: true },
  ];

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Monthly P&L</div>
        <div className="page-subtitle">Click any underlined value to edit — derived rows recalculate instantly</div>
      </div>
      <div className="callout cb-blue"><strong>Live editing.</strong> Gross Profit, GM%, and Net Income update automatically when you change any input row.</div>
      <div className="tab-list">
        <button className={`tab-btn${ent === 'usa' ? ' active' : ''}`} onClick={() => setEnt('usa')}>USA Inc</button>
        <button className={`tab-btn${ent === 'prem' ? ' active' : ''}`} onClick={() => setEnt('prem')}>Premium USA</button>
      </div>
      <div className="card">
        <div className="card-flush tw">
          <table>
            <thead>
              <tr><th>Line Item</th>{MONTHS.map(m => <th key={m}>{m}</th>)}<th>FY 2027</th><th>FY 2026</th></tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const fyV = row.pct ? sum(gp) / sum(r) : sum(row.d);
                return (
                  <tr key={ri} className={row.bold ? 'row-total' : ''}>
                    <td className={row.indent ? 'ti' : ''} style={{ fontWeight: row.bold ? 600 : 400 }}>{row.l}</td>
                    {row.d.map((v, mi) => (
                      <td key={mi} className={row.pct ? 'np' : ''}>
                        {row.edit ? (
                          <input className="ie" defaultValue={v}
                            style={{ color: row.neg ? 'var(--red)' : 'inherit' }}
                            onBlur={e => {
                              const n = parseFloat(e.target.value.replace(/[,$()]/g, ''));
                              if (!isNaN(n) && row.key) onEdit(row.key, mi, n);
                            }} />
                        ) : row.pct ? fmtPct(v) : fmtFull(row.neg ? -v : v)}
                      </td>
                    ))}
                    <td className="fw6">{row.pct ? fmtPct(fyV) : fmtFull(row.neg ? -fyV : fyV)}</td>
                    <td className="nm">{ri === 0 ? fmtFull(sum(r26)) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
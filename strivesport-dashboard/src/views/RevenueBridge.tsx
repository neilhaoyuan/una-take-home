import { useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { WorkspaceData } from '../types';
import { fmtFull, fmtPct, sum, MONTHS, CHART_COLORS as C, baseChartOptions as bO } from '../utils/format';
import { useChart } from '../hooks/useChart';

interface Props { data: WorkspaceData; }

export default function RevenueBridge({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const con26m = data.usa26Rev.map((_, i) => data.usa26Rev[i] + data.prem26Rev[i]);
  const con27m = data.usaRev.map((_, i) => data.usaRev[i] + data.premRev[i]);
  const con26  = sum(con26m);
  const con27  = sum(con27m);

  useChart(chartRef, () => new Chart(chartRef.current!, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: '2026 Actuals', data: con26m, backgroundColor: '#d1d5db', borderRadius: 3 },
        { label: '2027 Plan',    data: con27m, backgroundColor: C.navy,  borderRadius: 3 },
      ],
    },
    options: { ...bO, scales: { ...bO.scales, y: { ...bO.scales.y, ticks: { ...bO.scales.y.ticks, callback: (v: number) => `$${(v / 1e6).toFixed(1)}M` } } } } as any,
  }), [data.usaRev, data.premRev, data.usa26Rev, data.prem26Rev]);

  const wfItems = [
    { l: '2026 Actuals',       v: con26, col: '#94a3b8', bold: true },
    { l: '+ USA Inc Growth',   v: sum(data.usaRev)  - sum(data.usa26Rev),  col: C.navy  },
    { l: '+ Premium Growth',   v: sum(data.premRev) - sum(data.prem26Rev), col: C.amber },
    { l: '2027 Plan',          v: con27, col: C.green, bold: true },
  ];

  const yoyRows = [
    { l: '2026 Actuals', d: con26m,   bold: false },
    { l: '2027 Plan',    d: con27m,   bold: true  },
    { l: '$ Change',     d: con27m.map((_, i) => con27m[i] - con26m[i]), delta: true },
    { l: '% Change',     d: con27m.map((_, i) => (con27m[i] - con26m[i]) / con26m[i]), pct: true, delta: true },
  ];

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Revenue Bridge</div>
        <div className="page-subtitle">2026 Actuals → 2027 Plan</div>
      </div>
      <div className="callout cb-amber">
        <strong>Plan credibility flag:</strong> The 2027 plan is a ~14× step-up. Channel capacity
        — NYC retail throughput and online order volume — should be stress-tested before board presentation.
      </div>

      <div className="gar" style={{ marginBottom: 13 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">2026 vs 2027 — Consolidated Monthly Revenue</div></div>
          <div className="card-body"><canvas ref={chartRef} height={230} /></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Revenue Waterfall</div>
            <div className="card-sub" style={{ marginTop: 2 }}>Building from 2026 base ($M)</div>
          </div>
          <div className="card-body">
            {wfItems.map((item, i) => (
              <div className="wf-row" key={i}>
                <div className="wf-label" style={{ fontWeight: item.bold ? 600 : 400 }}>{item.l}</div>
                <div className="wf-track">
                  <div
                    className="wf-bar"
                    style={{ background: item.col, width: `${Math.max(Math.round((item.v / con27) * 100), 18)}%` }}
                  >
                    {(item.v / 1e6).toFixed(1)}M
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">YoY Monthly Comparison — Consolidated</div></div>
        <div className="card-flush tw">
          <table>
            <thead><tr><th>Metric</th>{MONTHS.map(m => <th key={m}>{m}</th>)}<th>FY</th></tr></thead>
            <tbody>
              {yoyRows.map((row, i) => {
                const fy = sum(row.d);
                return (
                  <tr key={i} className={row.bold ? 'row-total' : ''}>
                    <td style={{ fontWeight: row.bold ? 600 : 400 }}>{row.l}</td>
                    {row.d.map((v, mi) => (
                      <td key={mi} className={row.delta ? (v >= 0 ? 'np' : 'nn') : ''}>
                        {row.pct ? fmtPct(v) : fmtFull(v)}
                      </td>
                    ))}
                    <td className="fw6">
                      {row.pct ? fmtPct(fy / sum(con26m)) : fmtFull(fy)}
                    </td>
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
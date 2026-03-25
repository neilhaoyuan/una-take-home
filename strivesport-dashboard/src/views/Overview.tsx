import { useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { WorkspaceData } from '../types';
import { fmtM, fmtPct, sum, MONTHS, CHART_COLORS as C, baseChartOptions as bO } from '../utils/format';
import { useChart } from '../hooks/useChart';

interface Props { data: WorkspaceData; }

export default function Overview({ data }: Props) {
  const r1 = useRef<HTMLCanvasElement>(null);
  const r2 = useRef<HTMLCanvasElement>(null);
  const r3 = useRef<HTMLCanvasElement>(null);
  const r4 = useRef<HTMLCanvasElement>(null);

  const ni = data.usaRev.map((_, i) =>
    data.usaRev[i] - data.usaCogs[i] - data.usaOpex[i] - data.usaDepr[i]);
  const ur = sum(data.usaRev), uc = sum(data.usaCogs);
  const pr = sum(data.premRev), pc = sum(data.premCogs);

  useChart(r1, () => new Chart(r1.current!, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'USA Inc',  data: data.usaRev,  backgroundColor: C.navy,  borderRadius: 3, borderSkipped: false },
        { label: 'Premium',  data: data.premRev, backgroundColor: C.amber, borderRadius: 3, borderSkipped: false },
      ],
    },
    options: { ...bO, scales: { ...bO.scales, y: { ...bO.scales.y, ticks: { ...bO.scales.y.ticks, callback: (v: number) => `$${(v / 1e6).toFixed(1)}M` } } } } as any,
  }), [data.usaRev, data.premRev]);

  useChart(r2, () => new Chart(r2.current!, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'USA Inc GM%', data: data.usaRev.map((_, i) => (data.usaRev[i] - data.usaCogs[i]) / data.usaRev[i]), borderColor: C.navy,  backgroundColor: 'rgba(79,70,229,.06)',  tension: .4, fill: true, pointRadius: 3, pointBackgroundColor: C.navy,  borderWidth: 2 },
        { label: 'Premium GM%', data: data.premRev.map((_, i) => (data.premRev[i] - data.premCogs[i]) / data.premRev[i]), borderColor: C.amber, backgroundColor: 'rgba(245,158,11,.05)', tension: .4, fill: true, pointRadius: 3, pointBackgroundColor: C.amber, borderWidth: 2 },
      ],
    },
    options: { ...bO, scales: { ...bO.scales, y: { ...bO.scales.y, min: 0, max: 1, ticks: { ...bO.scales.y.ticks, callback: (v: number) => `${(v * 100).toFixed(0)}%` } } } } as any,
  }), [data.usaRev, data.usaCogs, data.premRev, data.premCogs]);

  useChart(r3, () => new Chart(r3.current!, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [{ label: 'Net Income', data: ni, borderColor: C.green, backgroundColor: 'rgba(16,185,129,.06)', tension: .4, fill: true, pointRadius: 3, pointBackgroundColor: C.green, borderWidth: 2 }],
    },
    options: { ...bO, plugins: { ...bO.plugins, legend: { display: false } }, scales: { ...bO.scales, y: { ...bO.scales.y, ticks: { ...bO.scales.y.ticks, callback: (v: number) => `$${(v / 1e3).toFixed(0)}K` } } } } as any,
  }), [ni]);

  useChart(r4, () => new Chart(r4.current!, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [{ label: 'Weight', data: data.seas, backgroundColor: data.seas.map((_, i) => i >= 10 ? C.green : i >= 8 ? C.amber : C.navy), borderRadius: 3 }],
    },
    options: { ...bO, plugins: { ...bO.plugins, legend: { display: false } }, scales: { ...bO.scales, y: { ...bO.scales.y, min: 0, ticks: { ...bO.scales.y.ticks, callback: (v: number) => `${(v * 100).toFixed(0)}%` } } } } as any,
  }), [data.seas]);

  const kpis = [
    { l: 'Consolidated Revenue', v: fmtM(ur + pr),       p: `2026: ${fmtM(sum(data.usa26Rev) + sum(data.prem26Rev))}`, b: '▲ 14.1×', bc: 'bg' },
    { l: 'USA Inc Revenue',      v: fmtM(ur),             p: `2026: ${fmtM(sum(data.usa26Rev))}`,  b: '▲ 10.3×', bc: 'bg' },
    { l: 'Premium Revenue',      v: fmtM(pr),             p: `2026: ${fmtM(sum(data.prem26Rev))}`, b: '▲ 21.8×', bc: 'bg' },
    { l: 'USA Inc GM',           v: fmtPct((ur - uc) / ur), p: '2026: ~45%', b: '+2.2pp', bc: 'bb' },
    { l: 'Premium GM',           v: fmtPct((pr - pc) / pr), p: '2026: ~40%', b: '+8.3pp', bc: 'bb' },
    { l: 'USA Inc Net Income',   v: fmtM(sum(ni)),         p: '2026: ~$117K', b: '▲ 15.6×', bc: 'bg' },
    { l: 'Consolidated GP',      v: fmtM((ur - uc) + (pr - pc)), p: `${fmtPct(((ur - uc) + (pr - pc)) / (ur + pr))} blended`, b: '', bc: '' },
    { l: 'Total Units (est.)',   v: '253K', p: 'annual plan', b: 'Plan', bc: 'bp' },
  ];

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Overview</div>
        <div className="page-subtitle">FY2027 plan summary vs 2026 actuals</div>
      </div>

      <div className="g4" style={{ marginBottom: 13 }}>
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="kpi-label">{k.l}</div>
            <div className="kpi-value">{k.v}</div>
            <div className="kpi-meta">
              <span className="kpi-prev">{k.p}</span>
              {k.b && <span className={`badge ${k.bc}`}>{k.b}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 13 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Monthly Revenue by Entity</div><div className="card-sub">2027 Plan</div></div>
          <div className="card-body"><canvas ref={r1} height={205} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Gross Margin % Trend</div><div className="card-sub">Both entities</div></div>
          <div className="card-body"><canvas ref={r2} height={205} /></div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-header"><div className="card-title">USA Inc — Net Income</div><div className="card-sub">Monthly</div></div>
          <div className="card-body"><canvas ref={r3} height={190} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Demand Seasonality</div><div className="card-sub">% of annual units</div></div>
          <div className="card-body"><canvas ref={r4} height={190} /></div>
        </div>
      </div>
    </div>
  );
}
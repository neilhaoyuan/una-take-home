import { useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { WorkspaceData } from '../types';
import { fmtM, fmtPct, sum, CHART_COLORS as C, baseChartOptions as bO } from '../utils/format';
import { useChart } from '../hooks/useChart';

interface Props { data: WorkspaceData; }

export default function Channels({ data }: Props) {
  const pieRef  = useRef<HTMLCanvasElement>(null);
  const barRef  = useRef<HTMLCanvasElement>(null);
  const prodRef = useRef<HTMLCanvasElement>(null);

  const totalRev = sum(Object.values(data.chRev));
  const chGP: Record<string, number> = {};
  Object.keys(data.chRev).forEach(k => { chGP[k] = data.chRev[k] * data.chGM[k]; });
  const totalGP = sum(Object.values(chGP));

  useChart(pieRef, () => new Chart(pieRef.current!, {
    type: 'doughnut',
    data: {
      labels: Object.keys(data.chRev),
      datasets: [{ data: Object.values(data.chRev), backgroundColor: [C.navy, C.teal, C.amber], borderWidth: 0, hoverOffset: 5 }],
    },
    options: {
      responsive: true, cutout: '66%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: "'Inter'", size: 11 }, color: '#6b7280', boxWidth: 10 } },
        tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${fmtM(ctx.raw)} (${fmtPct(ctx.raw / totalRev)})` } },
      },
    } as any,
  }), [data.chRev]);

  useChart(barRef, () => new Chart(barRef.current!, {
    type: 'bar',
    data: {
      labels: Object.keys(data.chGM),
      datasets: [{ label: 'GM%', data: Object.values(data.chGM), backgroundColor: Object.values(data.chGM).map(v => v > 0.5 ? C.green : v > 0.25 ? C.amber : C.red), borderRadius: 5 }],
    },
    options: { ...bO, indexAxis: 'y', plugins: { ...bO.plugins, legend: { display: false } }, scales: { x: { ...bO.scales.x, min: 0, max: 1, ticks: { ...bO.scales.x.ticks, callback: (v: number) => `${(v * 100).toFixed(0)}%` } }, y: bO.scales.y } } as any,
  }), [data.chGM]);

  useChart(prodRef, () => new Chart(prodRef.current!, {
    type: 'bar',
    data: {
      labels: data.products.map(p => p[0]),
      datasets: [{ label: 'GM%', data: data.products.map(p => p[1]), backgroundColor: data.products.map(p => p[1] > 0.6 ? C.green : p[1] > 0.4 ? C.amber : C.red), borderRadius: 4 }],
    },
    options: { ...bO, indexAxis: 'y', plugins: { ...bO.plugins, legend: { display: false } }, scales: { x: { ...bO.scales.x, min: 0, max: 1, ticks: { ...bO.scales.x.ticks, callback: (v: number) => `${(v * 100).toFixed(0)}%` } }, y: { ...bO.scales.y, ticks: { ...bO.scales.y.ticks, font: { family: "'Inter'", size: 10 } } } } } as any,
  }), [data.products]);

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Channels & Products</div>
        <div className="page-subtitle">Revenue mix and gross margin analysis</div>
      </div>
      <div className="callout cb-amber">
        <strong>Margin watch:</strong> Wholesale earns only ~16.5% GM vs 62.5% Retail / 58.5% Online.
        Every 5pp mix shift toward Retail/Online adds ~$320K in consolidated gross profit.
      </div>

      <div className="g3" style={{ marginBottom: 13 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Revenue Mix</div><div className="card-sub">FY 2027 consolidated</div></div>
          <div className="card-body"><canvas ref={pieRef} height={215} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">GM% by Channel</div></div>
          <div className="card-body"><canvas ref={barRef} height={215} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Channel Breakdown</div></div>
          <div className="card-body">
            {Object.keys(data.chRev).map(ch => (
              <div key={ch} style={{ marginBottom: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500 }}>{ch}</span>
                  <span style={{ fontSize: 11.5, fontFamily: 'var(--mono)' }}>{fmtM(data.chRev[ch])}</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: data.chGM[ch] > 0.5 ? C.green : data.chGM[ch] > 0.25 ? C.amber : C.red, width: fmtPct(data.chRev[ch] / totalRev) }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--t3)' }}>{fmtPct(data.chRev[ch] / totalRev)} of rev</span>
                  <span className={`badge ${data.chGM[ch] > 0.5 ? 'bg' : data.chGM[ch] > 0.25 ? 'ba' : 'br'}`}>GM: {fmtPct(data.chGM[ch])}</span>
                </div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Blended GP</span>
              <span style={{ fontSize: 11.5, fontFamily: 'var(--mono)', fontWeight: 600 }}>{fmtM(totalGP)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">USA Inc — Product Gross Margin %</div>
          <div className="card-sub">Blended across all channels</div>
        </div>
        <div className="card-body"><canvas ref={prodRef} height={265} /></div>
      </div>
    </div>
  );
}
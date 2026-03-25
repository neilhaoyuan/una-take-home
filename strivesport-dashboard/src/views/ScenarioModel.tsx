import { useState, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { WorkspaceData } from '../types';
import { fmtM, fmtPct, sum, MONTHS, CHART_COLORS as C, baseChartOptions as bO } from '../utils/format';
import { useChart } from '../hooks/useChart';

interface Props { data: WorkspaceData; }

export default function ScenarioModel({ data }: Props) {
  const [revGrowth, setRevGrowth] = useState(0);
  const [cogsSave,  setCogsSave]  = useState(0);
  const [mixShift,  setMixShift]  = useState(0);
  const [opexChg,   setOpexChg]   = useState(0);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const ur = sum(data.usaRev),  pr = sum(data.premRev);
  const ucr = sum(data.usaCogs) / ur;
  const pcr = sum(data.premCogs) / pr;
  const bRev = ur + pr;
  const bGP  = ur * (1 - ucr) + pr * (1 - pcr);
  const bOp  = sum(data.usaOpex) + sum(data.premOpex);
  const bDep = sum(data.usaDepr) + sum(data.premDepr);
  const bEB  = bGP + bOp + bDep;

  const sRev = bRev * (1 + revGrowth / 100);
  const sCR  = ((ucr + pcr) / 2) * (1 - cogsSave / 100) * (1 - mixShift / 100 * 0.06);
  const sGP  = sRev * (1 - sCR);
  const sEB  = sGP + bOp * (1 + opexChg / 100) + bDep;

  const bGPm = data.usaRev.map((_, i) => (data.usaRev[i] - data.usaCogs[i]) + (data.premRev[i] - data.premCogs[i]));
  const sGPm = bGPm.map(v => v * (sGP / bGP));

  useChart(chartRef, () => new Chart(chartRef.current!, {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'Base Plan', data: bGPm, borderColor: '#d1d5db', borderWidth: 2, borderDash: [5, 4], tension: .3, fill: false, pointRadius: 0 },
        { label: 'Scenario',  data: sGPm, borderColor: C.navy,   borderWidth: 2.5, tension: .3, fill: false, pointRadius: 4, pointBackgroundColor: C.navy },
      ],
    },
    options: { ...bO, scales: { ...bO.scales, y: { ...bO.scales.y, ticks: { ...bO.scales.y.ticks, callback: (v: number) => `$${(v / 1e6).toFixed(1)}M` } } } } as any,
  }), [revGrowth, cogsSave, mixShift, opexChg]);

  const delta = (sc: number, base: number, pct = false) => {
    const d = sc - base;
    const cls = d >= 0 ? 'np' : 'nn';
    const s = pct ? fmtPct(d) : fmtM(d);
    return <span className={cls}>{d >= 0 ? '+' : ''}{s}</span>;
  };

  const sliders = [
    { label: 'Revenue Growth vs Plan',  val: revGrowth, set: setRevGrowth, min: -30, max: 30,  step: 1,   u: '%',  lo: '−30%',      hi: '+30%'       },
    { label: 'COGS Efficiency Gain',    val: cogsSave,  set: setCogsSave,  min: -10, max: 15,  step: 0.5, u: '%',  lo: '−10%',      hi: '+15%'       },
    { label: 'Online Mix Shift',        val: mixShift,  set: setMixShift,  min: -15, max: 20,  step: 1,   u: 'pp', lo: 'Less online', hi: 'More online' },
    { label: 'OpEx Change',             val: opexChg,   set: setOpexChg,   min: -20, max: 20,  step: 1,   u: '%',  lo: '−20%',      hi: '+20%'       },
  ];

  const sensRows = [
    ['Base Plan',            0, 0, 0, 0],
    ['Revenue +10%',        10, 0, 0, 0],
    ['COGS −5%',             0, 5, 0, 0],
    ['Both combined',       10, 5, 0, 0],
    ['Revenue −10% (bear)', -10, 0, 0, 0],
    ['Cost inflation +5%',   0, -5, 0, 0],
  ] as [string, number, number, number, number][];

  return (
    <div className="page fade">
      <div className="page-header">
        <div className="page-title">Scenario Model</div>
        <div className="page-subtitle">Adjust levers to model different budget outcomes in real time</div>
      </div>

      <div className="ga">
        {/* Sliders panel */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 3 }}>Planning Levers</div>
          <div className="card-sub" style={{ marginBottom: 16 }}>Drag to adjust. Outputs update instantly.</div>
          {sliders.map(sl => (
            <div className="slider-group" key={sl.label}>
              <div className="slider-row">
                <span className="slider-label">{sl.label}</span>
                <span className="slider-chip">{sl.val >= 0 && sl.u !== 'pp' ? '+' : ''}{sl.val}{sl.u}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.val}
                onChange={e => sl.set(parseFloat(e.target.value))} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: 'var(--t3)', marginTop: 3 }}>
                <span>{sl.lo}</span><span>{sl.hi}</span>
              </div>
            </div>
          ))}
          <button className="btn btn-g" style={{ width: '100%', marginTop: 4 }}
            onClick={() => { setRevGrowth(0); setCogsSave(0); setMixShift(0); setOpexChg(0); }}>
            Reset to Base
          </button>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {[
              { l: 'Consolidated Revenue', b: bRev, s: sRev },
              { l: 'Gross Profit',         b: bGP,  s: sGP  },
              { l: 'Gross Margin %',       b: bGP / bRev, s: sGP / sRev, p: true },
              { l: 'EBIT Estimate',        b: bEB,  s: sEB  },
            ].map(m => (
              <div className="result-tile" key={m.l}>
                <div className="rl">{m.l}</div>
                <div className="rv">{m.p ? fmtPct(m.s) : fmtM(m.s)}</div>
                <div className="rd">vs base: {delta(m.s, m.b, m.p)}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Gross Profit — Base vs Scenario</div>
              <div className="card-sub">Monthly consolidated</div>
            </div>
            <div className="card-body"><canvas ref={chartRef} height={200} /></div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Sensitivity Table</div></div>
            <div className="card-flush tw">
              <table>
                <thead><tr><th>Scenario</th><th>Revenue</th><th>Gross Profit</th><th>GM%</th><th>EBIT</th></tr></thead>
                <tbody>
                  {sensRows.map(([lbl, rg, cs, , oc], i) => {
                    const r = bRev * (1 + rg / 100);
                    const cr = ((ucr + pcr) / 2) * (1 - cs / 100);
                    const gp = r * (1 - cr);
                    const eb = gp + bOp * (1 + oc / 100) + bDep;
                    return (
                      <tr key={i} className={i === 0 ? 'row-total' : ''}>
                        <td style={{ fontWeight: i === 0 ? 600 : 400 }}>{lbl}</td>
                        <td>{fmtM(r)}</td>
                        <td className={gp >= bGP ? 'np' : 'nn'}>{fmtM(gp)}</td>
                        <td className="np">{fmtPct(gp / r)}</td>
                        <td className={eb >= bEB ? 'np' : 'nn'}>{fmtM(eb)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
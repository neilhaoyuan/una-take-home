export const fmtM = (n: number | null): string => {
  if (n == null) return '—';
  const a = Math.abs(n);
  const s = n < 0 ? '-' : '';
  if (a >= 1e6) return `${s}$${(a / 1e6).toFixed(1)}M`;
  if (a >= 1e3) return `${s}$${Math.round(a / 1e3)}K`;
  return `${s}$${Math.round(a).toLocaleString()}`;
};

export const fmtFull = (n: number | null): string => {
  if (n == null) return '—';
  const a = Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  return n < 0 ? `($${a})` : `$${a}`;
};

export const fmtPct = (n: number | null, dp = 1): string => {
  if (n == null) return '—';
  return `${(n * 100).toFixed(dp)}%`;
};

export const sum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0);

export const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

export const CHART_COLORS = {
  navy:  '#4f46e5',
  amber: '#f59e0b',
  green: '#10b981',
  muted: '#d1d5db',
  red:   '#ef4444',
  blue:  '#3b82f6',
  teal:  '#06b6d4',
};

export const chartFont = {
  family: "'Inter', -apple-system, sans-serif",
  size: 11,
};

export const baseChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: { font: chartFont, color: '#6b7280', boxWidth: 10, boxHeight: 10, padding: 12 },
    },
    tooltip: {
      bodyFont: chartFont,
      titleFont: { ...chartFont, weight: '600' },
      padding: 8,
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 5,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
    },
  },
  scales: {
    x: {
      grid: { color: '#f3f4f6', drawBorder: false },
      ticks: { font: chartFont, color: '#9ca3af' },
    },
    y: {
      grid: { color: '#f3f4f6', drawBorder: false },
      ticks: { font: chartFont, color: '#9ca3af' },
    },
  },
};
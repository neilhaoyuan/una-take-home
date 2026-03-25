import { useEffect, useRef, RefObject } from 'react';
import { Chart } from 'chart.js/auto';

export function useChart(
  ref: RefObject<HTMLCanvasElement | null>,
  build: () => Chart,
  deps: unknown[]
) {
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = build();
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
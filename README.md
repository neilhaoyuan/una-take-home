# StriveSport FP&A Dashboard

Una Platform Analyst take-home assignment, 1 hour, started 12:44 AM ended 1:39 AM.

Una's goal to replace legacy Excel with new AI-powered technology is really interesting. So here's my response, a little MVP that uses AI to power FP&A planning. 

This is an interactive dashboard using the StriveSport 2027 workbook data, and in the future, any type of company data!

**Live demo:** url coming

---

## Views

- **Overview** — KPI cards + 4 charts (revenue, GM%, net income, seasonality)
- **Monthly P&L** — editable cells that recalculate gross profit and net income live
- **Revenue Bridge** — 2026 → 2027 waterfall + YoY monthly table
- **Channels & Products** — revenue mix, GM% by channel, all 10 SKUs ranked
- **Scenario Model** — 4 sliders (revenue, COGS, channel mix, OpEx) that update GP and EBIT in real time
- **Risks & Insights** — risk register with likelihood and impact ratings
- **Import Data** — MVP mockup of what an Excel import flow would look like

An AI chat panel (bottom-right) answers questions about the live data. Runs locally by default; add a Gemini key to upgrade.

## Stack

React + TypeScript + Vite + Chart.js

## Running locally

```bash
cd strivesport-dashboard
npm install
npm run dev
```

To enable Gemini: copy `.env.example` → `.env.local`, paste your key, restart.

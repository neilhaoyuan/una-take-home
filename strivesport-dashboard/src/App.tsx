import { useState, useCallback, type ReactElement } from 'react';
import { Workspace, PageId, WorkspaceData } from './types';
import { Landing, Topbar } from './components/Landing';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat';
import Overview from './views/Overview';
import { MonthlyPL } from './views/MonthlyPL';
import RevenueBridge from './views/RevenueBridge';
import Channels from './views/Channels';
import ScenarioModel from './views/ScenarioModel';
import { Risks, ImportData } from './views/RisksAndImport';

function Dashboard({ ws, onBack }: { ws: Workspace; onBack: () => void }) {
  const [page, setPage] = useState<PageId>('overview');
  const [data, setData] = useState<WorkspaceData>(ws.data);
  const [chatOpen, setChatOpen] = useState(false);

  const onEdit = useCallback((key: keyof WorkspaceData, idx: number, val: number) => {
    setData(prev => {
      const arr = [...(prev[key] as number[])];
      arr[idx] = val;
      return { ...prev, [key]: arr };
    });
  }, []);

  const liveWs: Workspace = { ...ws, data };

  const views: Record<PageId, ReactElement> = {
    overview: <Overview data={data} />,
    pl:       <MonthlyPL data={data} onEdit={onEdit} />,
    bridge:   <RevenueBridge data={data} />,
    channels: <Channels data={data} />,
    scenario: <ScenarioModel data={data} />,
    risks:    <Risks />,
    import:   <ImportData />,
  };

  return (
    <div className="shell">
      <Sidebar ws={ws} active={page} setActive={setPage} onBack={onBack} />
      <div className="main">
        <Topbar page={page} ws={ws} />
        {views[page]}
      </div>
      <AIChat ws={liveWs} open={chatOpen} onToggle={() => setChatOpen(o => !o)} />
    </div>
  );
}

export default function App() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  return workspace
    ? <Dashboard ws={workspace} onBack={() => setWorkspace(null)} />
    : <Landing onSelect={setWorkspace} />;
}
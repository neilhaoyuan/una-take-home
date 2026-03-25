export interface WorkspaceData {
  usaRev: number[];
  usaCogs: number[];
  usaOpex: number[];
  usaDepr: number[];
  premRev: number[];
  premCogs: number[];
  premOpex: number[];
  premDepr: number[];
  usa26Rev: number[];
  prem26Rev: number[];
  seas: number[];
  chRev: Record<string, number>;
  chGM: Record<string, number>;
  products: [string, number][];
}

export interface Workspace {
  id: string;
  name: string;
  plan: string;
  color: string;
  initials: string;
  tags: string[];
  data: WorkspaceData;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  ts: Date;
}

export type PageId =
  | 'overview'
  | 'pl'
  | 'bridge'
  | 'channels'
  | 'scenario'
  | 'risks'
  | 'import';
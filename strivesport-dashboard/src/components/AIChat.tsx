import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Workspace } from '../types';
import { fmtM, fmtPct, sum } from '../utils/format';

// ─────────────────────────────────────────────────────────────
//  GEMINI CONFIG
//  1. Paste your Gemini API key as GEMINI_KEY
//  2. Set USE_GEMINI = true
//  The data context is auto-injected into the system prompt.
// ─────────────────────────────────────────────────────────────
const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY as string | undefined;
const USE_GEMINI = !!GEMINI_KEY;

async function askGemini(history: ChatMessage[], ws: Workspace): Promise<string> {
  const d = ws.data;
  const systemPrompt = `You are a sharp FP&A analyst embedded in a planning dashboard for ${ws.name}.
FY2027 Plan context:
- USA Inc revenue: ${fmtM(sum(d.usaRev))} (2026: ${fmtM(sum(d.usa26Rev))})
- Premium USA revenue: ${fmtM(sum(d.premRev))} (2026: ${fmtM(sum(d.prem26Rev))})
- USA Inc gross margin: ${fmtPct((sum(d.usaRev) - sum(d.usaCogs)) / sum(d.usaRev))}
- Premium gross margin: ${fmtPct((sum(d.premRev) - sum(d.premCogs)) / sum(d.premRev))}
- Channel GM: Retail 62.5%, Online 58.5%, Wholesale 16.5%
- Q4 (Nov+Dec) = ~26% of full-year consolidated revenue
- USA Inc net income: ${fmtM(sum(d.usaRev.map((_, i) => d.usaRev[i] - d.usaCogs[i] - d.usaOpex[i] - d.usaDepr[i])))}
Reply in 2-4 sentences unless asked for more. Use specific numbers.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY ?? ''}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: history.map(m => ({
          role: m.role === 'ai' ? 'model' : 'user',
          parts: [{ text: m.text }],
        })),
      }),
    }
  );
  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response from Gemini.';
}

function localReply(question: string, ws: Workspace): string {
  const d = ws.data;
  const q = question.toLowerCase();
  const urf = sum(d.usaRev), prf = sum(d.premRev);
  const ucf = sum(d.usaCogs), pcf = sum(d.premCogs);
  const ugm = (urf - ucf) / urf, pgm = (prf - pcf) / prf;
  const uni = sum(d.usaRev.map((_, i) => d.usaRev[i] - d.usaCogs[i] - d.usaOpex[i] - d.usaDepr[i]));

  if (/rev/.test(q))
    return `USA Inc plans **${fmtM(urf)}** and Premium **${fmtM(prf)}**, for a consolidated **${fmtM(urf + prf)}**. That's a ~14× step-up over 2026 actuals of **${fmtM(sum(d.usa26Rev) + sum(d.prem26Rev))}**.`;
  if (/margin|gm|gross/.test(q))
    return `USA Inc GM is **${fmtPct(ugm)}**, Premium is **${fmtPct(pgm)}**. Biggest drag is Wholesale at only 16.5% GM vs 62.5% Retail. Every 5pp mix shift toward Retail adds ~$320K gross profit.`;
  if (/wholesale|channel/.test(q))
    return `Wholesale is ~35% of revenue but earns only **16.5% GM**. ProTeamOutfitters is the largest contract (52K units, 22% discount). Retail earns **62.5%** and Online **58.5%** — grow those faster.`;
  if (/risk|concern/.test(q))
    return `Top risks: (1) **Q4 concentration** — Nov+Dec = 26% of FY. (2) **Wholesale dilution** — growing wholesale tanks blended margin. (3) **Model error** — Premium Nov workforce has a −$148M formula bug in the 3FS.`;
  if (/net income|profit\b/.test(q))
    return `USA Inc net income is projected at **${fmtM(uni)}**, up from ~$117K in 2026. Peak months are Nov and Dec due to seasonality weighting.`;
  if (/q4|holiday|season/.test(q))
    return `Q4 is critical — Nov+Dec represent **${fmtPct((d.usaRev[10] + d.usaRev[11] + d.premRev[10] + d.premRev[11]) / (urf + prf))}** of consolidated FY revenue. A supply miss in Q4 has outsized P&L impact.`;
  if (/best|top|strong/.test(q))
    return `Strongest USA Inc products: **Lightweight Windbreakers** (68% GM) and **Zip-Up Hoodies** (63% GM). Weakest is **High-Waisted Leggings** at ~38.8% blended GM.`;
  if (/hi|hello|hey/.test(q))
    return `Hi! I'm your FP&A analyst for **${ws.name}**. Ask me about revenue, margins, channels, products, or risks.`;
  return `Consolidated 2027 revenue: **${fmtM(urf + prf)}**, blended GM: **${fmtPct(((urf - ucf) + (prf - pcf)) / (urf + prf))}**, USA Inc net income: **${fmtM(uni)}**. Ask me anything.`;
}

function renderBold(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

interface Props {
  ws: Workspace;
  open: boolean;
  onToggle: () => void;
}

export default function AIChat({ ws, open, onToggle }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: `Hi! I'm your FP&A analyst for **${ws.name}**. Ask me about revenue, margins, risks, channels, or specific products.`,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    const userMsg: ChatMessage = { role: 'user', text: q, ts: new Date() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    let answer: string;
    try {
      if (USE_GEMINI) {
        answer = await askGemini([...messages, userMsg], ws);
      } else {
        await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
        answer = localReply(q, ws);
      }
    } catch {
      answer = 'Something went wrong. Check your Gemini API key.';
    }
    setLoading(false);
    setMessages(m => [...m, { role: 'ai', text: answer, ts: new Date() }]);
  }, [input, messages, ws]);

  const suggestions = ['Gross margin?','Top risks?','Best products?','Q4 outlook','Channel breakdown'];

  return (
    <>
      <button className={`chat-fab${open ? ' open' : ''}`} onClick={onToggle}>
        {open ? '×' : '✦'}
      </button>

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div className="chat-avatar">A</div>
              <div>
                <div className="chat-name">AI Analyst</div>
                <div className="chat-status">
                  <div className="chat-dot" />
                  {USE_GEMINI ? 'Gemini Pro' : 'Local mode · set VITE_GEMINI_KEY to enable AI'}
                </div>
              </div>
            </div>
            <button className="chat-close" onClick={onToggle}>×</button>
          </div>

          {messages.length === 1 && (
            <div className="chat-suggestions">
              {suggestions.map(s => (
                <button key={s} className="chat-suggestion" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div
                  className="chat-bubble"
                  dangerouslySetInnerHTML={{ __html: renderBold(m.text) }}
                />
                <div className="chat-time">
                  {m.ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask about revenue, margins, risks..."
              value={input}
              rows={1}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
              }}
            />
            <button
              className="chat-send"
              onClick={() => send()}
              disabled={!input.trim() || loading}
            >↑</button>
          </div>
        </div>
      )}
    </>
  );
}
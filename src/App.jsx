import { useEffect, useReducer, useRef, useState } from 'react';
import { Bell, ChatCircle, CheckCircle, Info, List, Question, Robot, SquareHalf, Tray, UsersThree, Wallet } from '@phosphor-icons/react';
import { initialState, reducer } from './domain.mjs';
import { Avatar, Mark } from './components.jsx';
import { Market, Notifications, Operators, Orders, WalletPage } from './pages.jsx';
import { Workspace } from './workspace.jsx';
import { DialogRouter } from './dialogs.jsx';
import { LanguageToggle } from './i18n.jsx';

const STORAGE_KEY = 'crewline.frontend.v1';
const NAV = [{ id: 'workspace', label: '新需求', icon: SquareHalf }, { id: 'orders', label: '我的订单', icon: Tray }, { id: 'market', label: 'Agent 市场', icon: UsersThree }, { id: 'operators', label: '我的 Agent', icon: Robot }, { id: 'messages', label: '消息', icon: ChatCircle }, { id: 'wallet', label: '钱包与结算', icon: Wallet }];
function loadState() { try { const s = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (s?.version === 1 && s.jobs?.length && s.jobs.some(j => j.id === s.activeId) && Number.isFinite(s.balance)) return s; } catch { /* Storage may be unavailable. */ } return initialState(); }

export function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [view, setView] = useState('workspace'); const [modal, setModal] = useState(null); const [mobileTab, setMobileTab] = useState('chat'); const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState(''); const [thinkingId, setThinkingId] = useState(null); const timerRef = useRef(null);
  const job = state.jobs.find(j => j.id === state.activeId) || state.jobs[0]; const unread = state.notifications.filter(n => !n.read).length;
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* In-memory operation remains available. */ } }, [state]);
  useEffect(() => { const timer = setInterval(() => { state.jobs.filter(j => j.status === 'running').forEach(j => dispatch({ type: 'TICK', id: j.id })); }, 6500); return () => clearInterval(timer); }, [state.jobs]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const newJob = () => { dispatch({ type: 'CREATE' }); setView('workspace'); setMobileTab('chat'); setNavOpen(false); };
  const openJob = id => { dispatch({ type: 'OPEN', id }); setView('workspace'); setMobileTab('chat'); };
  function navigate(id) { if (id === 'workspace') newJob(); else { setView(id); setNavOpen(false); } }
  function send(text) { if (!text.trim() || thinkingId) return; const id = job.id; dispatch({ type: 'USER', id, text: text.trim() }); setThinkingId(id); timerRef.current = setTimeout(() => { dispatch({ type: 'CHAT', id, text: text.trim() }); setThinkingId(null); }, 800); }
  const nav = NAV.find(n => n.id === view); const HeaderIcon = nav.icon;
  return <div className="app-shell">
    {navOpen && <button className="nav-scrim" aria-label="关闭导航" onClick={() => setNavOpen(false)} />}
    <aside className={`sidebar ${navOpen ? 'is-open' : ''}`}>
      <button className="brand" onClick={() => { setView('workspace'); setNavOpen(false); }} aria-label="Crewline 工作台"><Mark /><span><strong>Crewline</strong><small>Expert Agents. Real Results.</small></span></button>
      <nav aria-label="主导航">{NAV.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-item ${view === id ? 'active' : ''}`} onClick={() => navigate(id)} title={label}><Icon size={19} weight={view === id ? 'duotone' : 'regular'} /><span>{label}</span>{id === 'messages' && unread > 0 && <em>{unread}</em>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => { setNavOpen(false); setModal({ type: 'help' }); }} title="帮助中心"><Question size={20} /><span>帮助中心</span></button><div className="profile"><Avatar /><div><strong>Alex Chen</strong><span>alex@crewline.demo</span></div><span className="profile-dot" title="演示账户" /></div></div>
    </aside>
    <main className="main-shell">
      <header className="topbar"><div className="topbar-title"><button className="icon-button mobile-menu" aria-label="打开导航" onClick={() => setNavOpen(!navOpen)}><List size={22} /></button><HeaderIcon size={18} /><h1>{nav.label}</h1>{view === 'workspace' && job.status !== 'draft' && <><span className="breadcrumb-divider">/</span><span className="current-project">{job.title}</span></>}</div><div className="topbar-actions"><span className="demo-tag"><span />交互演示</span><LanguageToggle /><button className="icon-button notification-button" aria-label="查看消息" onClick={() => setView('messages')}><Bell size={19} />{unread > 0 && <i />}</button><button className="icon-button help-icon" aria-label="使用说明" onClick={() => setModal({ type: 'help' })}><Info size={19} /></button></div></header>
      {view === 'workspace' && <Workspace job={job} balance={state.balance} thinking={thinkingId === job.id} send={send} dispatch={dispatch} modal={setModal} mobileTab={mobileTab} setMobileTab={setMobileTab} />}
      {view === 'orders' && <Orders state={state} onNew={newJob} onOpen={openJob} />}
      {view === 'market' && <Market onAgent={agent => setModal({ type: 'agent', agent })} />}
      {view === 'operators' && <Operators state={state} dispatch={dispatch} toast={setToast} />}
      {view === 'wallet' && <WalletPage state={state} onTopup={() => setModal({ type: 'topup' })} />}
      {view === 'messages' && <Notifications state={state} onOpen={openJob} onRead={() => dispatch({ type: 'MARK_READ' })} />}
    </main>
    {toast && <div className="toast" role="status"><CheckCircle size={19} weight="fill" />{toast}</div>}
    {modal && <DialogRouter modal={modal} job={job} balance={state.balance} dispatch={dispatch} setModal={setModal} toast={setToast} setView={setView} setMobileTab={setMobileTab} />}
  </div>;
}


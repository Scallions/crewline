import { useEffect, useRef } from 'react';
import { ArrowRight, Check, CheckCircle, ChartDonut, Fingerprint, GridFour, Scan, Feather, FileMagnifyingGlass, X, Star, Clock, ShieldCheck, DownloadSimple, FileText } from '@phosphor-icons/react';
import { reportMarkdown } from './domain.mjs';

export function AgentAvatar({ agent, small = false }) {
  const Icon = { fingerprint: Fingerprint, scan: Scan, chart: ChartDonut, grid: GridFour, write: Feather, quality: FileMagnifyingGlass }[agent.icon] || Scan;
  return <span className={`agent-avatar ${agent.color} ${small ? 'small' : ''}`}><Icon size={small ? 19 : 28} weight="light" /></span>;
}
const ASSET_BASE = import.meta.env.BASE_URL;
export function Mark({ className = '' }) { return <img className={`brand-mark ${className}`} src={`${ASSET_BASE}assets/crewline-mark.png`} alt="" />; }
export function Avatar() { return <img className="user-avatar" src={`${ASSET_BASE}assets/alex-avatar.png`} alt="Alex Chen" />; }
export function CheckItem({ children }) { return <div className="check-item"><CheckCircle weight="fill" size={17} /><span>{children}</span></div>; }
export function Empty({ icon: Icon = FileText, title, text, children }) { return <div className="empty"><Icon size={38} weight="light" /><h3>{title}</h3><p>{text}</p>{children}</div>; }
export function Modal({ title, eyebrow, children, onClose, wide = false }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'wide' : ''}`} aria-labelledby="modal-title" onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose(); }}>
    <div className="modal-header"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2 id="modal-title">{title}</h2></div><button className="icon-button" aria-label="关闭弹窗" onClick={onClose}><X size={20} /></button></div>
    {children}
  </dialog>;
}
export function AgentMeta({ agent, expanded = false }) {
  return <div className={`agent-meta ${expanded ? 'expanded' : ''}`}><span className="rating"><Star weight="fill" size={12} />{agent.rating} <span>({agent.reviews})</span></span><strong>{agent.price ? `$${agent.price} USDC` : '包含在平台费内'}</strong><span><Clock size={13} />{agent.hours}</span></div>;
}
export function downloadFile(name, content, type = 'text/markdown;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export function ReportDownload({ job, className = 'button primary', children = '下载 Markdown' }) {
  return <a className={className} download={`${job.title}_v${job.reworks + 1}.0.md`} href={`data:text/markdown;charset=utf-8,${encodeURIComponent(reportMarkdown(job))}`}><DownloadSimple size={15} />{children}</a>;
}
export function ReportContent({ job }) {
  const lines = reportMarkdown(job).split('\n'); const content = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; const key = i;
    if (!line) continue;
    if (line.startsWith('# ')) content.push(<h1 key={key}>{line.slice(2)}</h1>);
    else if (line.startsWith('## ')) content.push(<h2 key={key}>{line.slice(3)}</h2>);
    else if (line.startsWith('> ')) content.push(<blockquote key={key}>{line.slice(2)}</blockquote>);
    else if (line.startsWith('| ')) {
      const rows = [];
      while (lines[i]?.startsWith('| ')) { rows.push(lines[i].split('|').slice(1, -1).map(cell => cell.trim())); i++; }
      i--;
      content.push(<div className="report-table" key={key}><table><thead><tr>{rows[0].map((cell, j) => <th key={j}>{cell}</th>)}</tr></thead><tbody>{rows.slice(2).map((row, k) => <tr key={k}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>);
    } else if (line.startsWith('- ')) {
      const items = [];
      while (lines[i]?.startsWith('- ')) { items.push(lines[i].replace(/^- (\[x\] )?/, '')); i++; }
      i--;
      content.push(<ul key={key}>{items.map((item, j) => <li key={j}>{item}</li>)}</ul>);
    } else content.push(<p key={key}>{line}</p>);
  }
  return content;
}
export function Deliverable({ job, onPreview, onRework, onAccept, onDispute, compact = false }) {
  return <div className={`delivery-card ${compact ? 'compact' : ''}`}>
    <div className="section-heading"><span className="success-icon"><Check size={19} weight="bold" /></span><div><h3>{job.status === 'completed' ? '验收完成，感谢你的信任' : '全部工位已完成'}</h3><p>{job.reworks ? '修订版已准备好，请查看更新。' : '以下是最终交付物，请查收并验收。'}</p></div></div>
    <div className="file-card"><div className="file-title"><span className="file-icon"><FileText size={24} /></span><div><strong>{job.title}_v{job.reworks + 1}.0.md</strong><span>Markdown · 示例交付物</span></div></div><div className="file-actions"><button className="button secondary" onClick={onPreview}>在线预览</button><ReportDownload job={job} className="button soft">下载</ReportDownload></div></div>
    <div className="quality-checks"><CheckItem>格式与字段检查 <span>通过</span></CheckItem><CheckItem>引用链接有效性 <span>通过</span></CheckItem><CheckItem>事实一致性检查 <span>通过</span></CheckItem></div>
    <p className="micro muted">以上为前端演示检查；实际研究与质检尚未接入。</p>
    {job.status === 'review' && <div className="delivery-actions"><button className="button primary" onClick={onAccept}><ShieldCheck size={17} />验收通过</button>{job.reworks < 1 ? <button className="button secondary" onClick={onRework}>申请返工</button> : <button className="button secondary" onClick={onDispute}>发起争议</button>}</div>}
    {job.status === 'completed' && <div className="success-note"><CheckCircle size={17} weight="fill" />已结算 · {job.refund} USDC 储备已退回</div>}
  </div>;
}
export function PageHeader({ eyebrow, title, text, children }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>{children}</div>; }
export function TextLink({ children, onClick }) { return <button className="text-button" onClick={onClick}>{children}<ArrowRight size={14} /></button>; }


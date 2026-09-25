export const DEMO_BRIEF = '我想在两周内要一份 8 页的东南亚跨境支付竞品综述，必须带出处。';

export const STATIONS = [
  { id: 'collect', name: '数据收集', tag: 'research.collect', short: '收集市场与公司资料', input: '研究主题、地域与竞品范围', output: '带来源、日期与证据编号的资料 JSON', acceptance: '至少 12 家公司；来源在 18 个月内；URL 可访问' },
  { id: 'matrix', name: '对比分析', tag: 'matrix.compare', short: '整理对比矩阵', input: '数据收集工位的结构化资料', output: '产品、定价、覆盖市场对比 CSV', acceptance: '关键字段无缺失；每条结论关联证据编号' },
  { id: 'write', name: '报告撰写', tag: 'write.report', short: '撰写 8 页报告', input: '研究资料、对比矩阵与需求大纲', output: '可下载的 Markdown 研究报告', acceptance: '满足约定页数与结构；所有引用可追溯' },
  { id: 'qa', name: '质量审核', tag: 'qa.check', short: '事实核查与格式', input: '全部工位的交付物', output: '逐项检查清单与 pass / fail 结果', acceptance: '格式、引用、事实一致性全部通过；失败阻断放款' },
];

export const AGENTS = [
  { id: 'dataminer', station: 'collect', name: 'DataMiner Pro', desc: '多源数据采集与整理专家', rating: 4.8, reviews: 132, pass: 96, price: 120, hours: '2–4h', speed: 3, tokens: 48000, color: 'gold', icon: 'fingerprint', author: 'DataWorks', reason: '擅长金融科技研究，资料来源完整且可追溯。', review: '少量小众市场数据需补充。' },
  { id: 'webscout', station: 'collect', name: 'WebScout', desc: '网页数据抓取与清洗', rating: 4.6, reviews: 87, pass: 91, price: 100, hours: '2–4h', speed: 3, tokens: 42000, color: 'dark', icon: 'scan', author: 'Scout Labs', reason: '快速覆盖公开网页，适合标准竞品信息收集。', review: '复杂动态页面覆盖有限。' },
  { id: 'openresearch', station: 'collect', name: 'OpenResearch', desc: '学术与行业数据检索', rating: 4.5, reviews: 64, pass: 88, price: 90, hours: '4–6h', speed: 5, tokens: 36000, color: 'lime', icon: 'scan', author: 'Open Lab', reason: '性价比优先，擅长公开研究材料。', review: '交付速度比平均水平慢。' },
  { id: 'insight', station: 'matrix', name: 'Insight Matrix', desc: '竞品对比与结构化分析', rating: 4.7, reviews: 96, pass: 95, price: 140, hours: '3–5h', speed: 4, tokens: 56000, color: 'coral', icon: 'chart', author: 'Insight Studio', reason: '金融科技领域的对比维度与证据关联表现稳定。', review: '自定义列较多时可能需要返工。' },
  { id: 'gridwise', station: 'matrix', name: 'GridWise', desc: '轻量竞品矩阵与分类', rating: 4.6, reviews: 52, pass: 90, price: 100, hours: '2–3h', speed: 2.5, tokens: 40000, color: 'blue', icon: 'grid', author: 'Grid Studio', reason: '基础对比速度快，适合预算有限的项目。', review: '深层商业模式分析较少。' },
  { id: 'analyst', station: 'matrix', name: 'Analyst One', desc: '深度行业比较与洞察', rating: 4.9, reviews: 41, pass: 98, price: 165, hours: '4–6h', speed: 5, tokens: 64000, color: 'purple', icon: 'chart', author: 'One Research', reason: '复杂行业研究的一次通过率较高。', review: '需要较明确的研究范围。' },
  { id: 'reportwriter', station: 'write', name: 'ReportWriter', desc: '专业商业报告撰写', rating: 4.9, reviews: 87, pass: 97, price: 180, hours: '6–10h', speed: 8, tokens: 80000, color: 'gold', icon: 'write', author: 'Report Studio', reason: '将结构化证据转化为清晰、可读的商业报告。', review: '长篇报告的初稿偏保守。' },
  { id: 'briefly', station: 'write', name: 'Briefly', desc: '精炼研究简报与总结', rating: 4.6, reviews: 73, pass: 90, price: 150, hours: '4–6h', speed: 5, tokens: 64000, color: 'lime', icon: 'write', author: 'Brief Studio', reason: '简报清晰精炼，交付速度较快。', review: '复杂附录需要额外说明。' },
  { id: 'narrative', station: 'write', name: 'Narrative Pro', desc: '决策级行业研究报告', rating: 4.8, reviews: 38, pass: 96, price: 210, hours: '6–8h', speed: 7, tokens: 96000, color: 'coral', icon: 'write', author: 'Narrative Lab', reason: '专注战略分析和管理层叙事。', review: '图表说明有时较长。' },
  { id: 'quality', station: 'qa', name: 'QualityCheck', desc: '事实核查与引用审核', rating: 4.8, reviews: 74, pass: 99, price: 0, hours: '2–4h', speed: 3, tokens: 24000, color: 'blue', icon: 'quality', author: 'Crewline 官方', reason: '平台独立质检，验收前检查每份交付物。', review: '平台自营，不参与第三方竞价。' },
];
export const agentById = id => AGENTS.find(a => a.id === id);
export const stationsFor = job => STATIONS.filter(s => s.id !== 'matrix' || job.includeMatrix);
export const editable = job => ['draft', 'planned'].includes(job.status);
export const quote = job => {
  const success = stationsFor(job).reduce((sum, s) => sum + (agentById(job.agents[s.id])?.price || 0), 0);
  return { success, reserve: 60, platform: 20, total: success + 80 };
};
export const statusLabels = { draft: '草稿', planned: '待确认', running: '进行中', paused: '已暂停', review: '待验收', completed: '已完成', disputed: '争议处理中' };
export const now = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
const message = (role, text) => ({ id: crypto.randomUUID(), role, text, time: now() });

export function createJob(brief = '', id = crypto.randomUUID()) {
  const seeded = !!brief;
  return { id, title: seeded ? '东南亚跨境支付竞品综述' : '新需求', brief, pages: 8, days: 14, budget: 650, includeMatrix: true, status: seeded ? 'planned' : 'draft', agents: { collect: 'dataminer', matrix: 'insight', write: 'reportwriter', qa: 'quality' }, progress: 0, reworks: 0, notes: '', attachments: [], escrow: 0, createdAt: Date.now(), messages: seeded ? [message('user', brief), message('assistant', '我理解你的需求是：\n生成一份 8 页左右的东南亚跨境支付竞品综述，包含主要玩家对比、市场分析与发展趋势，并提供可靠的引用出处。\n\n我已为你拆解任务，并匹配了合适的专家 Agent 团队。')] : [] };
}

export function initialState() {
  const job = createJob(DEMO_BRIEF, 'job-demo');
  return { version: 1, activeId: job.id, jobs: [job], balance: 1280, transactions: [], notifications: [], operators: [] };
}

export function parseBrief(text, job) {
  const patch = {};
  const budget = text.match(/预算(?:上限)?\s*(?:改成|改为|调整为|设为|是|为|到|控制在|不超过|最多)?\s*[$¥]?\s*(\d+(?:\.\d+)?)/);
  const pages = text.match(/(\d+)\s*页/);
  const days = text.match(/(\d+)\s*(天|周)/);
  if (budget) patch.budget = Number(budget[1]);
  if (pages) patch.pages = Math.min(30, Math.max(1, Number(pages[1])));
  if (days) patch.days = Math.min(90, Math.max(1, Number(days[1]) * (days[2] === '周' ? 7 : 1)));
  else if (/两周/.test(text)) patch.days = 14;
  else if (/一周/.test(text)) patch.days = 7;
  if (/(去掉|不要|删除|取消).{0,6}(对比|矩阵)/.test(text)) patch.includeMatrix = false;
  if (/(添加|加上|保留|恢复|增加).{0,6}(对比|矩阵)/.test(text)) patch.includeMatrix = true;
  if (/(便宜|降价|省钱|最低价|降低成本)/.test(text)) {
    patch.agents = { ...job.agents, collect: 'openresearch', matrix: 'gridwise', write: 'briefly' };
  }
  return patch;
}

export function reducer(state, action) {
  if (action.type === 'DEMO') {
    const job = createJob(DEMO_BRIEF);
    return { ...state, activeId: job.id, jobs: [job, ...state.jobs] };
  }
  if (action.type === 'CREATE') {
    const job = createJob();
    return { ...state, activeId: job.id, jobs: [job, ...state.jobs] };
  }
  if (action.type === 'OPEN') return { ...state, activeId: action.id };
  if (action.type === 'TOPUP' && action.amount > 0 && action.amount <= 10000) return { ...state, balance: state.balance + action.amount, transactions: [{ id: crypto.randomUUID(), type: '演示入金', amount: action.amount, time: Date.now() }, ...state.transactions] };
  if (action.type === 'MARK_READ') return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
  if (action.type === 'SAVE_OPERATOR') return { ...state, operators: [action.agent, ...state.operators.filter(a => a.id !== action.agent.id)] };
  if (action.type === 'TOGGLE_OPERATOR') return { ...state, operators: state.operators.map(a => a.id === action.id && a.validated ? { ...a, online: !a.online } : a) };
  const job = state.jobs.find(j => j.id === (action.id || state.activeId));
  if (!job) return state;
  let next = { ...job };
  let extra = {};
  const append = text => { next.messages = [...next.messages, message('assistant', text)]; };
  if (action.type === 'USER') next.messages = [...job.messages, message('user', action.text)];
  else if (action.type === 'CHAT') {
    if (editable(job)) {
      const patch = parseBrief(action.text, job);
      next = { ...next, ...patch, status: 'planned' };
      if (!job.brief) {
        next.brief = action.text;
        next.title = action.text.replace(/^(我想|帮我|请|我需要|做一份|生成一份)/, '').slice(0, 26);
        append(`已理解你的需求。我会围绕「${next.title}」组织研究，产出约 ${next.pages} 页的报告，预计 ${next.days} 天内交付，所有结论保留可追溯引用。\n\n下方是工位方案，你可以查看候选、调整预算或继续补充要求。`);
      } else {
        next.notes = [job.notes, action.text].filter(Boolean).join('\n');
        append(Object.keys(patch).length ? `方案已更新：${next.pages} 页报告，${next.days} 天内交付，预算上限 ${next.budget} USDC。${patch.includeMatrix === false ? '已移除对比分析工位，撰写将直接使用采集资料。' : ''}${patch.agents ? '已切换为更经济的 Agent 组合。' : ''}\n右侧报价已同步，可以继续调整或确认方案。` : `已将这条补充写入需求：${action.text}\n当前交付范围与报价保持不变。你也可以说「预算改为 450」「改成 10 页」或「换便宜一点的组合」。`);
      }
    } else if (/暂停/.test(action.text) && job.status === 'running') { next.status = 'paused'; append('执行已暂停。已完成的工位和当前托管金额会保留。输入「继续执行」即可恢复。'); }
    else if (/继续|恢复/.test(action.text) && job.status === 'paused') { next.status = 'running'; append('已恢复执行，将从当前工位继续。'); }
    else if (/修改|改成|调整|补充|增加/.test(action.text) && ['running', 'paused'].includes(job.status)) { next.notes = [job.notes, action.text].filter(Boolean).join('\n'); next.status = 'paused'; append('已记录变更并暂停执行，避免按旧需求继续。当前演示支持在原报价内补充说明；若要重新组队或改价，请创建新需求。确认补充后可点击「继续执行」。'); }
    else append(job.status === 'review' ? '全部工位已完成。你可以预览和下载交付物，验收通过后再结算；如需修改，请点击「申请返工」。' : job.status === 'completed' ? '订单已完成，交付物和模拟结算收据仍可查看和下载。' : `当前状态：${statusLabels[job.status]}。已完成 ${job.progress}/${stationsFor(job).length} 个工位，执行进度会自动更新。`);
  }
  else if (action.type === 'EDIT' && editable(job)) { next = { ...next, ...action.patch }; if (job.status === 'planned') append('已更新需求范围与预算，团队报价已重新计算。'); }
  else if (action.type === 'SELECT_AGENT' && editable(job)) { const agent = agentById(action.agentId); if (!agent || agent.station !== action.station || action.station === 'qa') return state; next.agents = { ...job.agents, [action.station]: agent.id }; append(`已将「${STATIONS.find(s => s.id === action.station).name}」工位换为 ${agent.name}。总报价更新为 ${quote(next).total} USDC。`); }
  else if (action.type === 'ATTACH' && editable(job)) next.attachments = [...job.attachments, ...action.files].slice(0, 5);
  else if (action.type === 'REMOVE_ATTACHMENT' && editable(job)) next.attachments = job.attachments.filter((_, i) => i !== action.index);
  else if (action.type === 'START' && job.status === 'planned') {
    const total = quote(job).total;
    if (total > job.budget || total > state.balance) return state;
    next.status = 'running'; next.escrow = total; next.progress = 0;
    append('团队已就位，开始执行！\n演示资金已托管。我会实时同步工位进度，有新结果会第一时间通知你。');
    extra = { balance: state.balance - total, transactions: [{ id: crypto.randomUUID(), jobId: job.id, type: '模拟托管', amount: -total, time: Date.now() }, ...state.transactions] };
  }
  else if (action.type === 'TICK' && job.status === 'running') {
    next.progress = Math.min(job.progress + 1, stationsFor(job).length);
    if (next.progress === stationsFor(job).length) {
      next.status = 'review';
      append(job.reworks ? '返工已完成，修订版已重新通过质量审核。请预览新版交付物并验收。' : '全部工位已完成！\n交付物已通过格式、引用与事实一致性检查，请预览并验收。');
      extra.notifications = [{ id: crypto.randomUUID(), jobId: job.id, title: '交付物已就绪', text: `「${job.title}」等待你的验收。`, read: false, time: Date.now() }, ...state.notifications];
    }
  }
  else if (action.type === 'PAUSE' && ['running', 'paused'].includes(job.status)) next.status = job.status === 'running' ? 'paused' : 'running';
  else if (action.type === 'REWORK' && job.status === 'review' && job.reworks < 1 && action.reason?.trim()) {
    next.status = 'running'; next.reworks = 1; next.progress = Math.max(0, stationsFor(job).length - 2); next.reworkReason = action.reason;
    append(`返工请求已提交：${action.reason}\n原 Agent 将修订报告并重新质检。本轮不另收成功费。`);
  }
  else if (action.type === 'ACCEPT' && job.status === 'review') {
    next.status = 'completed'; next.escrow = 0; next.closedAt = Date.now(); next.refund = job.reworks ? 24 : 36;
    append(`验收通过，订单已完成。\n模拟结算已按工位完成，未使用的 ${next.refund} USDC 储备已退回演示钱包。感谢你信任这支 Crew！`);
    extra = { balance: state.balance + next.refund, transactions: [{ id: crypto.randomUUID(), jobId: job.id, type: '模拟储备退回', amount: next.refund, time: Date.now() }, ...state.transactions], notifications: [{ id: crypto.randomUUID(), jobId: job.id, title: '订单结算完成', text: `未使用的 ${next.refund} USDC 储备已退回。`, time: Date.now(), read: false }, ...state.notifications] };
  }
  else if (action.type === 'DISPUTE' && job.status === 'review' && job.reworks === 1 && action.reason?.trim()) { next.status = 'disputed'; next.disputeReason = action.reason; append(`争议工单已创建：${action.reason}\n演示托管保持冻结，等待平台介入；预计处理时间为 72 小时。`); }
  else return state;
  return { ...state, ...extra, jobs: state.jobs.map(j => j.id === job.id ? next : j) };
}

export function reportMarkdown(job) {
  return `# ${job.title}\n\n> 前端 MVP 示例交付物，不是实际研究结论。未调用 Agent 或外部检索。\n\n## 需求摘要\n${job.brief}\n\n- 目标篇幅：${job.pages} 页\n- 交付期限：${job.days} 天\n- 需求补充：${job.notes || '无'}\n- 版本：v${job.reworks + 1}.0\n\n## 1. 研究范围\n本演示展示资料采集、${job.includeMatrix ? '竞品矩阵、' : ''}报告撰写与质量审核的交付结构。\n\n## 2. 竞品与市场\n正式版本应填入可验证的公司资料、覆盖市场、产品能力和价格。本演示不编造具体研究结果。\n\n## 3. 对比维度\n| 维度 | 核验要求 |\n| --- | --- |\n| 产品能力 | 来自官方产品资料 |\n| 市场覆盖 | 逐地区验证 |\n| 定价模式 | 标明来源与采集日期 |\n| 合规资质 | 使用官方登记信息 |\n\n## 4. 引用与证据\n正式交付的每条结论应引用资料编号，并附来源 URL、采集日期和内容摘要。\n\n## 5. 质量检查\n- [x] 结构与字段（演示）\n- [x] 引用映射（演示）\n- [x] 事实一致性（演示）\n\n${job.reworks ? `## 返工记录\n${job.reworkReason}\n\n已在演示修订版中记录修改要求。\n` : ''}`;
}


import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'crewline.locale.v1';
const LocaleContext = createContext(null);

// The prototype keeps its domain data in Chinese so existing orders remain stable. This
// dictionary is deliberately source-oriented: the observer can translate static and
// persisted strings without changing the shape of saved jobs or the reducer contract.
const ZH_TO_EN = {
  '切换为中文': 'Switch to Chinese', '切换为英文': 'Switch to English', '新需求': 'New request', '我的订单': 'My orders', 'Agent 市场': 'Agent market', '我的 Agent': 'My Agents', '消息': 'Messages', '钱包与结算': 'Wallet & settlements', '帮助中心': 'Help center',
  'Crewline 工作台': 'Crewline workspace', '主导航': 'Main navigation', '打开导航': 'Open navigation', '关闭导航': 'Close navigation', '查看消息': 'View messages', '使用说明': 'Instructions', '演示账户': 'Demo account', '交互演示': 'Interactive demo',
  '需求对话': 'Brief chat', '团队与报价': 'Team & quote', '推荐的 Agent 团队': 'Recommended Agent team', '你的 Agent 团队': 'Your Agent team', '预估方案': 'Estimated plan', '订单概览': 'Order overview', '为什么选择这些 Agent？': 'Why these Agents?', '交付有保障': 'Delivery protection', '平台服务费说明': 'Platform fee details',
  'YOUR NEXT GREAT RESULT': 'YOUR NEXT GREAT RESULT', '想完成什么？': 'What would you like to accomplish?', '和你的 Crew 聊聊。': 'Talk it through with your Crew.', '描述你的目标，我们来拆解任务，': 'Describe your goal and we will break it down,', '找到专家，把想法变成可交付的结果。': 'find the right experts and turn it into a deliverable.', '竞品研究': 'Competitive research', '比较产品、市场与商业模式': 'Compare products, markets and business models', '行业洞察': 'Industry insight', '整理趋势、机会与可靠依据': 'Organize trends, opportunities and evidence',
  '今天': 'Today', '你的专属工作空间': 'Your dedicated workspace', '正在理解你的需求': 'Understanding your request', '已生成工位方案': 'Workstation plan ready', '已完成': 'Completed', '进行中': 'In progress', '已暂停': 'Paused', '等待中': 'Waiting', '已锁定': 'Locked', '待执行': 'Queued', '待确认': 'Awaiting confirmation', '待验收': 'Awaiting review', '草稿': 'Draft', '争议处理中': 'Dispute open', '全部工位已完成！': 'All workstations complete!', '团队已就位，开始执行！': 'The team is ready and execution has started!', '演示资金已托管。我会实时同步工位进度，有新结果会第一时间通知你。': 'Demo funds are in escrow. I will keep you updated as each workstation progresses.', '交付物已通过格式、引用与事实一致性检查，请预览并验收。': 'The deliverable passed format, citation and fact-consistency checks. Preview and accept it.', '下方是工位方案，你可以查看候选、调整预算或继续补充要求。': 'The workstation plan is below. Review candidates, adjust the budget or add more detail.', '输入需求或修改意见': 'Enter a request or change', '继续告诉我你的需求，或直接修改上面的方案…': 'Tell me more or edit the plan above…', '告诉我，你想完成什么…': 'Tell me what you want to accomplish…',
  '数据收集': 'Data collection', '对比分析': 'Competitive analysis', '报告撰写': 'Report writing', '质量审核': 'Quality review', '收集市场与公司资料': 'Collect market and company sources', '整理对比矩阵': 'Build a comparison matrix', '撰写 8 页报告': 'Write an 8-page report', '事实核查与格式': 'Fact and format checks', '平台自营': 'Platform-run', '3 个候选': '3 candidates', '3 位候选': '3 candidates', '查看候选': 'View candidates', '查看详情': 'View details', '调整方案': 'Adjust plan', '修改需求': 'Edit request', '调整预算': 'Adjust budget', '更经济的组合': 'Lower-cost team', '查看中间结果': 'View intermediate results', '演示：推进下一个工位': 'Demo: advance one workstation', '暂停执行': 'Pause run', '继续执行': 'Resume run', '发送需求': 'Send request', '上传参考附件': 'Attach reference', '添加参考文件': 'Add reference file', '执行后附件已锁定': 'Attachments are locked after execution', '本地交互演示': 'Local interaction demo', 'Enter 发送 · Shift + Enter 换行': 'Enter to send · Shift + Enter for a new line', '多源数据采集与整理专家': 'Multi-source data collection and organization expert', '网页数据抓取与清洗': 'Web data extraction and cleaning', '学术与行业数据检索': 'Academic and industry research retrieval', '竞品对比与结构化分析': 'Competitive comparison and structured analysis', '轻量竞品矩阵与分类': 'Lightweight competitive matrix and categorization', '深度行业比较与洞察': 'Deep industry comparison and insight', '专业商业报告撰写': 'Professional business report writing', '精炼研究简报与总结': 'Concise research brief and summary', '决策级行业研究报告': 'Decision-grade industry research report', '事实核查与引用审核': 'Fact-checking and citation review', '包含在平台费内': 'Included in platform fee', '每一个想法，都有一支 Crew 帮你完成。': 'Every idea gets a Crew to help you finish it',
  '团队协作进行中': 'Team run in progress', '执行已暂停': 'Run paused', '正在处理返工': 'Processing rework', '模拟执行': 'Simulated run', '依赖上一步': 'Depends on previous step', '争议工单已创建': 'Dispute created', '资金保持托管 · 预计 72h 处理': 'Funds remain in escrow · estimated 72h handling', '查看交付物': 'View deliverable', '质量审核由 Crewline 自营 Agent 独立完成': 'Quality review is handled by a Crewline-owned Agent', '聊清需求后，为你找到合适的专家。': 'Clarify the brief and we will find the right experts.', '团队已锁定，将按工位依赖顺序完成交付。': 'The team is locked and will deliver in dependency order.', '已为你筛选最匹配的专家 Agent，可以按需调整。': 'We selected the best-fit Agents; adjust them as needed.', '你的团队，正在等待一个目标': 'Your team is waiting for a goal', '从左侧发送需求，工位与候选专家会出现在这里。': 'Send a request on the left to see workstations and candidates here.',
  '工位成功费': 'Workstation success fees', 'Token 储备': 'Token reserve', '平台服务费': 'Platform service fee', '含独立质检 · 策划费已免': 'Independent QA included · planning fee waived', '预算上限': 'Budget cap', '预计交付时间': 'Estimated delivery', '支持 1 轮返工': '1 rework round included', '验收后按工位结算': 'Settled by workstation after acceptance', '确认此方案': 'Confirm this plan', '确认后锁定 USDC 托管资金，才会开始执行': 'Execution starts after USDC escrow is confirmed', '等待你的需求': 'Waiting for your request', '确认需求后，将自动计算工位费用与总预算。': 'Workstation fees and the total budget will be calculated after you confirm the brief.', '为结果付费': 'Pay for outcomes', '资金托管，验收后再结算': 'Funds are held until acceptance', '报价与履历为演示数据': 'Quotes and profiles are demo data', 'USDC 已模拟托管': 'USDC held in simulated escrow', '演示结算已完成，交付物随时可取。': 'Demo settlement is complete; the deliverable is ready anytime.', '托管冻结，等待平台介入。': 'Escrow is frozen while the platform reviews.',
  '全部订单': 'All orders', '执行中': 'Running', '订单状态': 'Order status', '搜索订单': 'Search orders', '项目名称': 'Project', '状态': 'Status', '工位进度': 'Workstation progress', '总报价': 'Total quote', '创建日期': 'Created', '没有匹配的订单': 'No matching orders', '试试其他关键词或订单状态。': 'Try another keyword or status.', '新建需求': 'New request',
  '找到适合你的专家': 'Find the right expert', '按能力、履历和价格，为下一份交付组建团队。': 'Build a team for your next deliverable by capability, track record and price.', '专业分工，让每一步都有把握': 'Specialists make every step dependable', '独立工位 · 透明报价 · 按交付验收': 'Independent workstations · transparent quotes · pay on delivery', '示例 Agent 数据': 'Demo Agent data', '全部专家': 'All experts', '可接单': 'Available', '近 30 单一次通过率': '30-day first-pass rate', '完成订单': 'Completed orders', '搜索 Agent': 'Search Agents', '搜索 Agent 或能力': 'Search Agents or capabilities', '暂未找到匹配的专家': 'No matching experts found', '尝试更短的关键词或其他工位。': 'Try a shorter keyword or another workstation.',
  '每笔费用都有去向，每次交付都值得信任。': 'Every fee has a destination, and every delivery earns trust.', '可用演示余额': 'Available demo balance', '模拟入金': 'Simulated top-up', '托管中的资金': 'Funds in escrow', '累计退回储备': 'Reserve refunded', '结算网络': 'Settlement network', '演示': 'Demo', '交易记录': 'Transactions', '仅本浏览器的模拟账本，无真实链上交易': 'This browser only · no real on-chain transactions', '收据': 'Receipt', '模拟托管': 'Simulated escrow', '模拟储备退回': 'Simulated reserve refund', '账本从第一笔托管开始': 'The ledger starts with the first escrow', '确认方案后，你会在这里看到演示托管与结算记录。': 'Demo escrow and settlement records appear here after you confirm a plan.',
  '把注意力留给结果，进度交给我们。': 'Focus on outcomes while we handle the progress.', '全部标为已读': 'Mark all as read', '一切尽在掌握': 'You are all caught up', '工位完成、交付待验收与结算通知会出现在这里。': 'Workstation, review and settlement updates appear here.', '交付物已就绪': 'Deliverable ready', '订单结算完成': 'Order settlement complete',
  '让你的专业能力，成为下一支 Crew 的一部分。': 'Make your expertise part of the next Crew.', '接入 Agent': 'Connect an Agent', '已接入 Agent': 'Connected Agents', '正在接单': 'Taking orders', '已结算收益（演示）': 'Settled earnings (demo)', '把你的 Agent 带到 Crewline': 'Bring your Agent to Crewline', '配置工位、报价与 Webhook，完成样例校验即可体验上架流程。': 'Configure a workstation, quote and Webhook to try the listing flow.', '接入第一个 Agent': 'Connect your first Agent', '填写 Agent Card': 'Fill in the Agent Card', '设置工位与报价': 'Set workstation and quote', '运行样例校验': 'Run sample checks', '确认上架': 'Confirm listing', '接单中': 'Taking orders', 'Webhook 配置已保存 · 本地配置校验通过': 'Webhook config saved · local checks passed', '暂停接单': 'Pause orders', '恢复接单': 'Resume orders', '编辑': 'Edit', '开发者接入预览': 'Developer integration preview', '此版本只校验本地配置与样例结构，不请求 Webhook，不创建链上身份，也不实际分发任务。': 'This version only checks local configuration and sample structure; it does not call a Webhook, create an on-chain identity or distribute real tasks.',
  '从一个想法，到一份交付': 'From an idea to a deliverable', 'Crewline 把需求拆成可验收的工位，为你推荐专家 Agent，让每一步都有明确的产出。': 'Crewline breaks a brief into reviewable workstations and recommends expert Agents with clear outputs.', '聊清需求': 'Clarify the brief', '输入目标、范围、期限和预算，或使用示例开始。': 'Share the goal, scope, deadline and budget, or start with a sample.', '确认团队': 'Confirm the team', '比较 Agent 履历和报价，随时修改方案。': 'Compare Agent profiles and quotes, then adjust the plan.', '托管并执行': 'Escrow and run', '先确认预算，再开始各工位的依赖执行。': 'Confirm the budget before dependency-ordered execution starts.', '验收与交付': 'Review and deliver', '查看稿件，验收结算；也支持一次返工与争议。': 'Review the draft and settle on acceptance, with one rework and dispute path.', '关于当前演示': 'About this demo', '使用本地规则模拟对话及执行，数据保存在当前浏览器。支付、质检、Webhook、钱包连接和链上身份尚未接入真实服务。附件仅保存文件信息。': 'Local rules simulate chat and execution; data stays in this browser. Payments, QA, Webhooks, wallet connections and on-chain identity are not connected. Attachments keep metadata only.', '打开示例需求': 'Open demo request', '开始体验': 'Start exploring',
  '选择': 'Select', '当前选择': 'Current', '综合排序': 'Recommended', '价格': 'Price', '一次通过率': 'First-pass rate', '交付速度': 'Delivery speed', '比较履历与报价，为当前工位选择更合适的专家。': 'Compare profiles and quotes to choose the right expert for this workstation.', '以下履历为演示数据。': 'Profiles below are demo data.', '最近反馈：': 'Recent feedback: ', '交付评价': 'Delivery rating', '中位交付时间': 'Median delivery time', 'USDC / 成功交付': 'USDC / successful delivery', '换人后总报价会立即更新，确认托管前不产生费用。': 'The total updates immediately; no fee is incurred before escrow.', '返回方案': 'Back to plan', '工位说明': 'Workstation details', '输入': 'Input', '输出': 'Output', '验收标准': 'Acceptance criteria', '各工位按依赖顺序执行；质量审核由平台自营 Agent 独立完成。': 'Workstations run in dependency order; QA is handled independently by a platform-owned Agent.', '了解了': 'Got it', '交付物预览': 'Deliverable preview', '示例交付物': 'Demo deliverable', '关闭预览': 'Close preview', '下载 Markdown': 'Download Markdown', '工位交付记录': 'Workstation artifacts', '等待工位完成后生成': 'Generated after the workstation completes', '返回对话': 'Back to chat', '确认验收这份交付': 'Accept this deliverable', '确认交付物符合需求后，系统将按工位结算，并退回未使用的储备。': 'After you confirm the deliverable meets the brief, workstations are settled and unused reserve is returned.', '将退回演示钱包': 'Returned to demo wallet', '当前为交互演示，无真实付款或链上交易。': 'This is an interactive demo; no real payment or on-chain transaction.', '继续查看': 'Keep reviewing', '确认验收并结算': 'Accept and settle', '添加演示余额': 'Add demo balance', '增加当前浏览器的模拟 USDC 余额，用于体验托管和结算。': 'Add simulated USDC balance in this browser to try escrow and settlement.', '金额 · USDC': 'Amount · USDC', '此操作仅更新本地数据，不会请求支付，也不会生成真实交易。': 'This only updates local data; it does not request payment or create a real transaction.', '申请一轮返工': 'Request one rework', '发起争议': 'Open a dispute', '请说明需要修改的内容。原 Agent 将继续处理，不另收成功费。': 'Tell us what needs changing. The original Agent will continue without another success fee.', '本订单已使用一次返工。请说明仍不符合哪项验收标准，演示托管资金将保持冻结。': 'This order has used its one rework. Tell us which acceptance rule is still unmet; demo escrow will remain frozen.', '提交返工请求': 'Submit rework request', '创建争议工单': 'Create dispute', '缺少出处': 'Missing sources', '结构不符': 'Wrong structure', '事实存疑': 'Fact in question', '其他问题': 'Other issue', '具体说明': 'Details', '取消': 'Cancel', '保存方案': 'Save plan', '调整需求与方案': 'Adjust brief and plan', '交付目标': 'Delivery goal', '目标页数': 'Target pages', '交付期限 · 天': 'Deadline · days', '预算上限 · USDC': 'Budget cap · USDC', '包含对比分析工位': 'Include comparison workstation', '移除后，报告撰写将直接使用采集资料。': 'Without it, report writing uses the collected sources directly.', '质量审核为必选工位，费用已包含在平台服务费中。': 'Quality review is required and included in the platform fee.', '确认团队并开始执行': 'Confirm team and start', '演示钱包余额：': 'Demo wallet balance: ', '我已核对需求、工位分工及验收规则': 'I checked the brief, workstation roles and acceptance rules', '确认后模拟托管资金，验收前不会结算。': 'Funds are simulated in escrow and are not settled before acceptance.', '这是前端交互演示，不会连接钱包或真实扣款。': 'This is a frontend demo; it does not connect a wallet or charge real funds.', '确认托管并开始执行': 'Confirm escrow and start', '确认上架（演示）': 'Confirm listing (demo)', '运行本地配置校验': 'Run local configuration checks', 'Agent 名称': 'Agent name', '工位标签': 'Workstation tag', '成功交付费 · USDC': 'Success fee · USDC', 'Token 上限': 'Token limit', '超时 · 小时': 'Timeout · hours', '检查 1：Agent 名称与工位配置有效': 'Check 1: Agent name and workstation are valid', '检查 2：HTTPS Webhook 地址格式有效': 'Check 2: HTTPS Webhook URL is valid', '检查 3：预算、Token 上限与超时有效': 'Check 3: Budget, token limit and timeout are valid', '本地配置演示校验，未连接实际 Webhook。': 'Local configuration demo checks; no Webhook connected.', '请填写 Agent 名称。': 'Enter an Agent name.', '请填写完整的 HTTPS Webhook 地址。': 'Enter a complete HTTPS Webhook URL.', 'Webhook 地址需要以 https:// 开头。': 'The Webhook URL must start with https://.', '请填写有效报价、Token 上限（至少 1000）与超时时间。': 'Enter a valid quote, token limit (at least 1,000) and timeout.', '已上架到演示控制台': 'listed in the demo console', '方案已更新': 'Plan updated', '演示资金已托管，开始执行': 'Demo funds are in escrow; execution started', '返工请求已提交': 'Rework request submitted', '已加入当前方案': 'Added to the current plan', '已选择': 'Selected', '验收通过': 'Accept', '申请返工': 'Request rework', '在线预览': 'Preview online', '下载': 'Download', '全部工位已完成': 'All workstations complete', '验收完成，感谢你的信任': 'Accepted — thank you for your trust', '修订版已准备好，请查看更新。': 'The revised version is ready for review.', '以下是最终交付物，请查收并验收。': 'Here is the final deliverable. Please review and accept it.', 'Markdown · 示例交付物': 'Markdown · demo deliverable', '格式与字段检查': 'Format and fields', '引用链接有效性': 'Citation links', '事实一致性检查': 'Fact consistency', '通过': 'Passed', '以上为前端演示检查；实际研究与质检尚未接入。': 'These are frontend demo checks; real research and QA are not connected.', '已结算 · ': 'Settled · ',
  '少量小众市场数据需补充。': 'Some niche market data may need supplementation.', '复杂动态页面覆盖有限。': 'Coverage of complex dynamic pages is limited.', '性价比优先，擅长公开研究材料。': 'Value-focused and strong with public research material.', '交付速度比平均水平慢。': 'Slower than average delivery.', '金融科技领域的对比维度与证据关联表现稳定。': 'Consistent evidence-linked comparisons in fintech.', '自定义列较多时可能需要返工。': 'Many custom columns may require rework.', '深度商业模式分析较少。': 'Limited deep business-model analysis.', '复杂行业研究的一次通过率较高。': 'High first-pass rate for complex industry research.', '需要较明确的研究范围。': 'Needs a clearly defined research scope.', '将结构化证据转化为清晰、可读的商业报告。': 'Turns structured evidence into clear, readable business reports.', '长篇报告的初稿偏保守。': 'Long-form first drafts can be conservative.', '简报清晰精炼，交付速度较快。': 'Clear, concise briefs with fast delivery.', '复杂附录需要额外说明。': 'Complex appendices may need extra explanation.', '专注战略分析和管理层叙事。': 'Focused on strategy and executive storytelling.', '图表说明有时较长。': 'Chart explanations can be lengthy.', '平台独立质检，验收前检查每份交付物。': 'Independent platform QA before every acceptance.', '平台自营，不参与第三方竞价。': 'Platform-owned and not part of third-party bidding.',
  '前端 MVP 示例交付物，不是实际研究结论。未调用 Agent 或外部检索。': 'Frontend MVP demo deliverable, not real research conclusions. No Agent or external retrieval was used.', '需求摘要': 'Brief summary', '目标篇幅：': 'Target length: ', '交付期限：': 'Deadline: ', '需求补充：': 'Notes: ', '无': 'None', '版本：': 'Version: ', '研究范围': 'Research scope', '本演示展示资料采集、': 'This demo shows source collection, ', '竞品矩阵、': 'comparison matrix, ', '报告撰写与质量审核的交付结构。': 'report writing and quality review as a deliverable structure.', '竞品与市场': 'Competitors and market', '正式版本应填入可验证的公司资料、覆盖市场、产品能力和价格。本演示不编造具体研究结果。': 'A production version would add verifiable company data, market coverage, capabilities and pricing. This demo does not invent research findings.', '对比维度': 'Comparison dimensions', '核验要求': 'Validation requirement', '产品能力': 'Product capability', '来自官方产品资料': 'From official product material', '市场覆盖': 'Market coverage', '逐地区验证': 'Verify by region', '定价模式': 'Pricing model', '标明来源与采集日期': 'Record source and collection date', '合规资质': 'Compliance credentials', '使用官方登记信息': 'Use official registry information', '引用与证据': 'Citations and evidence', '正式交付的每条结论应引用资料编号，并附来源 URL、采集日期和内容摘要。': 'Every production conclusion should cite a source ID, URL, collection date and content summary.', '质量检查': 'Quality checks', '结构与字段（演示）': 'Structure and fields (demo)', '引用映射（演示）': 'Citation mapping (demo)', '事实一致性（演示）': 'Fact consistency (demo)',
};

Object.assign(ZH_TO_EN, {
  '每一个想法，都有一支 Crew 帮你完成。': 'Every idea gets a Crew to help you finish it.',
  '多源数据采集与整理专家': 'Multi-source data collection and organization expert',
  '网页数据抓取与清洗': 'Web data extraction and cleaning',
  '学术与行业数据检索': 'Academic and industry research retrieval',
  '竞品对比与结构化分析': 'Competitive comparison and structured analysis',
  '轻量竞品矩阵与分类': 'Lightweight competitive matrix and categorization',
  '深度行业比较与洞察': 'Deep industry comparison and insight',
  '专业商业报告撰写': 'Professional business report writing',
  '精炼研究简报与总结': 'Concise research brief and summary',
  '决策级行业研究报告': 'Decision-grade industry research report',
  '事实核查与引用审核': 'Fact-checking and citation review',
  '包含在平台费内': 'Included in platform fee',
  '研究主题、地域与竞品范围': 'Research topic, region and competitor scope',
  '带来源、日期与证据编号的资料 JSON': 'Source JSON with sources, dates and evidence IDs',
  '至少 12 家公司；来源在 18 个月内；URL 可访问': 'At least 12 companies; sources within 18 months; URLs accessible',
  '数据收集工位的结构化资料': 'Structured output from data collection',
  '产品、定价、覆盖市场对比 CSV': 'CSV comparing products, pricing and market coverage',
  '关键字段无缺失；每条结论关联证据编号': 'No missing key fields; every conclusion linked to an evidence ID',
  '研究资料、对比矩阵与需求大纲': 'Research sources, comparison matrix and brief outline',
  '可下载的 Markdown 研究报告': 'Downloadable Markdown research report',
  '满足约定页数与结构；所有引用可追溯': 'Agreed length and structure; all citations traceable',
  '全部工位的交付物': 'Deliverables from all workstations',
  '逐项检查清单与 pass / fail 结果': 'Itemized checklist with pass / fail results',
  '格式、引用、事实一致性全部通过；失败阻断放款': 'Format, citations and fact consistency pass; failures block release',
});

const EN_TO_ZH = Object.fromEntries(Object.entries(ZH_TO_EN).map(([zh, en]) => [en, zh]));
// Some labels intentionally share one English phrase. Keep the common navigation
// wording stable when the user switches back from English to Chinese.
Object.assign(EN_TO_ZH, {
  'New request': '新需求',
  'Accept': '验收通过',
  'Open dispute': '发起争议',
  'Request rework': '申请返工',
  'Dispute created': '争议工单已创建',
});

function translateString(source, locale) {
  if (!source) return source;
  const whitespace = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (whitespace && whitespace[2] !== source) return `${whitespace[1]}${translateString(whitespace[2], locale)}${whitespace[3]}`;
  if (locale === 'zh') {
    if (EN_TO_ZH[source]) return EN_TO_ZH[source];
    const reversePatterns = [
      [/^I understand your brief\. I will organize research around "(.+)", deliver about (\d+) pages within (\d+) days, with traceable citations for every conclusion\.$/, '已理解你的需求。我会围绕「$1」组织研究，产出约 $2 页的报告，预计 $3 天内交付，所有结论保留可追溯引用。'],
      [/^Added this note to the brief: (.+)$/, '已将这条补充写入需求：$1'],
      [/^The current scope and quote are unchanged\. You can say “change the budget to 450”, “make it 10 pages” or “choose a lower-cost team”\.$/, '当前交付范围与报价保持不变。你也可以说「预算改为 450」「改成 10 页」或「换便宜一点的组合」。'],
      [/^Plan updated: (\d+)-page report, delivered within (\d+) days, with a \$(\d+) USDC budget cap\.$/, '方案已更新：$1 页报告，$2 天内交付，预算上限 $3 USDC。'],
      [/^Changed the "(.+)" workstation to (.+)\. The total quote is now \$(\d+) USDC\.$/, '已将「$1」工位换为 $2。总报价更新为 $3 USDC。'],
      [/^Current status: (.+)\. (\d+)\/(\d+) workstations complete; progress updates automatically\.$/, '当前状态：$1。已完成 $2/$3 个工位，执行进度会自动更新。'],
      [/^Target length: (\d+) pages$/, '目标篇幅：$1 页'],
      [/^Deadline: (\d+) days$/, '交付期限：$1 天'],
      [/^Notes: (.*)$/, '需求补充：$1'],
      [/^Version: v(.+)$/, '版本：v$1'],
      [/^Write (\d+)-page report$/, '撰写 $1 页报告'],
      [/^We broke your brief into (\d+) workstations and recommended an expert for each\.$/, '根据你的需求，我拆解出 $1 个工位，并为每个工位推荐合适的专家。'],
      [/^(\d+)\/(\d+) workstations complete · simulated run$/, '已完成 $1/$2 个工位 · 模拟执行'],
      [/^(\d+) candidates$/, '$1 个候选'],
      [/^View (.+) candidates$/, '查看$1候选'],
      [/^View details$/, '查看详情'],
      [/^Open (.+)$/, '打开$1'],
      [/^Remove (.+)$/, '移除$1'],
      [/^Today · Your dedicated workspace$/, '今天 · 你的专属工作空间'],
      [/^Demo wallet balance: (.*)$/, '演示钱包余额：$1'],
      [/^\$(\d+) USDC in simulated escrow$/, '$1 USDC 已模拟托管'],
      [/^Settled · (.*)$/, '已结算 · $1'],
      [/^"(.+)" is waiting for your review\.$/, '「$1」等待你的验收。'],
      [/^Unused \$(\d+) USDC reserve was refunded\.$/, '未使用的 $1 USDC 储备已退回。'],
      [/^Unused \$(\d+) USDC reserve was refunded to the demo wallet\.$/, '未使用的 $1 USDC 储备已退回演示钱包。'],
      [/^Accepted — order complete\.$/, '验收通过，订单已完成。'],
      [/^Workstations settled; unused \$(\d+) USDC reserve was refunded to the demo wallet\. Thanks for trusting this Crew!$/, '模拟结算已按工位完成，未使用的 $1 USDC 储备已退回演示钱包。感谢你信任这支 Crew！'],
    ];
    for (const [pattern, replacement] of reversePatterns) if (pattern.test(source)) return source.replace(pattern, replacement);
    return source;
  }
  if (!/[\u3400-\u9fff]/.test(source)) return source;
  if (ZH_TO_EN[source]) return ZH_TO_EN[source];
  let value = source;
  const patterns = [
    [/^已理解你的需求。我会围绕「(.+)」组织研究，产出约 (\d+) 页的报告，预计 (\d+) 天内交付，所有结论保留可追溯引用。$/, 'I understand your brief. I will organize research around "$1", deliver about $2 pages within $3 days, with traceable citations for every conclusion.'],
    [/^「(.+)」等待你的验收。$/, '"$1" is waiting for your review.'],
    [/^未使用的 (\d+) USDC 储备已退回。$/, 'Unused $1 USDC reserve was refunded.'],
    [/^未使用的 (\d+) USDC 储备已退回演示钱包。$/, 'Unused $1 USDC reserve was refunded to the demo wallet.'],
    [/^验收通过，订单已完成。$/, 'Accepted — order complete.'],
    [/^模拟结算已按工位完成，未使用的 (\d+) USDC 储备已退回演示钱包。感谢你信任这支 Crew！$/, 'Workstations settled; unused $1 USDC reserve was refunded to the demo wallet. Thanks for trusting this Crew!'],
    [/^已将这条补充写入需求：(.+)$/, 'Added this note to the brief: $1'],
    [/^当前交付范围与报价保持不变。你也可以说「预算改为 450」「改成 10 页」或「换便宜一点的组合」。$/, 'The current scope and quote are unchanged. You can say “change the budget to 450”, “make it 10 pages” or “choose a lower-cost team”.'],
    [/^方案已更新：(\d+) 页报告，(\d+) 天内交付，预算上限 (\d+) USDC。$/, 'Plan updated: $1-page report, delivered within $2 days, with a $3 USDC budget cap.'],
    [/^已将「(.+)」工位换为 (.+)。总报价更新为 (\d+) USDC。$/, 'Changed the "$1" workstation to $2. The total quote is now $3 USDC.'],
    [/^当前状态：(.+)。已完成 (\d+)\/(\d+) 个工位，执行进度会自动更新。$/, 'Current status: $1. $2/$3 workstations complete; progress updates automatically.'],
    [/^目标篇幅：(\d+) 页$/, 'Target length: $1 pages'],
    [/^交付期限：(\d+) 天$/, 'Deadline: $1 days'],
    [/^需求补充：(.*)$/, 'Notes: $1'],
    [/^版本：v(.+)$/, 'Version: v$1'],
    [/^撰写 (\d+) 页报告$/, 'Write $1-page report'],
    [/^根据你的需求，我拆解出 (\d+) 个工位，并为每个工位推荐合适的专家。$/, 'We broke your brief into $1 workstations and recommended an expert for each.'],
    [/^已完成 (\d+)\/(\d+) 个工位 · 模拟执行$/, '$1/$2 workstations complete · simulated run'],
    [/^已完成 (\d+)\/\s*(\d+) 个工位 · 模拟执行$/, '$1/$2 workstations complete · simulated run'],
    [/^预计交付时间$/, 'Estimated delivery'],
    [/^(\d+) 个候选$/, '$1 candidates'],
    [/^(\d+) 位候选$/, '$1 candidates'],
    [/^查看(.+)候选$/, 'View $1 candidates'],
    [/^查看(.+)详情$/, 'View details'],
    [/^移除(.+)$/, 'Remove $1'],
    [/^打开(.+)$/, 'Open $1'],
    [/^CL-(.+) · 示例需求$/, 'CL-$1 · Demo request'],
    [/^超出预算 \$(\d+)，请调整预算或选择更经济的 Agent。$/, 'Over budget by $$$1. Adjust the budget or choose a lower-cost Agent.'],
    [/^\$(\d+) USDC 已模拟托管$/, '$$$1 USDC in simulated escrow'],
    [/^演示钱包余额：(.*)$/, 'Demo wallet balance: $1'],
    [/^换便宜一点的组合$/, 'Choose a lower-cost team'],
    [/^预算改为 450 USDC$/, 'Change budget to 450 USDC'],
    [/^已结算 · (.*)$/, 'Settled · $1'],
    [/^今天 · 你的专属工作空间$/, 'Today · Your dedicated workspace'],
  ];
  for (const [pattern, replacement] of patterns) if (pattern.test(source)) return source.replace(pattern, replacement);
  return value;
}

function useDocumentTranslator(locale) {
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    document.title = locale === 'en' ? 'Crewline — Expert Agent Workspace' : 'Crewline — 专家 Agent 协作工作台';
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    const internallyChangedText = new WeakMap();
    const internallyChangedAttributes = new WeakMap();
    const attributes = ['aria-label', 'aria-description', 'placeholder', 'title', 'alt'];
    const translateNode = node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const raw = node.nodeValue || '';
        if (!raw.trim()) return;
        const source = originalText.get(node) || raw;
        if (!originalText.has(node)) originalText.set(node, source);
        const translated = translateString(source, locale);
        if (translated !== node.nodeValue) { internallyChangedText.set(node, translated); node.nodeValue = translated; }
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      for (const attr of attributes) {
        if (!node.hasAttribute(attr)) continue;
        const raw = node.getAttribute(attr) || '';
        const source = originalAttributes.get(node)?.[attr] || raw;
        if (!originalAttributes.has(node)) originalAttributes.set(node, {});
        originalAttributes.get(node)[attr] = source;
        const translated = translateString(source, locale);
        if (translated !== raw) {
          const marks = internallyChangedAttributes.get(node) || {};
          marks[attr] = translated;
          internallyChangedAttributes.set(node, marks);
          node.setAttribute(attr, translated);
        }
      }
      node.childNodes.forEach(translateNode);
    };
    translateNode(document.body);
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          const current = mutation.target.nodeValue || '';
          const expected = internallyChangedText.get(mutation.target);
          if (expected === current) { internallyChangedText.delete(mutation.target); continue; }
          if (expected !== undefined) internallyChangedText.delete(mutation.target);
          const old = originalText.get(mutation.target);
          if (locale === 'en' && old && current === translateString(old, 'en')) continue;
          originalText.set(mutation.target, current);
          translateNode(mutation.target);
        } else if (mutation.type === 'attributes') {
          const attr = mutation.attributeName;
          const marks = internallyChangedAttributes.get(mutation.target);
          const current = mutation.target.getAttribute(attr) || '';
          if (marks?.[attr] === current) {
            delete marks[attr];
            if (!Object.keys(marks).length) internallyChangedAttributes.delete(mutation.target);
            continue;
          }
          if (marks) delete marks[attr];
          translateNode(mutation.target);
        } else mutation.addedNodes.forEach(translateNode);
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
    return () => observer.disconnect();
  }, [locale]);
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh'; } catch { return 'zh'; }
  });
  const setLocale = value => {
    const next = value === 'en' ? 'en' : 'zh';
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* In-memory preference remains available. */ }
    setLocaleState(next);
  };
  useDocumentTranslator(locale);
  const value = useMemo(() => ({ locale, setLocale, t: value => translateString(value, locale) }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const next = locale === 'en' ? 'zh' : 'en';
  return <button className="language-toggle" type="button" aria-label={locale === 'en' ? '切换为中文' : 'Switch to English'} title={locale === 'en' ? '切换为中文' : 'Switch to English'} onClick={() => setLocale(next)}>{locale === 'en' ? '中' : 'EN'}</button>;
}


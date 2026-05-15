export type DocLocale = 'zh' | 'en';

export interface DocItem {
  id: string;
  title: string;
  route: string;
  files: Partial<Record<DocLocale, string>>;
}

export interface DocSection {
  title: string;
  items: DocItem[];
}

const sharedChannelDocs: DocItem[] = [
  { id: '01', title: 'Telegram', route: 'channels/01_telegram', files: { zh: 'channels/01_telegram.md', en: 'channels/01_telegram.md' } },
  { id: '02', title: 'Discord', route: 'channels/02_discord', files: { zh: 'channels/02_discord.md', en: 'channels/02_discord.md' } },
  { id: '03', title: 'Slack', route: 'channels/03_slack', files: { zh: 'channels/03_slack.md', en: 'channels/03_slack.md' } },
  { id: '04', title: 'Feishu', route: 'channels/04_feishu', files: { zh: 'channels/04_feishu.md', en: 'channels/04_feishu.md' } },
  { id: '05', title: 'DingTalk', route: 'channels/05_dingtalk', files: { zh: 'channels/05_dingtalk.md', en: 'channels/05_dingtalk.md' } },
  { id: '06', title: 'WeCom', route: 'channels/06_wecom', files: { zh: 'channels/06_wecom.md', en: 'channels/06_wecom.md' } },
  { id: '07', title: 'WhatsApp', route: 'channels/07_whatsapp', files: { zh: 'channels/07_whatsapp.md', en: 'channels/07_whatsapp.md' } },
  { id: '08', title: 'Lark', route: 'channels/08_lark', files: { zh: 'channels/08_lark.md', en: 'channels/08_lark.md' } },
  { id: '09', title: 'QQ', route: 'channels/09_qq', files: { zh: 'channels/09_qq.md', en: 'channels/09_qq.md' } },
  { id: '10', title: 'NapCatQQ', route: 'channels/10_napcatqq', files: { zh: 'channels/10_napcatqq.md', en: 'channels/10_napcatqq.md' } },
  { id: '11', title: 'Weixin', route: 'channels/11_weixin', files: { zh: 'channels/11_weixin.md', en: 'channels/11_weixin.md' } },
];

const zhSeriesDocs: DocItem[] = [
  { id: '00', title: '系列目录', route: '00_index', files: { zh: '00_index.md' } },
  { id: '01', title: '什么是 blockcell？', route: '01_what_is_blockcell', files: { zh: '01_what_is_blockcell.md' } },
  { id: '02', title: '5分钟上手', route: '02_quickstart', files: { zh: '02_quickstart.md', en: '02_quickstart.md' } },
  { id: '03', title: '工具系统', route: '03_tools_system', files: { zh: '03_tools_system.md', en: '03_tools_system.md' } },
  { id: '04', title: '技能（Skill）系统', route: '04_skill_system', files: { zh: '04_skill_system.md', en: '04_skill_system.md' } },
  { id: '05', title: '记忆系统', route: '05_memory_system', files: { zh: '05_memory_system.md', en: '05_memory_system.md' } },
  { id: '06', title: '多渠道接入', route: '06_channels', files: { zh: '06_channels.md', en: '06_channels.md' } },
  { id: '07', title: '浏览器自动化', route: '07_browser_automation', files: { zh: '07_browser_automation.md', en: '07_browser_automation.md' } },
  { id: '08', title: 'Gateway 模式', route: '08_gateway_mode', files: { zh: '08_gateway_mode.md', en: '08_gateway_mode.md' } },
  { id: '09', title: '自我进化', route: '09_self_evolution', files: { zh: '09_self_evolution.md', en: '09_self_evolution.md' } },
  { id: '10', title: '金融场景实战', route: '10_finance_use_case', files: { zh: '10_finance_use_case.md', en: '10_finance_use_case.md' } },
  { id: '11', title: '子智能体与任务并发', route: '11_subagents', files: { zh: '11_subagents.md', en: '11_subagents.md' } },
  { id: '12', title: '架构深度解析', route: '12_architecture', files: { zh: '12_architecture.md', en: '12_architecture.md' } },
  { id: '13', title: '消息处理与自进化生命周期', route: '13_message_processing_and_evolution', files: { zh: '13_message_processing_and_evolution.md', en: '13_message_processing_and_evolution.md' } },
  { id: '14', title: '名字由来', route: '14_name_origin', files: { zh: '14_name_origin.md', en: '14_name_origin.md' } },
  { id: '15', title: '幽灵智能体（Ghost Agent）', route: '15_ghost_agent', files: { zh: '15_ghost_agent.md', en: '15_ghost_agent.md' } },
  { id: '16', title: 'Agent2Agent 社区（Blockcell Hub）', route: '16_hub_community', files: { zh: '16_hub_community.md', en: '16_hub_community.md' } },
  { id: '17', title: 'CLI 参考手册', route: '17_cli_reference', files: { zh: '17_cli_reference.md', en: '17_cli_reference.md' } },
  { id: '18', title: '代理与 LLM Provider 配置', route: '18_proxy_and_provider_config', files: { zh: '18_proxy_and_provider_config.md', en: '18_proxy_and_provider_config.md' } },
  { id: '19', title: 'MCP Server 集成', route: '19_mcp_servers', files: { zh: '19_mcp_servers.md', en: '19_mcp_servers.md' } },
  { id: '20', title: 'Provider Pool - 多模型高可用配置', route: '20_provider_pool', files: { zh: '20_provider_pool.md', en: '20_provider_pool.md' } },
  { id: '21', title: 'intentRouter 多 Profile 配置指南', route: '21_intent_router_profiles', files: { zh: '21_intent_router_profiles.md', en: '21_intent_router_profiles.md' } },
  { id: '22', title: '路径访问策略', route: '22_path_access_policy', files: { zh: '22_path_access_policy.md', en: '22_path_access_policy.md' } },
  { id: '23', title: '微信集成指南', route: '23_weixin_integration', files: { zh: '23_weixin_integration.md', en: '23_weixin_integration.md' } },
  { id: '24', title: '技能开发入门', route: '24_skill_beginner', files: { zh: '24_skill_beginner.md' } },
  { id: '25', title: '技能开发进阶', route: '25_skill_intermediate', files: { zh: '25_skill_intermediate.md' } },
  { id: '26', title: '技能开发高级', route: '26_skill_advanced', files: { zh: '26_skill_advanced.md' } },
  { id: '27', title: 'Ghost Native 学习闭环技术设计', route: '27_ghost_learning_design', files: { zh: '27_ghost_learning_design.md' } },
];

const enSeriesDocs: DocItem[] = [
  { id: '00', title: 'Table of Contents', route: '00_index', files: { zh: '00_index.md', en: '00_index.md' } },
  { id: '01', title: 'What is blockcell?', route: '01_what_is_blockcell', files: { zh: '01_what_is_blockcell.md', en: '01_what_is_blockcell.md' } },
  { id: '02', title: '5-minute quickstart', route: '02_quickstart', files: { zh: '02_quickstart.md', en: '02_quickstart.md' } },
  { id: '03', title: 'Tool system', route: '03_tools_system', files: { zh: '03_tools_system.md', en: '03_tools_system.md' } },
  { id: '04', title: 'Skill system', route: '04_skill_system', files: { zh: '04_skill_system.md', en: '04_skill_system.md' } },
  { id: '05', title: 'Memory system', route: '05_memory_system', files: { zh: '05_memory_system.md', en: '05_memory_system.md' } },
  { id: '06', title: 'Multi-channel access', route: '06_channels', files: { zh: '06_channels.md', en: '06_channels.md' } },
  { id: '07', title: 'Browser automation', route: '07_browser_automation', files: { zh: '07_browser_automation.md', en: '07_browser_automation.md' } },
  { id: '08', title: 'Gateway mode', route: '08_gateway_mode', files: { zh: '08_gateway_mode.md', en: '08_gateway_mode.md' } },
  { id: '09', title: 'Self-evolution', route: '09_self_evolution', files: { zh: '09_self_evolution.md', en: '09_self_evolution.md' } },
  { id: '10', title: 'Finance in practice', route: '10_finance_use_case', files: { zh: '10_finance_use_case.md', en: '10_finance_use_case.md' } },
  { id: '11', title: 'Subagents and task concurrency', route: '11_subagents', files: { zh: '11_subagents.md', en: '11_subagents.md' } },
  { id: '12', title: 'Architecture deep dive', route: '12_architecture', files: { zh: '12_architecture.md', en: '12_architecture.md' } },
  { id: '13', title: 'Message processing & evolution lifecycle', route: '13_message_processing_and_evolution', files: { zh: '13_message_processing_and_evolution.md', en: '13_message_processing_and_evolution.md' } },
  { id: '14', title: 'Name origin', route: '14_name_origin', files: { zh: '14_name_origin.md', en: '14_name_origin.md' } },
  { id: '15', title: 'Ghost Agent', route: '15_ghost_agent', files: { zh: '15_ghost_agent.md', en: '15_ghost_agent.md' } },
  { id: '16', title: 'Agent2Agent Community (Blockcell Hub)', route: '16_hub_community', files: { zh: '16_hub_community.md', en: '16_hub_community.md' } },
  { id: '17', title: 'CLI Reference', route: '17_cli_reference', files: { zh: '17_cli_reference.md', en: '17_cli_reference.md' } },
  { id: '18', title: 'Proxy and Provider Configuration', route: '18_proxy_and_provider_config', files: { zh: '18_proxy_and_provider_config.md', en: '18_proxy_and_provider_config.md' } },
  { id: '19', title: 'MCP Server Integration', route: '19_mcp_servers', files: { zh: '19_mcp_servers.md', en: '19_mcp_servers.md' } },
  { id: '20', title: 'Provider Pool - Multi-Model High Availability', route: '20_provider_pool', files: { zh: '20_provider_pool.md', en: '20_provider_pool.md' } },
  { id: '21', title: 'intentRouter Multi-Agent Configuration Guide', route: '21_intent_router_profiles', files: { zh: '21_intent_router_profiles.md', en: '21_intent_router_profiles.md' } },
  { id: '22', title: 'Path Access Policy', route: '22_path_access_policy', files: { zh: '22_path_access_policy.md', en: '22_path_access_policy.md' } },
  { id: '23', title: 'Weixin Integration Guide', route: '23_weixin_integration', files: { zh: '23_weixin_integration.md', en: '23_weixin_integration.md' } },
];

export function getDocSections(lang: DocLocale): DocSection[] {
  if (lang === 'zh') {
    return [
      { title: '系列文章', items: zhSeriesDocs },
      { title: '渠道配置', items: sharedChannelDocs },
    ];
  }

  return [
    {
      title: 'Article Series',
      items: enSeriesDocs,
    },
    { title: 'Channel Guides', items: sharedChannelDocs },
  ];
}

export function getDocItems(lang: DocLocale) {
  return getDocSections(lang).flatMap((section) => section.items);
}

export function getAllDocItems() {
  return [
    ...zhSeriesDocs,
    ...enSeriesDocs,
    ...sharedChannelDocs,
  ];
}

export function findDocByRoute(routePath: string) {
  return getAllDocItems().find((item) => item.route === routePath) ?? null;
}

export function resolveDocFile(lang: DocLocale, routePath: string) {
  const doc = findDocByRoute(routePath);
  if (!doc) return null;

  return doc.files[lang] ?? doc.files.zh ?? doc.files.en ?? null;
}

export function resolveDocTitle(lang: DocLocale, routePath: string) {
  return getDocItems(lang).find((item) => item.route === routePath)?.title
    ?? findDocByRoute(routePath)?.title
    ?? null;
}

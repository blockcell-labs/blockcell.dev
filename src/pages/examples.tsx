import { motion } from 'framer-motion';
import { FileJson, FileCode, FileText, Folder, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ExamplesPage() {
  const { t } = useTranslation();
  const [activeFile, setActiveFile] = useState<keyof typeof files>('SKILL.rhai');

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('examples.title')}
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('examples.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
          {/* File Explorer */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-muted/30 font-mono text-sm font-bold flex items-center gap-2">
              <Folder size={16} className="text-blue-400" />
              weather_query/
            </div>
            <div className="p-2">
              {Object.keys(files).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName as keyof typeof files)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-colors ${
                    activeFile === fileName 
                      ? 'bg-rust/10 text-rust' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {fileName.endsWith('.rhai') && <FileCode size={16} />}
                  {fileName.endsWith('.json') && <FileJson size={16} />}
                  {fileName.endsWith('.md') && <FileText size={16} />}
                  {fileName}
                  {activeFile === fileName && <ChevronRight size={16} className="ml-auto opacity-50" />}
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-border bg-muted/10 text-xs text-muted-foreground">
              <p className="mb-2 font-bold">{t('examples.quick_start')}</p>
              <code className="bg-black/20 px-2 py-1 rounded block mb-2">
                blockcell skills install weather_query
              </code>
            </div>
          </motion.div>

          {/* Code Viewer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="min-h-[420px] md:min-h-[600px] bg-[#1e1e1e] border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#252526]">
              <span className="text-sm text-muted-foreground font-mono">{activeFile}</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 custom-scrollbar">
              <pre className="font-mono text-sm leading-relaxed">
                <code className="language-rust text-gray-300">
                  {files[activeFile]}
                </code>
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Explanation Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-rust/10 flex items-center justify-center mb-4 text-rust">
              <FileCode size={20} />
            </div>
            <h3 className="font-bold mb-2">{t('examples.explainer.logic.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('examples.explainer.logic.desc')}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
              <FileJson size={20} />
            </div>
            <h3 className="font-bold mb-2">{t('examples.explainer.config.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('examples.explainer.config.desc')}
            </p>
          </div>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4 text-yellow-500">
              <FileText size={20} />
            </div>
            <h3 className="font-bold mb-2">{t('examples.explainer.docs.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('examples.explainer.docs.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const files = {
  'SKILL.rhai': `// Weather Query Skill v2.0
// 天气查询 — 基于 wttr.in，无需 API Key

// 请求 wttr.in JSON API
fn fetch_wttr(city) {
    let url = "https://wttr.in/" + city + "?format=j1&lang=zh";
    let res = call_tool("http_request", #{
        "method": "GET",
        "url": url,
        "headers": #{ "User-Agent": "blockcell/1.0" },
        "timeout": 15
    });
    if is_error(res) { return (); }
    let body = get_field(res, "body");
    if body == () { return (); }
    from_json(body)
}

// 格式化当前天气
fn fmt_current(data, city) {
    let cur = data["current_condition"][0];
    let area = data["nearest_area"][0];
    let desc = zh_desc(cur);
    let icon = weather_icon(desc);

    let lines = [];
    lines.push(icon + " " + city + " — 当前天气");
    lines.push("━━━━━━━━━━━━━━━━━━");
    lines.push("🌡️ 温度: " + cur["temp_C"] + "°C");
    lines.push(icon + " 天气: " + desc);
    lines.push("💧 湿度: " + cur["humidity"] + "%");
    lines.push("🌬️ 风: " + cur["windspeedKmph"] + " km/h");
    
    lines.join("\\n")
}

// ── 主入口 ──
let city = "";
let input = user_input;

if input.contains("天气") {
    let idx = input.index_of("天气");
    if idx > 0 { city = input.sub_string(0, idx); }
}
if city == "" { city = "北京"; }

log("weather_query: 查询城市 → " + city);

let data = fetch_wttr(city);
if data == () {
    set_output("❌ 无法获取 " + city + " 的天气数据");
} else {
    set_output(fmt_current(data, city));
}`,
  'config.json': `{
  "skill": {
    "name": "weather_query",
    "version": "2.0.0",
    "description": "查询全球城市天气（wttr.in，免API Key）",
    "author": "blockcell",
    "language": "zh"
  },
  "triggers": {
    "keywords": ["天气", "温度", "weather", "forecast"],
    "patterns": ["{city}天气", "weather in {city}"]
  },
  "config": {
    "api": "https://wttr.in",
    "timeout_secs": 15
  }
}`,
  'SKILL.md': `# 天气查询 weather_query v2.0

数据源: https://wttr.in (免费，无需 API Key，全球覆盖)

## 触发词

北京天气 / 上海今天多少度 / London weather

## 工作流程

1. 从用户输入提取城市名（"XX天气" → XX）
2. 调用 \`http_request\` GET \`https://wttr.in/{city}\`
3. 解析 JSON → 格式化输出（当前天气 + 3天预报）

## 输出内容

- 温度 / 体感温度
- 天气状况（中文）
- 湿度 / 风向风速
`
};

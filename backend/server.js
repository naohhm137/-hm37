require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { getMatchNews, getTeamDeepNews } = require('./search');

const app = express();

// ── Configuration (all from environment) ──
const PORT = process.env.PORT || 3000;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// In production, allow all origins (for sharing); in dev, use localhost
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? '*'
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500', 'http://127.0.0.1:5500'];

// Startup check
if (!DEEPSEEK_API_KEY) {
  console.error('FATAL: DEEPSEEK_API_KEY not found in .env file');
  console.error('Create a .env file with: DEEPSEEK_API_KEY=your-key-here');
  process.exit(1);
}

// ── Security Middleware ──
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: '*', methods: ['GET', 'POST'] }
  : {
      origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      maxAge: 86400,
    };

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  if (now > record.resetAt) { record.count = 0; record.resetAt = now + RATE_LIMIT_WINDOW; }
  record.count++;
  rateLimitMap.set(ip, record);
  if (record.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ success: false, error: '请求过于频繁 请稍后再试' });
  }
  res.set('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX - record.count));
  next();
}

// Input validation
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>{}[\]]/g, '').substring(0, 500);
}

function validateAnalysisRequest(req, res, next) {
  const { team1, team2, team1Rank, team2Rank } = req.body;
  if (!team1 || !team2) {
    return res.status(400).json({ success: false, error: '请提供两支球队' });
  }
  if (team1 === team2) {
    return res.status(400).json({ success: false, error: '不能分析同一支球队' });
  }
  const rank1 = parseInt(team1Rank), rank2 = parseInt(team2Rank);
  if (isNaN(rank1) || rank1 < 1 || rank1 > 220 || isNaN(rank2) || rank2 < 1 || rank2 > 220) {
    return res.status(400).json({ success: false, error: 'FIFA排名无效' });
  }
  req.sanitized = {
    team1: sanitize(team1), team2: sanitize(team2),
    team1Opinion: sanitize(req.body.team1Opinion || ''),
    team2Opinion: sanitize(req.body.team2Opinion || ''),
    team1Roster: sanitize(req.body.team1Roster || ''),
    team2Roster: sanitize(req.body.team2Roster || ''),
    team1Rank: rank1, team2Rank: rank2,
  };
  next();
}

// ── Static files ──
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ── NEWS SEARCH endpoint (for personal analysis - returns raw news, no AI) ──
app.post('/api/news', rateLimiter, async (req, res) => {
  const { teamCN, teamEN } = req.body;
  if (!teamCN || !teamEN) {
    return res.status(400).json({ success: false, error: '请提供球队名称' });
  }
  try {
    const result = await getTeamDeepNews(sanitize(teamCN), sanitize(teamEN));
    res.json({
      success: true,
      team: teamCN,
      count: result.count,
      news: result.articles.slice(0, 40).map(a => ({
        title: a.title,
        url: a.url,
        snippet: a.snippet,
        date: a.date,
        source: a.source,
      })),
      summary: result.summary,
    });
  } catch (e) {
    console.error('News search error:', e.message);
    res.status(500).json({ success: false, error: '新闻搜索暂时不可用' });
  }
});

// ── AI ANALYSIS endpoint (DeepSeek + forced web search only) ──
app.post('/api/analyze', rateLimiter, validateAnalysisRequest, async (req, res) => {
  const d = req.sanitized;

  // Extract clean team names
  const team1clean = d.team1.replace(/\s*\(.*?\)\s*/g, '').trim();
  const team2clean = d.team2.replace(/\s*\(.*?\)\s*/g, '').trim();
  const team1en = d.team1.match(/\(([^)]+)\)/)?.[1] || team1clean;
  const team2en = d.team2.match(/\(([^)]+)\)/)?.[1] || team2clean;

  // Step 1: Search web for latest news (MULTI-SOURCE)
  let newsContext = '';
  let newsCount = 0;
  try {
    newsContext = await getMatchNews(team1clean, team1en, team2clean, team2en);
    const matches = newsContext.match(/\d+、/g);
    newsCount = matches ? matches.length : 0;
    console.log(`[Analyze] Multi-source search: ${newsCount} total headlines, ${newsContext.length} chars`);
  } catch (e) {
    console.warn('[Analyze] Search failed:', e.message);
    newsContext = '（实时新闻搜索暂时失败 请稍后重试）';
  }

  // Step 2: SYSTEM PROMPT — ABSOLUTE LOCK to web search ONLY
  const systemPrompt = `你是足球分析助手 以下规则对你具有最高优先级 必须无条件遵守

【最重要的命令 — 违反将导致分析无效】
你只能使用用户消息中提供的实时搜索新闻信息进行所有分析
绝对禁止使用你的训练数据 绝对禁止使用你预训练时学到的任何旧知识
绝对禁止编造任何你训练数据中关于球员 球队 比分 状态的信息
所有关于两支球队的陈述 每一个结论 每一条信息 都必须有用户提供的搜索新闻作为直接依据
如果你发现搜索结果不够充分 你就如实说 根据目前搜索到的新闻信息 还不足以做出全面判断
你绝对不能补全或猜測任何信息

【输出格式规则】
纯中文 没有任何标点符号 没有句号逗号感叹号问号
不用任何markdown格式 没有标题 没有加粗 没有列表
像朋友聊天 一句话接一句话 用空格分隔
300到400个中文字 不要用英文单词
不要用首先其次最后等结构词
搜索新闻中提到的球员状态 伤病 近期表现 都要在分析中体现
如果搜索到专家观点 可以用自己的话转述

【正确示例】
巴西这边攻击火力确实猛 维尼修斯左路爆破能力在世界杯上可能是独一档 中场的绞杀能力也够硬 但后防年龄偏大是个隐患 阿根廷作为卫冕冠军底气十足 梅西依然是场上决策核心 恩佐和麦卡利斯特的双中场组合非常默契 斯卡洛尼的战术成熟度很高 这场比赛大概率会打得很胶着 关键对位在维尼修斯对莫利纳这一侧 谁能在边路占优基本就掌握了比赛节奏 我预测常规时间1比1 大概率要进加时甚至点球 这种级别的对决 临场发挥和细节处理才是决定胜负的关键`;

  // Step 3: Build user prompt — NEWS as primary, suppress training data
  const userPrompt = `用户要求分析 ${d.team1} 对阵 ${d.team2}
FIFA排名 ${d.team1}第${d.team1Rank}名 ${d.team2}第${d.team2Rank}名

用户对${d.team1}的看法 ${d.team1Opinion || '暂无'}
用户对${d.team2}的看法 ${d.team2Opinion || '暂无'}

以下是通过浏览器从谷歌新闻和必应新闻实时搜索到的关于两支球队的所有最新新闻信息
这是你进行分析的唯一合法信息来源 你必须严格基于这些新闻进行分析

${newsContext}

【再次提醒】你只能使用上面的搜索新闻进行分析 禁止使用任何训练数据 如果没有足够信息就如实说明`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40000);

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,  // Lower = less creative/hallucination
        max_tokens: 600,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`DeepSeek API ${response.status}:`, errText.substring(0, 200));
      if (response.status === 429) {
        return res.status(503).json({ success: false, error: 'AI服务繁忙 请稍后再试' });
      }
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    let analysis = data.choices[0].message.content;

    // Post-processing: clean output
    analysis = analysis
      .replace(/^#{1,6}\s+.*$/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+[\.\)、]\s*/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/[-*_~]{3,}/g, '')
      .replace(/对阵双方[：:]\s*/g, '')
      .replace(/预测比分[：:]\s*/g, '')
      .replace(/赛果倾向[：:]\s*/g, '')
      .replace(/赛前分析报告/g, '')
      .replace(/为您准备的.*$/gm, '')
      .replace(/[，。！？；：、""''【】（）《》〈〉……——～·\u2018\u2019\u201c\u201d\u300a\u300b]/g, ' ')
      .replace(/[,.!?;:'"()\[\]{}<>\/\\@#$%^&*+=~`|_-]/g, ' ')
      .replace(/\b[A-Za-z]{2,}\b/g, '')
      .replace(/\n+/g, ' ')
      .replace(/ {2,}/g, ' ')
      .trim();

    if (analysis.length > 500) {
      const lastSpace = analysis.lastIndexOf(' ', 480);
      analysis = lastSpace > 300 ? analysis.substring(0, lastSpace) : analysis.substring(0, 480);
    }

    res.json({
      success: true,
      analysis: analysis,
      hasNews: newsContext.length > 50,
      newsCount: newsCount,
      model: data.model,
      tokens: data.usage,
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    if (error.name === 'AbortError') {
      return res.status(504).json({ success: false, error: 'AI分析超时 请重试' });
    }
    res.status(500).json({ success: false, error: 'AI分析暂时不可用 请稍后重试' });
  }
});

// ── Graceful Shutdown ──
const server = app.listen(PORT, () => {
  console.log(`⚽ World Cup 2026 Backend — http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api/analyze`);
  console.log(`📰 News: http://localhost:${PORT}/api/news`);
  console.log(`🔑 DeepSeek: ${DEEPSEEK_API_KEY ? 'CONFIGURED' : 'MISSING'}`);
  console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => { console.log('Shutting down...'); server.close(() => process.exit(0)); });
process.on('SIGINT', () => { console.log('Shutting down...'); server.close(() => process.exit(0)); });

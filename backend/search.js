/**
 * World Cup News Search Module - Multi-Source RSS
 * Locks DeepSeek to ONLY use browser-searched news, ZERO training data
 * Sources: Google News RSS (EN + CN), Bing News RSS
 */

const SEARCH_TIMEOUT = 15000;
const MAX_RESULTS = 15; // per query

/**
 * Fetch Google News RSS - completely free, no API key
 */
async function searchGoogleRSS(query, hl = 'en-US', gl = 'US') {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}&ceid=${gl}:${hl.split('-')[0]}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    const results = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match, count = 0;
    while ((match = itemRegex.exec(xml)) !== null && count < MAX_RESULTS) {
      const item = match[1];
      const titleMatch = /<title>(.*?)<\/title>/.exec(item);
      const linkMatch = /<link>(.*?)<\/link>/.exec(item);
      const descMatch = /<description>(.*?)<\/description>/.exec(item);
      const dateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(item);
      const sourceMatch = /<source[^>]*>(.*?)<\/source>/.exec(item);
      if (titleMatch) {
        results.push({
          title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
          url: linkMatch ? linkMatch[1].trim() : '',
          snippet: descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim().substring(0, 200) : '',
          date: dateMatch ? dateMatch[1] : '',
          source: sourceMatch ? sourceMatch[1] : '',
        });
        count++;
      }
    }
    return results;
  } catch (e) {
    console.warn(`[Google RSS] "${query}" failed:`, e.message);
    return [];
  }
}

/**
 * Fetch Bing News RSS
 */
async function searchBingRSS(query) {
  const url = `https://www.bing.com/news/search?q=${encodeURIComponent(query)}&format=rss`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const xml = await res.text();
    const results = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match, count = 0;
    while ((match = itemRegex.exec(xml)) !== null && count < MAX_RESULTS) {
      const item = match[1];
      const titleMatch = /<title>(.*?)<\/title>/.exec(item);
      const linkMatch = /<link>(.*?)<\/link>/.exec(item);
      const descMatch = /<description>(.*?)<\/description>/.exec(item);
      if (titleMatch) {
        results.push({
          title: titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
          url: linkMatch ? linkMatch[1].trim() : '',
          snippet: descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim().substring(0, 200) : '',
          date: '', source: 'Bing News',
        });
        count++;
      }
    }
    return results;
  } catch (e) {
    console.warn(`[Bing RSS] "${query}" failed:`, e.message);
    return [];
  }
}

/**
 * Search for latest news about a team from ALL sources
 */
async function searchTeamNews(teamNameEN, teamNameCN) {
  const queries = [
    // English queries - multiple angles
    { q: `${teamNameEN} 2026 World Cup soccer`, hl: 'en-US', gl: 'US' },
    { q: `${teamNameEN} football team news June 2026`, hl: 'en-US', gl: 'US' },
    { q: `${teamNameEN} starting lineup injury update`, hl: 'en-US', gl: 'US' },
  ];

  // Chinese queries
  if (teamNameCN && teamNameCN !== teamNameEN) {
    queries.push(
      { q: `${teamNameCN} 2026 世界杯 最新消息`, hl: 'zh-CN', gl: 'CN' },
      { q: `${teamNameCN} 足球 阵容 伤病 新闻`, hl: 'zh-CN', gl: 'CN' },
      { q: `${teamNameCN} 世界杯 备战 状态`, hl: 'zh-CN', gl: 'CN' },
    );
  }

  // Run all Google RSS queries in parallel
  const googlePromises = queries.map(q => searchGoogleRSS(q.q, q.hl, q.gl));
  // Also try Bing for the first English query
  const bingPromise = searchBingRSS(`${teamNameEN} World Cup 2026`);

  const allResults = await Promise.all([...googlePromises, bingPromise]);

  // Flatten and deduplicate by title similarity
  const flat = allResults.flat();
  const seen = new Set();
  const unique = [];
  for (const r of flat) {
    const key = r.title.substring(0, 50).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
  }

  return unique.slice(0, 30); // Collect up to 30 articles per team
}

/**
 * Format collected news into a comprehensive context
 */
function formatNewsSummary(articles, teamName) {
  if (articles.length === 0) return '';

  const lines = [];
  lines.push(`【${teamName} 最新新闻 — 来自谷歌新闻和必应新闻的实时搜索】`);
  lines.push(`共搜索到 ${articles.length} 条相关新闻标题：`);

  articles.forEach((a, i) => {
    const dateStr = a.date ? ` (${a.date})` : '';
    const sourceStr = a.source ? ` [来源 ${a.source}]` : '';
    lines.push(`${i + 1}、${a.title}${dateStr}${sourceStr}`);
    if (a.snippet && a.snippet.length > 20) {
      lines.push(`   内容摘要 ${a.snippet}`);
    }
  });

  return lines.join('\n');
}

/**
 * Get comprehensive news summary for a match between two teams
 */
async function getMatchNews(team1CN, team1EN, team2CN, team2EN) {
  console.log(`[Search] Multi-source news for ${team1CN} vs ${team2CN}...`);

  const [news1, news2] = await Promise.all([
    searchTeamNews(team1EN, team1CN),
    searchTeamNews(team2EN, team2CN),
  ]);

  console.log(`[Search] ${team1CN}: ${news1.length} articles, ${team2CN}: ${news2.length} articles`);

  const summary1 = formatNewsSummary(news1, team1CN);
  const summary2 = formatNewsSummary(news2, team2CN);

  const result = `${summary1}\n\n${summary2}`;
  console.log(`[Search] Total ${news1.length + news2.length} headlines, ${result.length} chars`);

  return result;
}

/**
 * NEW: Search for extensive news about ONE team (for personal analysis)
 */
async function getTeamDeepNews(teamCN, teamEN) {
  console.log(`[Search] Deep news search for ${teamCN}...`);

  // Extended queries for deeper coverage
  const queries = [
    // English
    { q: `${teamEN} 2026 World Cup`, hl: 'en-US', gl: 'US' },
    { q: `${teamEN} football news`, hl: 'en-US', gl: 'US' },
    { q: `${teamEN} soccer match preview`, hl: 'en-US', gl: 'US' },
    { q: `${teamEN} player stats performance`, hl: 'en-US', gl: 'US' },
    // Chinese
    { q: `${teamCN} 2026 世界杯`, hl: 'zh-CN', gl: 'CN' },
    { q: `${teamCN} 足球 新闻 最新`, hl: 'zh-CN', gl: 'CN' },
    { q: `${teamCN} 世界杯 阵容`, hl: 'zh-CN', gl: 'CN' },
  ];

  const googlePromises = queries.map(q => searchGoogleRSS(q.q, q.hl, q.gl));
  const bingPromise = searchBingRSS(`${teamEN} World Cup`);

  const allResults = await Promise.all([...googlePromises, bingPromise]);
  const flat = allResults.flat();

  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const r of flat) {
    const key = r.title.substring(0, 50).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
  }

  console.log(`[Search] ${teamCN}: ${unique.length} unique articles from all sources`);

  // Return raw article list + formatted summary
  return {
    articles: unique.slice(0, 40),
    summary: formatNewsSummary(unique.slice(0, 40), teamCN),
    count: unique.length,
  };
}

module.exports = { getMatchNews, getTeamDeepNews, searchTeamNews, searchGoogleRSS };

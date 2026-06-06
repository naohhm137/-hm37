/**
 * 2026 World Cup - Frontend Modules
 * Schedule | Standings | Bracket | Team Profile
 */

// ============ NAVIGATION ============
let currentTab = 'predict';

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector(`.nav-tab[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');

  if (tab === 'schedule') renderSchedule();
  else if (tab === 'standings') renderStandings();
  else if (tab === 'bracket') renderBracket();
}

// Tab nav click handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
});

// ============ SCHEDULE MODULE ============
function renderSchedule(groupFilter) {
  const container = document.getElementById('scheduleContent');
  let matches = groupFilter
    ? WORLD_CUP_SCHEDULE.groupStage.filter(m => m.group === groupFilter)
    : [...WORLD_CUP_SCHEDULE.groupStage];

  // Group matches by date
  const byDate = {};
  matches.forEach(m => {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  });

  const groupLabels = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  let html = '<div class="schedule-filters">';
  html += `<button class="sch-filter-btn ${!groupFilter?'active':''}" onclick="renderSchedule()">全部</button>`;
  groupLabels.forEach(g => {
    html += `<button class="sch-filter-btn ${groupFilter===g?'active':''}" onclick="renderSchedule('${g}')">${g}组</button>`;
  });
  html += '</div>';

  const sortedDates = Object.keys(byDate).sort();
  sortedDates.forEach(date => {
    const [y,m,d] = date.split('-');
    const dayOfWeek = ['周日','周一','周二','周三','周四','周五','周六'][new Date(date + 'T12:00:00').getDay()];
    html += `<div class="match-date-group">
      <div class="match-date-header">
        <span class="match-date">${m}月${d}日</span>
        <span class="match-weekday">${dayOfWeek}</span>
      </div>`;

    byDate[date].forEach(match => {
      const t1 = getTeamInfo(match.team1);
      const t2 = getTeamInfo(match.team2);
      const isKnockout = match.round.includes('强') || match.round.includes('决赛');
      const scoreDisplay = match.score ? `${match.score.t1} - ${match.score.t2}` : match.time;

      html += `<div class="match-card">
        <div class="match-round-tag">${match.group || ''} ${match.round}</div>
        <div class="match-teams-row">
          <div class="match-team">
            <div class="match-flag" style="background-image:url(https://flagcdn.com/w320/${t1.flag || t1.id.toLowerCase()}.png)"></div>
            <span class="match-team-name">${t1.cn || t1.nameCN || t1.name}</span>
          </div>
          <div class="match-score">${scoreDisplay}</div>
          <div class="match-team mirror">
            <span class="match-team-name">${t2.cn || t2.nameCN || t2.name}</span>
            <div class="match-flag" style="background-image:url(https://flagcdn.com/w320/${t2.flag || t2.id.toLowerCase()}.png)"></div>
          </div>
        </div>
        <div class="match-venue">${match.venue} · ${match.city}</div>
      </div>`;
    });
    html += '</div>';
  });

  if (matches.length === 0) {
    html += '<div class="empty-state"><p>暂无比赛数据</p></div>';
  }

  container.innerHTML = html;
}

// ============ STANDINGS MODULE ============
function renderStandings() {
  const container = document.getElementById('standingsContent');
  const groupOrder = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  let html = '<div class="standings-grid">';
  groupOrder.forEach(groupKey => {
    const group = WORLD_CUP_GROUPS[groupKey];
    html += `<div class="standings-group-card">
      <div class="standings-group-header">${group.name}</div>
      <table class="standings-table">
        <thead><tr>
          <th class="col-pos">#</th><th class="col-team">球队</th>
          <th class="col-stat">场</th><th class="col-stat">胜</th><th class="col-stat">平</th><th class="col-stat">负</th>
          <th class="col-stat">进</th><th class="col-stat">失</th><th class="col-stat">净</th><th class="col-stat points">分</th>
        </tr></thead><tbody>`;

    // Sort teams by FIFA rank (for initial display; will be updated live)
    const sorted = [...group.teams].sort((a,b) => a.rank - b.rank);
    sorted.forEach((team, i) => {
      const record = getTeamRecord(team.code); // from live data or defaults
      html += `<tr>
        <td class="pos-${i+1}">${i+1}</td>
        <td class="team-cell">
          <span class="standings-flag" style="background-image:url(https://flagcdn.com/w320/${team.flag}.png)"></span>
          ${team.nameCN}
        </td>
        <td>${record.gp}</td><td>${record.w}</td><td>${record.d}</td><td>${record.l}</td>
        <td>${record.gf}</td><td>${record.ga}</td><td>${record.gf - record.ga}</td>
        <td class="points">${record.pts}</td>
      </tr>`;
    });

    html += '</tbody></table></div>';
  });
  html += '</div>';

  // Knockout qualification note
  html += '<div class="standings-note">小组前两名 + 8个成绩最好的第三名晋级32强淘汰赛</div>';

  container.innerHTML = html;
}

// Default records (pre-tournament: all zeros)
function getTeamRecord(code) {
  // This will be updated with live data during the tournament
  if (LIVE_STANDINGS && LIVE_STANDINGS[code]) {
    return LIVE_STANDINGS[code];
  }
  return { gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
}

// Placeholder live standings (will be updated during tournament)
const LIVE_STANDINGS = {};

// ============ BRACKET MODULE - PREMIUM WORLD CUP TREE ============

function renderBracket() {
  const container = document.getElementById('bracketContent');

  // ---- POSITION LABEL HELPER ----
  function getPosInfo(code) {
    if (!code) return { label: '待定', flag: null };
    if (code === '3rd') return { label: '小组第3', flag: null, isPos: true };
    if (code.startsWith('W-')) return { label: code.replace('W-', '') + ' 胜者', flag: null, isPos: true };
    if (code.startsWith('L-')) return { label: code.replace('L-', '') + ' 负者', flag: null, isPos: true };
    const m = code.match(/^([A-L])([12])$/);
    if (m) {
      const grp = WORLD_CUP_GROUPS[m[1]];
      const posNames = { 1: '第1', 2: '第2' };
      if (grp) {
        const teamIdx = parseInt(m[2]) - 1;
        const team = grp.teams[teamIdx];
        if (team) return { label: m[1] + '组' + posNames[m[2]], flag: team.flag, isPos: true };
      }
      return { label: m[1] + '组' + posNames[m[2]], flag: null, isPos: true };
    }
    return { label: code, flag: null, isPos: true };
  }

  function getFlagUrl(flagCode) {
    if (!flagCode) return '';
    return `https://flagcdn.com/w320/${flagCode}.png`;
  }

  // ---- RENDER A SINGLE MATCH CARD ----
  function renderMatchCard(match, roundLabel, matchLabel) {
    const p1 = getPosInfo(match.team1);
    const p2 = getPosInfo(match.team2);
    const dateParts = match.date ? match.date.split('-') : null;
    const dateStr = dateParts ? dateParts[1] + '月' + dateParts[2] + '日' : '';

    let html = `<div class="bt-match" data-id="${match.id}" data-round="${roundLabel}">
      <div class="bt-match-id">${matchLabel || match.id}</div>
      <div class="bt-team bt-top">
        <span class="bt-flag" style="background-image:url(${getFlagUrl(p1.flag)})"></span>
        <span class="bt-label${p1.isPos ? ' position-label' : ''}">${p1.label}</span>
      </div>
      <div class="bt-team bt-bottom">
        <span class="bt-flag" style="background-image:url(${getFlagUrl(p2.flag)})"></span>
        <span class="bt-label${p2.isPos ? ' position-label' : ''}">${p2.label}</span>
      </div>`;
    if (dateStr) html += `<div class="bt-date">${dateStr} · ${match.venue || ''}</div>`;
    html += '</div>';
    return html;
  }

  // ---- BRACKET TREE DATA ----
  // Top half bracket (→ SF1 → Final)
  const topHalfR32 = [
    { id:'R32-1', team1:'A2', team2:'B2', match:'M1', date:'2026-06-28', venue:'SoFi Stadium' },
    { id:'R32-4', team1:'F1', team2:'C2', match:'M3', date:'2026-06-29', venue:'Estadio BBVA' },
    { id:'R32-3', team1:'E1', team2:'3rd', match:'M2', date:'2026-06-29', venue:'Gillette Stadium' },
    { id:'R32-6', team1:'I1', team2:'3rd', match:'M5', date:'2026-06-30', venue:'MetLife Stadium' },
    { id:'R32-12', team1:'K2', team2:'L2', match:'M11', date:'2026-07-02', venue:'BMO Field' },
    { id:'R32-11', team1:'H1', team2:'J2', match:'M12', date:'2026-07-02', venue:'SoFi Stadium' },
    { id:'R32-10', team1:'D1', team2:'3rd', match:'M9', date:'2026-07-01', venue:'Levi\'s Stadium' },
    { id:'R32-9', team1:'G1', team2:'3rd', match:'M10', date:'2026-07-01', venue:'Lumen Field' }
  ];

  const topHalfR16 = [
    { id:'R16-1', team1:'W-M1', team2:'W-M3', match:'R16', date:'2026-07-04', venue:'NRG Stadium' },
    { id:'R16-2', team1:'W-M2', team2:'W-M5', match:'R16', date:'2026-07-04', venue:'Lincoln Financial' },
    { id:'R16-5', team1:'W-M11', team2:'W-M12', match:'R16', date:'2026-07-06', venue:'AT&T Stadium' },
    { id:'R16-6', team1:'W-M9', team2:'W-M10', match:'R16', date:'2026-07-06', venue:'Lumen Field' }
  ];

  const topHalfQF = [
    { id:'QF-1', team1:'W-R16-1', team2:'W-R16-2', match:'QF', date:'2026-07-09', venue:'Gillette Stadium' },
    { id:'QF-2', team1:'W-R16-5', team2:'W-R16-6', match:'QF', date:'2026-07-10', venue:'SoFi Stadium' }
  ];

  const topHalfSF = [
    { id:'SF-1', team1:'W-QF1', team2:'W-QF2', match:'SF', date:'2026-07-14', venue:'AT&T Stadium' }
  ];

  // Bottom half bracket (→ SF2 → Final)
  const bottomHalfSF = [
    { id:'SF-2', team1:'W-QF3', team2:'W-QF4', match:'SF', date:'2026-07-15', venue:'Mercedes-Benz' }
  ];

  const bottomHalfQF = [
    { id:'QF-3', team1:'W-R16-3', team2:'W-R16-4', match:'QF', date:'2026-07-11', venue:'Hard Rock Stadium' },
    { id:'QF-4', team1:'W-R16-7', team2:'W-R16-8', match:'QF', date:'2026-07-11', venue:'Arrowhead Stadium' }
  ];

  const bottomHalfR16 = [
    { id:'R16-3', team1:'W-M4', team2:'W-M6', match:'R16', date:'2026-07-05', venue:'MetLife Stadium' },
    { id:'R16-4', team1:'W-M7', team2:'W-M8', match:'R16', date:'2026-07-05', venue:'Estadio Azteca' },
    { id:'R16-7', team1:'W-M14', team2:'W-M16', match:'R16', date:'2026-07-07', venue:'Mercedes-Benz' },
    { id:'R16-8', team1:'W-M13', team2:'W-M15', match:'R16', date:'2026-07-07', venue:'BC Place' }
  ];

  const bottomHalfR32 = [
    { id:'R32-2', team1:'C1', team2:'F2', match:'M4', date:'2026-06-29', venue:'NRG Stadium' },
    { id:'R32-5', team1:'E2', team2:'I2', match:'M6', date:'2026-06-30', venue:'AT&T Stadium' },
    { id:'R32-7', team1:'A1', team2:'3rd', match:'M7', date:'2026-06-30', venue:'Estadio Azteca' },
    { id:'R32-8', team1:'L1', team2:'3rd', match:'M8', date:'2026-07-01', venue:'Mercedes-Benz' },
    { id:'R32-14', team1:'D2', team2:'G2', match:'M16', date:'2026-07-03', venue:'AT&T Stadium' },
    { id:'R32-16', team1:'K1', team2:'3rd', match:'M15', date:'2026-07-03', venue:'Arrowhead Stadium' },
    { id:'R32-13', team1:'B1', team2:'3rd', match:'M13', date:'2026-07-02', venue:'BC Place' },
    { id:'R32-15', team1:'J1', team2:'H2', match:'M14', date:'2026-07-03', venue:'Hard Rock Stadium' }
  ];

  // ---- RENDER HTML ----
  let html = '<div class="bracket-scroll"><div class="bracket-tree">';

  // Helper to render a column of matches
  function renderRoundCol(matches, title) {
    let h = `<div class="bt-round"><div class="bt-round-title">${title}</div><div class="bt-round-matches">`;
    matches.forEach(m => {
      h += renderMatchCard(m, title, m.match || '');
    });
    h += '</div></div>';
    return h;
  }

  // LEFT SIDE: Top half (R32 → R16 → QF → SF)
  html += renderRoundCol(topHalfR32, '32强');
  html += renderRoundCol(topHalfR16, '16强');
  html += renderRoundCol(topHalfQF, '1/4决赛');
  html += renderRoundCol(topHalfSF, '半决赛');

  // CENTER: Final + 3rd place + Trophy
  html += '<div class="bt-round bt-center-col"><div class="bt-round-title">决赛</div><div class="bt-round-matches">';
  // 3rd place match
  const thirdPlace = WORLD_CUP_SCHEDULE.knockout.thirdPlace;
  html += `<div class="bt-match bt-third" data-id="3P" data-round="3rd">
    <div class="bt-match-id">三四名决赛</div>
    <div class="bt-team bt-top">
      <span class="bt-flag" style="background-image:url()"></span>
      <span class="bt-label position-label">L-SF1 负者</span>
    </div>
    <div class="bt-team bt-bottom">
      <span class="bt-flag" style="background-image:url()"></span>
      <span class="bt-label position-label">L-SF2 负者</span>
    </div>
    <div class="bt-date">7月18日 · 迈阿密</div>
  </div>`;

  // Trophy
  html += '<div class="bt-trophy-center"><div class="bt-trophy-wrap"><div class="bt-trophy-img"></div><div class="bt-champions">CHAMPIONS</div></div></div>';

  // Final match
  html += `<div class="bt-match bt-champion-match" data-id="FINAL" data-round="final">
    <div class="bt-match-id">决赛 · 7月19日</div>
    <div class="bt-team bt-top">
      <span class="bt-flag" style="background-image:url()"></span>
      <span class="bt-label position-label">W-SF1 胜者</span>
    </div>
    <div class="bt-team bt-bottom">
      <span class="bt-flag" style="background-image:url()"></span>
      <span class="bt-label position-label">W-SF2 胜者</span>
    </div>
    <div class="bt-date">MetLife Stadium · 纽约</div>
  </div>`;
  html += '</div></div>'; // center col

  // RIGHT SIDE: Bottom half (SF ← QF ← R16 ← R32) - mirrored
  html += renderRoundCol(bottomHalfSF, '半决赛');
  html += renderRoundCol(bottomHalfQF, '1/4决赛');
  html += renderRoundCol(bottomHalfR16, '16强');
  html += renderRoundCol(bottomHalfR32, '32强');

  html += '</div>'; // bracket-tree

  // SVG layer for connector lines
  html += '<svg class="bt-lines" id="btLines" preserveAspectRatio="xMidYMid meet"></svg>';
  html += '</div>'; // bracket-scroll

  container.innerHTML = html;

  // Draw connector lines after DOM rendered
  requestAnimationFrame(() => {
    requestAnimationFrame(() => drawBracketLines());
  });
}

// ---- DRAW BRACKET CONNECTOR LINES ----
function drawBracketLines() {
  const svg = document.getElementById('btLines');
  const scroll = document.querySelector('.bracket-scroll');
  if (!svg || !scroll) return;

  const scrollRect = scroll.getBoundingClientRect();
  const scrollLeft = scroll.scrollLeft;
  const scrollTop = scroll.scrollTop;

  svg.setAttribute('width', scroll.scrollWidth);
  svg.setAttribute('height', scroll.scrollHeight);
  svg.style.width = scroll.scrollWidth + 'px';
  svg.style.height = scroll.scrollHeight + 'px';

  // Get container-relative position of an element
  function relPos(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: r.left - scrollRect.left + scrollLeft,
      y: r.top - scrollRect.top + scrollTop,
      w: r.width,
      h: r.height
    };
  }

  // Connection map: which pairs of R32/R16 matches feed which next-round match
  const connections = {
    'R32-1,R32-4': 'R16-1',
    'R32-3,R32-6': 'R16-2',
    'R32-12,R32-11': 'R16-5',
    'R32-10,R32-9': 'R16-6',
    'R32-2,R32-5': 'R16-3',
    'R32-7,R32-8': 'R16-4',
    'R32-14,R32-16': 'R16-7',
    'R32-13,R32-15': 'R16-8',
    'R16-1,R16-2': 'QF-1',
    'R16-5,R16-6': 'QF-2',
    'R16-3,R16-4': 'QF-3',
    'R16-7,R16-8': 'QF-4',
    'QF-1,QF-2': 'SF-1',
    'QF-3,QF-4': 'SF-2',
  };

  let pathD = '';

  Object.entries(connections).forEach(([pairKey, targetId]) => {
    const [id1, id2] = pairKey.split(',');
    const p1 = relPos(document.querySelector(`.bt-match[data-id="${id1}"]`));
    const p2 = relPos(document.querySelector(`.bt-match[data-id="${id2}"]`));
    const pt = relPos(document.querySelector(`.bt-match[data-id="${targetId}"]`));

    if (!p1 || !p2 || !pt) return;

    const y1 = p1.y + p1.h/2;
    const y2 = p2.y + p2.h/2;
    const yt = pt.y + pt.h/2;
    const x1 = p1.x + p1.w;
    const x2 = p2.x + p2.w;
    const xt = pt.x;
    const bx = (x1 + x2) / 2 + 12;

    // Draw bracket: source matches → horizontal to bracket → vertical to target Y → horizontal to target
    pathD += `M${x1},${y1} L${bx},${y1} L${bx},${yt} L${xt},${yt} `;
    pathD += `M${x2},${y2} L${bx},${y2} `;
  });

  // SF → Final
  const sf1 = relPos(document.querySelector('.bt-match[data-id="SF-1"]'));
  const sf2 = relPos(document.querySelector('.bt-match[data-id="SF-2"]'));
  const fin = relPos(document.querySelector('.bt-match[data-id="FINAL"]'));
  if (sf1 && sf2 && fin) {
    const ys1 = sf1.y + sf1.h/2;
    const ys2 = sf2.y + sf2.h/2;
    const yf = fin.y + fin.h/2;
    const xs1 = sf1.x + sf1.w;
    const xs2 = sf2.x + sf2.w;
    const xf = fin.x;
    pathD += `M${xs1},${ys1} L${xf},${yf} `;
    pathD += `M${xs2},${ys2} L${xf},${ys2} `;
  }

  // SF → 3rd place
  const tp = relPos(document.querySelector('.bt-match[data-id="3P"]'));
  if (sf1 && sf2 && tp) {
    const ys1 = sf1.y + sf1.h/2;
    const ys2 = sf2.y + sf2.h/2;
    const ytp = tp.y + tp.h/2;
    const xs1 = sf1.x + sf1.w;
    const xs2 = sf2.x + sf2.w;
    const xtp = tp.x;
    pathD += `M${xs1},${ys1} L${xtp},${ytp} `;
    pathD += `M${xs2},${ys2} L${xtp},${ys2} `;
  }

  svg.innerHTML = `<path d="${pathD}" stroke="rgba(200,169,81,0.35)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// Re-draw lines on window resize
let bracketResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(bracketResizeTimer);
  bracketResizeTimer = setTimeout(() => {
    const svg = document.getElementById('btLines');
    if (svg) drawBracketLines();
  }, 300);
});

// ============ TEAM PROFILE (in Roster Tab) ============
function renderTeamProfile(code) {
  const profile = getTeamProfileDisplay(code);
  if (!profile) return '<div class="profile-empty">暂无球队介绍数据</div>';

  return `<div class="team-profile-card">
    <div class="profile-section">
      <div class="profile-label">${profile.style.label}</div>
      <div class="profile-content">${profile.style.content}</div>
    </div>
    <div class="profile-section">
      <div class="profile-label">${profile.tactics.label}</div>
      <div class="profile-content">${profile.tactics.content}</div>
    </div>
    <div class="profile-section">
      <div class="profile-label">${profile.recentForm.label}</div>
      <div class="profile-content">${profile.recentForm.content}</div>
    </div>
    <div class="profile-section coach">
      <div class="profile-label">${profile.coach.label}</div>
      <div class="profile-content">${profile.coach.content}</div>
    </div>
  </div>`;
}

// ============ GET TEAM INFO HELPER ============
function getTeamInfo(code) {
  // Search in WORLD_CUP_GROUPS first
  for (const group of Object.values(WORLD_CUP_GROUPS)) {
    const found = group.teams.find(t => t.code === code);
    if (found) return found;
  }
  // Search in TEAMS array (original)
  const t = TEAMS.find(t => t.id === code);
  if (t) return t;
  return { id: code, cn: code, name: code, flag: code.toLowerCase() };
}

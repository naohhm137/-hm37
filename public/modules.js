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

// ============ BRACKET MODULE ============
function renderBracket() {
  const container = document.getElementById('bracketContent');
  let html = '<div class="bracket-container">';

  // Round of 32
  html += '<div class="bracket-round"><div class="bracket-round-title">32强</div><div class="bracket-matches">';
  WORLD_CUP_SCHEDULE.knockout.round32.forEach((m, i) => {
    html += renderBracketMatch(m, i);
  });
  html += '</div></div>';

  // Round of 16
  html += '<div class="bracket-round"><div class="bracket-round-title">16强</div><div class="bracket-matches">';
  WORLD_CUP_SCHEDULE.knockout.round16.forEach((m, i) => {
    html += renderBracketMatch(m, i);
  });
  html += '</div></div>';

  // Quarterfinals
  html += '<div class="bracket-round"><div class="bracket-round-title">1/4决赛</div><div class="bracket-matches">';
  WORLD_CUP_SCHEDULE.knockout.quarterfinals.forEach((m, i) => {
    html += renderBracketMatch(m, i);
  });
  html += '</div></div>';

  // Semifinals
  html += '<div class="bracket-round"><div class="bracket-round-title">半决赛</div><div class="bracket-matches">';
  WORLD_CUP_SCHEDULE.knockout.semifinals.forEach((m, i) => {
    html += renderBracketMatch(m, i);
  });
  html += '</div></div>';

  // Third place + Final
  html += '<div class="bracket-round"><div class="bracket-round-title">决赛</div><div class="bracket-matches">';
  html += renderBracketMatch(WORLD_CUP_SCHEDULE.knockout.thirdPlace, 0, '三四名');
  html += renderBracketMatch(WORLD_CUP_SCHEDULE.knockout.final, 1, '决赛');
  html += '</div></div>';

  html += '</div>';
  container.innerHTML = html;
}

function renderBracketMatch(match, index, label) {
  const t1Display = resolveSlot(match.team1);
  const t2Display = resolveSlot(match.team2);
  const scoreDisplay = match.score ? `${match.score.t1} - ${match.score.t2}` : 'vs';
  const roundLabel = label || match.round;

  return `<div class="bracket-match">
    <div class="bm-round">${roundLabel}</div>
    <div class="bm-teams">
      <div class="bm-team">
        <span class="bm-name">${t1Display}</span>
        ${match.score ? `<span class="bm-score">${match.score.t1}</span>` : ''}
      </div>
      <div class="bm-divider">${match.score ? '-' : 'vs'}</div>
      <div class="bm-team">
        <span class="bm-name">${t2Display}</span>
        ${match.score ? `<span class="bm-score">${match.score.t2}</span>` : ''}
      </div>
    </div>
    <div class="bm-info">${match.date.split('-')[1]}月${match.date.split('-')[2]}日 · ${match.venue}</div>
  </div>`;
}

function resolveSlot(slot) {
  if (!slot) return '待定';
  if (slot.startsWith('W-')) return slot.replace('W-', '') + '胜者';
  if (slot.startsWith('L-')) return slot.replace('L-', '') + '负者';
  // Map group positions to team names (to be resolved during tournament)
  const posMap = { 'A1':'A组第1', 'B1':'B组第1', 'C1':'C组第1', 'D1':'D组第1', 'E1':'E组第1', 'F1':'F组第1', 'G1':'G组第1', 'H1':'H组第1', 'I1':'I组第1', 'J1':'J组第1', 'K1':'K组第1', 'L1':'L组第1', 'A2':'A组第2', 'B2':'B组第2', 'C2':'C组第2', 'D2':'D组第2', 'E2':'E组第2', 'F2':'F组第2', 'G2':'G组第2', 'H2':'H组第2', 'I2':'I组第2', 'J2':'J组第2', 'K2':'K组第2', 'L2':'L组第2', '3rd':'小组第3' };
  return posMap[slot] || slot;
}

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

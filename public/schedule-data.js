/**
 * 2026 FIFA World Cup - Complete Match Schedule
 * 104 matches: 72 group stage + 32 knockout
 * Based on official FIFA schedule (times in ET, UTC-4)
 */

const WORLD_CUP_SCHEDULE = {
  groupStage: [
    // ===== MATCHDAY 1 =====
    // June 11
    { id:"GS-A1", date:"2026-06-11", time:"15:00", group:"A", team1:"MEX", team2:"RSA", venue:"Mexico City Stadium", city:"墨西哥城", round:"小组赛第1轮" },
    { id:"GS-A2", date:"2026-06-11", time:"22:00", group:"A", team1:"KOR", team2:"CZE", venue:"Estadio Guadalajara", city:"瓜达拉哈拉", round:"小组赛第1轮" },
    // June 12
    { id:"GS-B1", date:"2026-06-12", time:"15:00", group:"B", team1:"CAN", team2:"BIH", venue:"BMO Field", city:"多伦多", round:"小组赛第1轮" },
    { id:"GS-D1", date:"2026-06-12", time:"21:00", group:"D", team1:"USA", team2:"PAR", venue:"SoFi Stadium", city:"洛杉矶", round:"小组赛第1轮" },
    // June 13
    { id:"GS-B2", date:"2026-06-13", time:"15:00", group:"B", team1:"QAT", team2:"SUI", venue:"Levi's Stadium", city:"旧金山", round:"小组赛第1轮" },
    { id:"GS-C1", date:"2026-06-13", time:"18:00", group:"C", team1:"BRA", team2:"MAR", venue:"MetLife Stadium", city:"纽约", round:"小组赛第1轮" },
    { id:"GS-C2", date:"2026-06-13", time:"21:00", group:"C", team1:"HAI", team2:"SCO", venue:"Gillette Stadium", city:"波士顿", round:"小组赛第1轮" },
    { id:"GS-D2", date:"2026-06-13", time:"00:00", group:"D", team1:"AUS", team2:"TUR", venue:"BC Place", city:"温哥华", round:"小组赛第1轮" },
    // June 14
    { id:"GS-E1", date:"2026-06-14", time:"13:00", group:"E", team1:"GER", team2:"CUW", venue:"NRG Stadium", city:"休斯顿", round:"小组赛第1轮" },
    { id:"GS-F1", date:"2026-06-14", time:"16:00", group:"F", team1:"NED", team2:"JPN", venue:"AT&T Stadium", city:"达拉斯", round:"小组赛第1轮" },
    { id:"GS-E2", date:"2026-06-14", time:"19:00", group:"E", team1:"CIV", team2:"ECU", venue:"Lincoln Financial Field", city:"费城", round:"小组赛第1轮" },
    { id:"GS-F2", date:"2026-06-14", time:"22:00", group:"F", team1:"SWE", team2:"TUN", venue:"Estadio BBVA", city:"蒙特雷", round:"小组赛第1轮" },
    // June 15
    { id:"GS-G1", date:"2026-06-15", time:"12:00", group:"G", team1:"BEL", team2:"EGY", venue:"SoFi Stadium", city:"洛杉矶", round:"小组赛第1轮" },
    { id:"GS-H1", date:"2026-06-15", time:"15:00", group:"H", team1:"ESP", team2:"CPV", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"小组赛第1轮" },
    { id:"GS-G2", date:"2026-06-15", time:"18:00", group:"G", team1:"IRN", team2:"NZL", venue:"Lumen Field", city:"西雅图", round:"小组赛第1轮" },
    { id:"GS-H2", date:"2026-06-15", time:"21:00", group:"H", team1:"KSA", team2:"URU", venue:"Hard Rock Stadium", city:"迈阿密", round:"小组赛第1轮" },
    // June 16
    { id:"GS-I1", date:"2026-06-16", time:"15:00", group:"I", team1:"FRA", team2:"SEN", venue:"MetLife Stadium", city:"纽约", round:"小组赛第1轮" },
    { id:"GS-I2", date:"2026-06-16", time:"18:00", group:"I", team1:"IRQ", team2:"NOR", venue:"Gillette Stadium", city:"波士顿", round:"小组赛第1轮" },
    { id:"GS-J1", date:"2026-06-16", time:"21:00", group:"J", team1:"ARG", team2:"ALG", venue:"Arrowhead Stadium", city:"堪萨斯城", round:"小组赛第1轮" },
    { id:"GS-J2", date:"2026-06-17", time:"00:00", group:"J", team1:"AUT", team2:"JOR", venue:"Levi's Stadium", city:"旧金山", round:"小组赛第1轮" },
    // June 17
    { id:"GS-K1", date:"2026-06-17", time:"13:00", group:"K", team1:"POR", team2:"COD", venue:"NRG Stadium", city:"休斯顿", round:"小组赛第1轮" },
    { id:"GS-L1", date:"2026-06-17", time:"16:00", group:"L", team1:"ENG", team2:"CRO", venue:"AT&T Stadium", city:"达拉斯", round:"小组赛第1轮" },
    { id:"GS-L2", date:"2026-06-17", time:"19:00", group:"L", team1:"GHA", team2:"PAN", venue:"BMO Field", city:"多伦多", round:"小组赛第1轮" },
    { id:"GS-K2", date:"2026-06-17", time:"22:00", group:"K", team1:"UZB", team2:"COL", venue:"Estadio Azteca", city:"墨西哥城", round:"小组赛第1轮" },

    // ===== MATCHDAY 2 =====
    // June 18
    { id:"GS-A3", date:"2026-06-18", time:"12:00", group:"A", team1:"CZE", team2:"RSA", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"小组赛第2轮" },
    { id:"GS-B3", date:"2026-06-18", time:"15:00", group:"B", team1:"BIH", team2:"SUI", venue:"SoFi Stadium", city:"洛杉矶", round:"小组赛第2轮" },
    { id:"GS-B4", date:"2026-06-18", time:"18:00", group:"B", team1:"CAN", team2:"QAT", venue:"BC Place", city:"温哥华", round:"小组赛第2轮" },
    { id:"GS-A4", date:"2026-06-18", time:"21:00", group:"A", team1:"MEX", team2:"KOR", venue:"Estadio Guadalajara", city:"瓜达拉哈拉", round:"小组赛第2轮" },
    // June 19
    { id:"GS-D3", date:"2026-06-19", time:"15:00", group:"D", team1:"USA", team2:"AUS", venue:"Lumen Field", city:"西雅图", round:"小组赛第2轮" },
    { id:"GS-C3", date:"2026-06-19", time:"18:00", group:"C", team1:"SCO", team2:"MAR", venue:"Lincoln Financial Field", city:"费城", round:"小组赛第2轮" },
    { id:"GS-C4", date:"2026-06-19", time:"21:00", group:"C", team1:"BRA", team2:"HAI", venue:"Gillette Stadium", city:"波士顿", round:"小组赛第2轮" },
    { id:"GS-D4", date:"2026-06-20", time:"00:00", group:"D", team1:"TUR", team2:"PAR", venue:"Levi's Stadium", city:"旧金山", round:"小组赛第2轮" },
    // June 20
    { id:"GS-F3", date:"2026-06-20", time:"13:00", group:"F", team1:"TUN", team2:"JPN", venue:"Estadio BBVA", city:"蒙特雷", round:"小组赛第2轮" },
    { id:"GS-E3", date:"2026-06-20", time:"16:00", group:"E", team1:"GER", team2:"CIV", venue:"BMO Field", city:"多伦多", round:"小组赛第2轮" },
    { id:"GS-E4", date:"2026-06-20", time:"20:00", group:"E", team1:"ECU", team2:"CUW", venue:"Arrowhead Stadium", city:"堪萨斯城", round:"小组赛第2轮" },
    { id:"GS-F4", date:"2026-06-21", time:"00:00", group:"F", team1:"NED", team2:"SWE", venue:"NRG Stadium", city:"休斯顿", round:"小组赛第2轮" },
    // June 21
    { id:"GS-H3", date:"2026-06-21", time:"12:00", group:"H", team1:"ESP", team2:"KSA", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"小组赛第2轮" },
    { id:"GS-G3", date:"2026-06-21", time:"15:00", group:"G", team1:"BEL", team2:"IRN", venue:"SoFi Stadium", city:"洛杉矶", round:"小组赛第2轮" },
    { id:"GS-H4", date:"2026-06-21", time:"18:00", group:"H", team1:"URU", team2:"CPV", venue:"Hard Rock Stadium", city:"迈阿密", round:"小组赛第2轮" },
    { id:"GS-G4", date:"2026-06-21", time:"21:00", group:"G", team1:"NZL", team2:"EGY", venue:"BC Place", city:"温哥华", round:"小组赛第2轮" },
    // June 22
    { id:"GS-J3", date:"2026-06-22", time:"13:00", group:"J", team1:"ARG", team2:"AUT", venue:"AT&T Stadium", city:"达拉斯", round:"小组赛第2轮" },
    { id:"GS-I3", date:"2026-06-22", time:"17:00", group:"I", team1:"FRA", team2:"IRQ", venue:"Lincoln Financial Field", city:"费城", round:"小组赛第2轮" },
    { id:"GS-I4", date:"2026-06-22", time:"20:00", group:"I", team1:"NOR", team2:"SEN", venue:"MetLife Stadium", city:"纽约", round:"小组赛第2轮" },
    { id:"GS-J4", date:"2026-06-22", time:"23:00", group:"J", team1:"JOR", team2:"ALG", venue:"Levi's Stadium", city:"旧金山", round:"小组赛第2轮" },
    // June 23
    { id:"GS-K3", date:"2026-06-23", time:"13:00", group:"K", team1:"POR", team2:"UZB", venue:"NRG Stadium", city:"休斯顿", round:"小组赛第2轮" },
    { id:"GS-L3", date:"2026-06-23", time:"16:00", group:"L", team1:"ENG", team2:"GHA", venue:"Gillette Stadium", city:"波士顿", round:"小组赛第2轮" },
    { id:"GS-L4", date:"2026-06-23", time:"19:00", group:"L", team1:"PAN", team2:"CRO", venue:"BMO Field", city:"多伦多", round:"小组赛第2轮" },
    { id:"GS-K4", date:"2026-06-23", time:"22:00", group:"K", team1:"COL", team2:"COD", venue:"Estadio Akron", city:"瓜达拉哈拉", round:"小组赛第2轮" },

    // ===== MATCHDAY 3 =====
    // June 24
    { id:"GS-B5", date:"2026-06-24", time:"15:00", group:"B", team1:"SUI", team2:"CAN", venue:"BC Place", city:"温哥华", round:"小组赛第3轮" },
    { id:"GS-B6", date:"2026-06-24", time:"15:00", group:"B", team1:"BIH", team2:"QAT", venue:"Lumen Field", city:"西雅图", round:"小组赛第3轮" },
    { id:"GS-C5", date:"2026-06-24", time:"18:00", group:"C", team1:"SCO", team2:"BRA", venue:"Hard Rock Stadium", city:"迈阿密", round:"小组赛第3轮" },
    { id:"GS-C6", date:"2026-06-24", time:"18:00", group:"C", team1:"MAR", team2:"HAI", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"小组赛第3轮" },
    { id:"GS-A5", date:"2026-06-24", time:"21:00", group:"A", team1:"CZE", team2:"MEX", venue:"Mexico City Stadium", city:"墨西哥城", round:"小组赛第3轮" },
    { id:"GS-A6", date:"2026-06-24", time:"21:00", group:"A", team1:"RSA", team2:"KOR", venue:"Estadio Monterrey", city:"蒙特雷", round:"小组赛第3轮" },
    // June 25
    { id:"GS-E5", date:"2026-06-25", time:"16:00", group:"E", team1:"ECU", team2:"GER", venue:"MetLife Stadium", city:"纽约", round:"小组赛第3轮" },
    { id:"GS-E6", date:"2026-06-25", time:"16:00", group:"E", team1:"CUW", team2:"CIV", venue:"Lincoln Financial Field", city:"费城", round:"小组赛第3轮" },
    { id:"GS-F5", date:"2026-06-25", time:"19:00", group:"F", team1:"TUN", team2:"NED", venue:"AT&T Stadium", city:"达拉斯", round:"小组赛第3轮" },
    { id:"GS-F6", date:"2026-06-25", time:"19:00", group:"F", team1:"JPN", team2:"SWE", venue:"Arrowhead Stadium", city:"堪萨斯城", round:"小组赛第3轮" },
    { id:"GS-D5", date:"2026-06-25", time:"22:00", group:"D", team1:"TUR", team2:"USA", venue:"SoFi Stadium", city:"洛杉矶", round:"小组赛第3轮" },
    { id:"GS-D6", date:"2026-06-25", time:"22:00", group:"D", team1:"PAR", team2:"AUS", venue:"Levi's Stadium", city:"旧金山", round:"小组赛第3轮" },
    // June 26
    { id:"GS-I5", date:"2026-06-26", time:"15:00", group:"I", team1:"NOR", team2:"FRA", venue:"Gillette Stadium", city:"波士顿", round:"小组赛第3轮" },
    { id:"GS-I6", date:"2026-06-26", time:"15:00", group:"I", team1:"SEN", team2:"IRQ", venue:"BMO Field", city:"多伦多", round:"小组赛第3轮" },
    { id:"GS-G5", date:"2026-06-26", time:"20:00", group:"G", team1:"NZL", team2:"BEL", venue:"Lumen Field", city:"西雅图", round:"小组赛第3轮" },
    { id:"GS-G6", date:"2026-06-26", time:"20:00", group:"G", team1:"EGY", team2:"IRN", venue:"BC Place", city:"温哥华", round:"小组赛第3轮" },
    { id:"GS-H5", date:"2026-06-26", time:"20:00", group:"H", team1:"URU", team2:"ESP", venue:"NRG Stadium", city:"休斯顿", round:"小组赛第3轮" },
    { id:"GS-H6", date:"2026-06-26", time:"20:00", group:"H", team1:"CPV", team2:"KSA", venue:"Estadio Akron", city:"瓜达拉哈拉", round:"小组赛第3轮" },
    // June 27
    { id:"GS-L5", date:"2026-06-27", time:"17:00", group:"L", team1:"PAN", team2:"ENG", venue:"MetLife Stadium", city:"纽约", round:"小组赛第3轮" },
    { id:"GS-L6", date:"2026-06-27", time:"17:00", group:"L", team1:"CRO", team2:"GHA", venue:"Lincoln Financial Field", city:"费城", round:"小组赛第3轮" },
    { id:"GS-K5", date:"2026-06-27", time:"19:30", group:"K", team1:"COL", team2:"POR", venue:"Hard Rock Stadium", city:"迈阿密", round:"小组赛第3轮" },
    { id:"GS-K6", date:"2026-06-27", time:"19:30", group:"K", team1:"COD", team2:"UZB", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"小组赛第3轮" },
    { id:"GS-J5", date:"2026-06-27", time:"22:00", group:"J", team1:"JOR", team2:"ARG", venue:"Arrowhead Stadium", city:"堪萨斯城", round:"小组赛第3轮" },
    { id:"GS-J6", date:"2026-06-27", time:"22:00", group:"J", team1:"ALG", team2:"AUT", venue:"AT&T Stadium", city:"达拉斯", round:"小组赛第3轮" }
  ],

  knockout: {
    round32: [
      { id:"R32-1", date:"2026-06-28", time:"15:00", match:"M1", team1:"A2", team2:"B2", venue:"SoFi Stadium", city:"洛杉矶", round:"32强" },
      { id:"R32-2", date:"2026-06-29", time:"13:00", match:"M4", team1:"C1", team2:"F2", venue:"NRG Stadium", city:"休斯顿", round:"32强" },
      { id:"R32-3", date:"2026-06-29", time:"16:30", match:"M2", team1:"E1", team2:"3rd", venue:"Gillette Stadium", city:"波士顿", round:"32强" },
      { id:"R32-4", date:"2026-06-29", time:"21:00", match:"M3", team1:"F1", team2:"C2", venue:"Estadio BBVA", city:"蒙特雷", round:"32强" },
      { id:"R32-5", date:"2026-06-30", time:"13:00", match:"M6", team1:"E2", team2:"I2", venue:"AT&T Stadium", city:"达拉斯", round:"32强" },
      { id:"R32-6", date:"2026-06-30", time:"17:00", match:"M5", team1:"I1", team2:"3rd", venue:"MetLife Stadium", city:"纽约", round:"32强" },
      { id:"R32-7", date:"2026-06-30", time:"21:00", match:"M7", team1:"A1", team2:"3rd", venue:"Estadio Azteca", city:"墨西哥城", round:"32强" },
      { id:"R32-8", date:"2026-07-01", time:"12:00", match:"M8", team1:"L1", team2:"3rd", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"32强" },
      { id:"R32-9", date:"2026-07-01", time:"16:00", match:"M10", team1:"G1", team2:"3rd", venue:"Lumen Field", city:"西雅图", round:"32强" },
      { id:"R32-10", date:"2026-07-01", time:"20:00", match:"M9", team1:"D1", team2:"3rd", venue:"Levi's Stadium", city:"旧金山", round:"32强" },
      { id:"R32-11", date:"2026-07-02", time:"15:00", match:"M12", team1:"H1", team2:"J2", venue:"SoFi Stadium", city:"洛杉矶", round:"32强" },
      { id:"R32-12", date:"2026-07-02", time:"19:00", match:"M11", team1:"K2", team2:"L2", venue:"BMO Field", city:"多伦多", round:"32强" },
      { id:"R32-13", date:"2026-07-02", time:"23:00", match:"M13", team1:"B1", team2:"3rd", venue:"BC Place", city:"温哥华", round:"32强" },
      { id:"R32-14", date:"2026-07-03", time:"14:00", match:"M16", team1:"D2", team2:"G2", venue:"AT&T Stadium", city:"达拉斯", round:"32强" },
      { id:"R32-15", date:"2026-07-03", time:"18:00", match:"M14", team1:"J1", team2:"H2", venue:"Hard Rock Stadium", city:"迈阿密", round:"32强" },
      { id:"R32-16", date:"2026-07-03", time:"21:30", match:"M15", team1:"K1", team2:"3rd", venue:"Arrowhead Stadium", city:"堪萨斯城", round:"32强" }
    ],
    round16: [
      { id:"R16-1", date:"2026-07-04", time:"13:00", match:"R16-1", team1:"W-M1", team2:"W-M3", venue:"NRG Stadium", city:"休斯顿", round:"16强" },
      { id:"R16-2", date:"2026-07-04", time:"17:00", match:"R16-2", team1:"W-M2", team2:"W-M5", venue:"Lincoln Financial Field", city:"费城", round:"16强" },
      { id:"R16-3", date:"2026-07-05", time:"16:00", match:"R16-3", team1:"W-M4", team2:"W-M6", venue:"MetLife Stadium", city:"纽约", round:"16强" },
      { id:"R16-4", date:"2026-07-05", time:"20:00", match:"R16-4", team1:"W-M7", team2:"W-M8", venue:"Estadio Azteca", city:"墨西哥城", round:"16强" },
      { id:"R16-5", date:"2026-07-06", time:"15:00", match:"R16-5", team1:"W-M11", team2:"W-M12", venue:"AT&T Stadium", city:"达拉斯", round:"16强" },
      { id:"R16-6", date:"2026-07-06", time:"20:00", match:"R16-6", team1:"W-M9", team2:"W-M10", venue:"Lumen Field", city:"西雅图", round:"16强" },
      { id:"R16-7", date:"2026-07-07", time:"12:00", match:"R16-7", team1:"W-M14", team2:"W-M16", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"16强" },
      { id:"R16-8", date:"2026-07-07", time:"16:00", match:"R16-8", team1:"W-M13", team2:"W-M15", venue:"BC Place", city:"温哥华", round:"16强" }
    ],
    quarterfinals: [
      { id:"QF-1", date:"2026-07-09", time:"16:00", match:"QF1", team1:"W-R16-1", team2:"W-R16-2", venue:"Gillette Stadium", city:"波士顿", round:"1/4决赛" },
      { id:"QF-2", date:"2026-07-10", time:"15:00", match:"QF2", team1:"W-R16-5", team2:"W-R16-6", venue:"SoFi Stadium", city:"洛杉矶", round:"1/4决赛" },
      { id:"QF-3", date:"2026-07-11", time:"17:00", match:"QF3", team1:"W-R16-3", team2:"W-R16-4", venue:"Hard Rock Stadium", city:"迈阿密", round:"1/4决赛" },
      { id:"QF-4", date:"2026-07-11", time:"21:00", match:"QF4", team1:"W-R16-7", team2:"W-R16-8", venue:"Arrowhead Stadium", city:"堪萨斯城", round:"1/4决赛" }
    ],
    semifinals: [
      { id:"SF-1", date:"2026-07-14", time:"15:00", match:"SF1", team1:"W-QF1", team2:"W-QF2", venue:"AT&T Stadium", city:"达拉斯", round:"半决赛" },
      { id:"SF-2", date:"2026-07-15", time:"15:00", match:"SF2", team1:"W-QF3", team2:"W-QF4", venue:"Mercedes-Benz Stadium", city:"亚特兰大", round:"半决赛" }
    ],
    thirdPlace: { id:"3P", date:"2026-07-18", time:"17:00", match:"3P", team1:"L-SF1", team2:"L-SF2", venue:"Hard Rock Stadium", city:"迈阿密", round:"三四名决赛" },
    final: { id:"FINAL", date:"2026-07-19", time:"15:00", match:"FINAL", team1:"W-SF1", team2:"W-SF2", venue:"MetLife Stadium", city:"纽约", round:"决赛" }
  }
};

// Get all matches for a group
function getGroupMatches(group) {
  return WORLD_CUP_SCHEDULE.groupStage.filter(m => m.group === group);
}

// Get matches by date
function getMatchesByDate(date) {
  const all = [...WORLD_CUP_SCHEDULE.groupStage];
  for (const stage of Object.values(WORLD_CUP_SCHEDULE.knockout)) {
    if (Array.isArray(stage)) all.push(...stage);
    else all.push(stage);
  }
  return all.filter(m => m.date === date);
}

// Get all knockout matches as flat array
function getKnockoutMatches() {
  const matches = [];
  ['round32','round16','quarterfinals','semifinals'].forEach(stage => {
    matches.push(...WORLD_CUP_SCHEDULE.knockout[stage]);
  });
  matches.push(WORLD_CUP_SCHEDULE.knockout.thirdPlace);
  matches.push(WORLD_CUP_SCHEDULE.knockout.final);
  return matches;
}

// Tournament dates range
const TOURNAMENT_START = "2026-06-11";
const TOURNAMENT_END = "2026-07-19";

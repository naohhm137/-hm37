/**
 * 2026 FIFA World Cup - Group Stage Data
 * 12 groups x 4 teams = 48 teams
 * Based on official FIFA Final Draw (Dec 5, 2025)
 */

const WORLD_CUP_GROUPS = {
  A: {
    name: "A组",
    teams: [
      { code: "MEX", nameCN: "墨西哥", nameEN: "Mexico", flag: "mx", rank: 17, pot: 1 },
      { code: "KOR", nameCN: "韩国", nameEN: "Korea Republic", flag: "kr", rank: 23, pot: 2 },
      { code: "RSA", nameCN: "南非", nameEN: "South Africa", flag: "za", rank: 62, pot: 3 },
      { code: "CZE", nameCN: "捷克", nameEN: "Czech Republic", flag: "cz", rank: 35, pot: 4 }
    ]
  },
  B: {
    name: "B组",
    teams: [
      { code: "CAN", nameCN: "加拿大", nameEN: "Canada", flag: "ca", rank: 33, pot: 1 },
      { code: "SUI", nameCN: "瑞士", nameEN: "Switzerland", flag: "ch", rank: 15, pot: 2 },
      { code: "QAT", nameCN: "卡塔尔", nameEN: "Qatar", flag: "qa", rank: 43, pot: 3 },
      { code: "BIH", nameCN: "波黑", nameEN: "Bosnia and Herzegovina", flag: "ba", rank: 44, pot: 4 }
    ]
  },
  C: {
    name: "C组",
    teams: [
      { code: "BRA", nameCN: "巴西", nameEN: "Brazil", flag: "br", rank: 3, pot: 1 },
      { code: "MAR", nameCN: "摩洛哥", nameEN: "Morocco", flag: "ma", rank: 12, pot: 2 },
      { code: "SCO", nameCN: "苏格兰", nameEN: "Scotland", flag: "gb-sct", rank: 37, pot: 3 },
      { code: "HAI", nameCN: "海地", nameEN: "Haiti", flag: "ht", rank: 78, pot: 4 }
    ]
  },
  D: {
    name: "D组",
    teams: [
      { code: "USA", nameCN: "美国", nameEN: "United States", flag: "us", rank: 13, pot: 1 },
      { code: "AUS", nameCN: "澳大利亚", nameEN: "Australia", flag: "au", rank: 27, pot: 2 },
      { code: "PAR", nameCN: "巴拉圭", nameEN: "Paraguay", flag: "py", rank: 52, pot: 3 },
      { code: "TUR", nameCN: "土耳其", nameEN: "Turkey", flag: "tr", rank: 30, pot: 4 }
    ]
  },
  E: {
    name: "E组",
    teams: [
      { code: "GER", nameCN: "德国", nameEN: "Germany", flag: "de", rank: 10, pot: 1 },
      { code: "ECU", nameCN: "厄瓜多尔", nameEN: "Ecuador", flag: "ec", rank: 25, pot: 2 },
      { code: "CIV", nameCN: "科特迪瓦", nameEN: "Côte d'Ivoire", flag: "ci", rank: 36, pot: 3 },
      { code: "CUW", nameCN: "库拉索", nameEN: "Curaçao", flag: "cw", rank: 110, pot: 4 }
    ]
  },
  F: {
    name: "F组",
    teams: [
      { code: "NED", nameCN: "荷兰", nameEN: "Netherlands", flag: "nl", rank: 7, pot: 1 },
      { code: "JPN", nameCN: "日本", nameEN: "Japan", flag: "jp", rank: 16, pot: 2 },
      { code: "TUN", nameCN: "突尼斯", nameEN: "Tunisia", flag: "tn", rank: 29, pot: 3 },
      { code: "SWE", nameCN: "瑞典", nameEN: "Sweden", flag: "se", rank: 32, pot: 4 }
    ]
  },
  G: {
    name: "G组",
    teams: [
      { code: "BEL", nameCN: "比利时", nameEN: "Belgium", flag: "be", rank: 6, pot: 1 },
      { code: "IRN", nameCN: "伊朗", nameEN: "Iran", flag: "ir", rank: 20, pot: 2 },
      { code: "EGY", nameCN: "埃及", nameEN: "Egypt", flag: "eg", rank: 22, pot: 3 },
      { code: "NZL", nameCN: "新西兰", nameEN: "New Zealand", flag: "nz", rank: 99, pot: 4 }
    ]
  },
  H: {
    name: "H组",
    teams: [
      { code: "ESP", nameCN: "西班牙", nameEN: "Spain", flag: "es", rank: 2, pot: 1 },
      { code: "URU", nameCN: "乌拉圭", nameEN: "Uruguay", flag: "uy", rank: 11, pot: 2 },
      { code: "KSA", nameCN: "沙特阿拉伯", nameEN: "Saudi Arabia", flag: "sa", rank: 51, pot: 3 },
      { code: "CPV", nameCN: "佛得角", nameEN: "Cape Verde", flag: "cv", rank: 75, pot: 4 }
    ]
  },
  I: {
    name: "I组",
    teams: [
      { code: "FRA", nameCN: "法国", nameEN: "France", flag: "fr", rank: 1, pot: 1 },
      { code: "SEN", nameCN: "塞内加尔", nameEN: "Senegal", flag: "sn", rank: 18, pot: 2 },
      { code: "NOR", nameCN: "挪威", nameEN: "Norway", flag: "no", rank: 21, pot: 3 },
      { code: "IRQ", nameCN: "伊拉克", nameEN: "Iraq", flag: "iq", rank: 64, pot: 4 }
    ]
  },
  J: {
    name: "J组",
    teams: [
      { code: "ARG", nameCN: "阿根廷", nameEN: "Argentina", flag: "ar", rank: 4, pot: 1 },
      { code: "AUT", nameCN: "奥地利", nameEN: "Austria", flag: "at", rank: 24, pot: 2 },
      { code: "ALG", nameCN: "阿尔及利亚", nameEN: "Algeria", flag: "dz", rank: 31, pot: 3 },
      { code: "JOR", nameCN: "约旦", nameEN: "Jordan", flag: "jo", rank: 53, pot: 4 }
    ]
  },
  K: {
    name: "K组",
    teams: [
      { code: "POR", nameCN: "葡萄牙", nameEN: "Portugal", flag: "pt", rank: 5, pot: 1 },
      { code: "COL", nameCN: "哥伦比亚", nameEN: "Colombia", flag: "co", rank: 14, pot: 2 },
      { code: "UZB", nameCN: "乌兹别克斯坦", nameEN: "Uzbekistan", flag: "uz", rank: 54, pot: 3 },
      { code: "COD", nameCN: "刚果(金)", nameEN: "DR Congo", flag: "cd", rank: 66, pot: 4 }
    ]
  },
  L: {
    name: "L组",
    teams: [
      { code: "ENG", nameCN: "英格兰", nameEN: "England", flag: "gb-eng", rank: 8, pot: 1 },
      { code: "CRO", nameCN: "克罗地亚", nameEN: "Croatia", flag: "hr", rank: 9, pot: 2 },
      { code: "PAN", nameCN: "巴拿马", nameEN: "Panama", flag: "pa", rank: 55, pot: 3 },
      { code: "GHA", nameCN: "加纳", nameEN: "Ghana", flag: "gh", rank: 48, pot: 4 }
    ]
  }
};

// Helper: get group info for a team
function getTeamGroup(code) {
  for (const [groupKey, group] of Object.entries(WORLD_CUP_GROUPS)) {
    if (group.teams.some(t => t.code === code)) return { group: groupKey, groupName: group.name };
  }
  return null;
}

// All 48 teams flat array
function getAllTeams() {
  const all = [];
  for (const [groupKey, group] of Object.entries(WORLD_CUP_GROUPS)) {
    for (const team of group.teams) {
      all.push({ ...team, group: groupKey, groupName: group.name });
    }
  }
  return all;
}

// ─── 俱乐部中文名映射 ───
const CLUB_CN={
  // 英超
  'Arsenal':'阿森纳','Aston Villa':'阿斯顿维拉','Chelsea':'切尔西','Crystal Palace':'水晶宫',
  'Everton':'埃弗顿','Fulham':'富勒姆','Hull City':'赫尔城','Leeds':'利兹联',
  'Liverpool':'利物浦','Manchester City':'曼城','Manchester United':'曼联',
  'Newcastle':'纽卡斯尔联','Nottingham Forest':'诺丁汉森林','Sunderland':'桑德兰',
  'Tottenham':'托特纳姆热刺','West Ham':'西汉姆联','Wolverhampton':'狼队','Burnley':'伯恩利',
  // 西甲
  'Athletic Club':'毕尔巴鄂竞技','Atletico Madrid':'马德里竞技','Atlético Madrid':'马德里竞技',
  'Barcelona':'巴塞罗那','Real Betis':'皇家贝蒂斯','Real Madrid':'皇家马德里',
  'Real Sociedad':'皇家社会','Sevilla':'塞维利亚','Villarreal':'比利亚雷亚尔',
  'Mallorca':'马略卡','Girona':'赫罗纳',
  // 意甲
  'AC Milan':'AC米兰','Inter Milan':'国际米兰','Juventus':'尤文图斯',
  'Atalanta':'亚特兰大','Bologna':'博洛尼亚','Genoa':'热那亚',
  'Sampdoria':'桑普多利亚','Sassuolo':'萨索洛','Lazio':'拉齐奥',
  // 德甲
  'Bayern Munich':'拜仁慕尼黑','Bayer Leverkusen':'勒沃库森','Borussia Dortmund':'多特蒙德',
  'Augsburg':'奥格斯堡','Hoffenheim':'霍芬海姆','Mainz':'美因茨',
  'Mönchengladbach':'门兴格拉德巴赫','Schalke 04':'沙尔克04',
  'Stuttgart':'斯图加特','FC St. Pauli':'圣保利',
  // 法甲
  'Lens':'朗斯','Lorient':'洛里昂','Lyon':'里昂','Marseille':'马赛',
  'Monaco':'摩纳哥','OGC Nice':'尼斯','PSG':'巴黎圣日耳曼','Rennes':'雷恩',
  // 荷甲/葡超/其他欧洲
  'Anderlecht':'安德莱赫特','Celtic':'凯尔特人','PSV':'埃因霍温','PSV Eindhoven':'埃因霍温',
  'Benfica':'本菲卡','FC Porto':'波尔图','PAOK':'塞萨洛尼基PAOK',
  'Slavia Prague':'布拉格斯拉维亚','Sparta Prague':'布拉格斯巴达',
  'AEK Athens':'雅典AEK','Union Saint-Gilloise':'圣吉罗斯联合',
  'Fenerbahce':'费内巴切','Fenerbahçe':'费内巴切',
  // MLS / 南美
  'Inter Miami':'迈阿密国际','LAFC':'洛杉矶FC','Orlando City':'奥兰多城',
  'Toronto FC':'多伦多FC','Flamengo':'弗拉门戈','Santos':'桑托斯',
  // 墨西哥
  'Chivas':'瓜达拉哈拉','Club América':'美洲俱乐部','Toluca':'托卢卡',
  // 亚洲/非洲
  'Al Hilal':'利雅得新月','Al Nassr':'利雅得胜利','Al Ittihad':'吉达联合',
  'Al-Ahli':'吉达国民','Al-Sadd':'萨德','Al Duhail':'杜海勒',
  'Al Rayyan':'赖扬','Al Gharafa':'加拉法',
  'Mamelodi Sundowns':'马梅洛迪日落','Orlando Pirates':'奥兰多海盗','Kaizer Chiefs':'凯泽酋长',
  // 其他
  'AEK Athens':'雅典AEK','AEL Limassol':'利马索尔AEL',
  'Lokomotiv Moscow':'莫斯科火车头','Dynamo Moscow':'莫斯科迪纳摩',
  'Tondela':'通德拉','Bröndby':'布隆德比',
};
function getClubCN(name){
  if(!name||name==='—')return '';
  return CLUB_CN[name]||name;
}

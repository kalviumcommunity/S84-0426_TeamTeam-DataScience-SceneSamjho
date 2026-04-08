export interface AccidentRecord {
  id: string;
  date: string;
  time: string;
  hour: number;
  latitude: number;
  longitude: number;
  weather: string;
  roadType: string;
  severity: 'Minor' | 'Moderate' | 'Severe' | 'Fatal';
  casualties: number;
  vehicles: number;
  zone: string;
  lightCondition: string;
}

export const sampleAccidents: AccidentRecord[] = [
  { id: "A001", date: "2025-01-15", time: "08:30", hour: 8, latitude: 28.6139, longitude: 77.2090, weather: "Clear", roadType: "Highway", severity: "Moderate", casualties: 2, vehicles: 3, zone: "Zone A", lightCondition: "Daylight" },
  { id: "A002", date: "2025-01-15", time: "22:15", hour: 22, latitude: 28.6280, longitude: 77.2190, weather: "Rain", roadType: "Highway", severity: "Severe", casualties: 4, vehicles: 2, zone: "Zone A", lightCondition: "Dark" },
  { id: "A003", date: "2025-01-16", time: "14:45", hour: 14, latitude: 28.5355, longitude: 77.3910, weather: "Clear", roadType: "Urban", severity: "Minor", casualties: 1, vehicles: 2, zone: "Zone B", lightCondition: "Daylight" },
  { id: "A004", date: "2025-01-17", time: "19:00", hour: 19, latitude: 28.4595, longitude: 77.0266, weather: "Fog", roadType: "Highway", severity: "Fatal", casualties: 3, vehicles: 4, zone: "Zone C", lightCondition: "Dusk" },
  { id: "A005", date: "2025-01-18", time: "06:30", hour: 6, latitude: 28.7041, longitude: 77.1025, weather: "Fog", roadType: "Rural", severity: "Severe", casualties: 2, vehicles: 2, zone: "Zone D", lightCondition: "Dawn" },
  { id: "A006", date: "2025-01-19", time: "11:00", hour: 11, latitude: 28.6353, longitude: 77.2250, weather: "Clear", roadType: "Urban", severity: "Minor", casualties: 0, vehicles: 2, zone: "Zone A", lightCondition: "Daylight" },
  { id: "A007", date: "2025-01-20", time: "23:30", hour: 23, latitude: 28.5672, longitude: 77.3211, weather: "Rain", roadType: "Highway", severity: "Fatal", casualties: 5, vehicles: 3, zone: "Zone B", lightCondition: "Dark" },
  { id: "A008", date: "2025-01-21", time: "09:15", hour: 9, latitude: 28.6508, longitude: 77.1853, weather: "Clear", roadType: "Urban", severity: "Moderate", casualties: 1, vehicles: 2, zone: "Zone A", lightCondition: "Daylight" },
  { id: "A009", date: "2025-01-22", time: "17:45", hour: 17, latitude: 28.4089, longitude: 77.3178, weather: "Rain", roadType: "Rural", severity: "Severe", casualties: 3, vehicles: 2, zone: "Zone E", lightCondition: "Dusk" },
  { id: "A010", date: "2025-01-23", time: "02:00", hour: 2, latitude: 28.6129, longitude: 77.2295, weather: "Clear", roadType: "Highway", severity: "Moderate", casualties: 2, vehicles: 2, zone: "Zone A", lightCondition: "Dark" },
  { id: "A011", date: "2025-01-24", time: "07:30", hour: 7, latitude: 28.5244, longitude: 77.1855, weather: "Fog", roadType: "Highway", severity: "Severe", casualties: 6, vehicles: 5, zone: "Zone C", lightCondition: "Dawn" },
  { id: "A012", date: "2025-01-25", time: "13:00", hour: 13, latitude: 28.6692, longitude: 77.4538, weather: "Clear", roadType: "Urban", severity: "Minor", casualties: 0, vehicles: 2, zone: "Zone B", lightCondition: "Daylight" },
  { id: "A013", date: "2025-01-26", time: "20:30", hour: 20, latitude: 28.4817, longitude: 77.0608, weather: "Rain", roadType: "Highway", severity: "Fatal", casualties: 4, vehicles: 3, zone: "Zone C", lightCondition: "Dark" },
  { id: "A014", date: "2025-01-27", time: "10:00", hour: 10, latitude: 28.7500, longitude: 77.1171, weather: "Clear", roadType: "Rural", severity: "Minor", casualties: 1, vehicles: 2, zone: "Zone D", lightCondition: "Daylight" },
  { id: "A015", date: "2025-01-28", time: "21:45", hour: 21, latitude: 28.5562, longitude: 77.3517, weather: "Rain", roadType: "Urban", severity: "Moderate", casualties: 2, vehicles: 3, zone: "Zone B", lightCondition: "Dark" },
  { id: "A016", date: "2025-02-01", time: "16:15", hour: 16, latitude: 28.6304, longitude: 77.2177, weather: "Clear", roadType: "Urban", severity: "Minor", casualties: 0, vehicles: 2, zone: "Zone A", lightCondition: "Daylight" },
  { id: "A017", date: "2025-02-03", time: "05:00", hour: 5, latitude: 28.4231, longitude: 77.0402, weather: "Fog", roadType: "Highway", severity: "Fatal", casualties: 7, vehicles: 4, zone: "Zone C", lightCondition: "Dark" },
  { id: "A018", date: "2025-02-05", time: "12:30", hour: 12, latitude: 28.6862, longitude: 77.2217, weather: "Clear", roadType: "Urban", severity: "Minor", casualties: 1, vehicles: 2, zone: "Zone A", lightCondition: "Daylight" },
  { id: "A019", date: "2025-02-07", time: "18:00", hour: 18, latitude: 28.5100, longitude: 77.2300, weather: "Rain", roadType: "Rural", severity: "Severe", casualties: 3, vehicles: 2, zone: "Zone E", lightCondition: "Dusk" },
  { id: "A020", date: "2025-02-09", time: "01:30", hour: 1, latitude: 28.6000, longitude: 77.2000, weather: "Clear", roadType: "Highway", severity: "Moderate", casualties: 2, vehicles: 2, zone: "Zone A", lightCondition: "Dark" },
];

export function getTimeDistribution(data: AccidentRecord[]) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    accidents: data.filter(d => d.hour === i).length,
  }));
  return hours;
}

export function getWeatherDistribution(data: AccidentRecord[]) {
  const weatherMap: Record<string, number> = {};
  data.forEach(d => { weatherMap[d.weather] = (weatherMap[d.weather] || 0) + 1; });
  return Object.entries(weatherMap).map(([weather, count]) => ({ weather, count }));
}

export function getRoadTypeDistribution(data: AccidentRecord[]) {
  const roadMap: Record<string, number> = {};
  data.forEach(d => { roadMap[d.roadType] = (roadMap[d.roadType] || 0) + 1; });
  return Object.entries(roadMap).map(([roadType, count]) => ({ roadType, count }));
}

export function getSeverityDistribution(data: AccidentRecord[]) {
  const sevMap: Record<string, number> = {};
  data.forEach(d => { sevMap[d.severity] = (sevMap[d.severity] || 0) + 1; });
  return Object.entries(sevMap).map(([severity, count]) => ({ severity, count }));
}

export function getZoneDistribution(data: AccidentRecord[]) {
  const zoneMap: Record<string, { total: number; severe: number; casualties: number }> = {};
  data.forEach(d => {
    if (!zoneMap[d.zone]) zoneMap[d.zone] = { total: 0, severe: 0, casualties: 0 };
    zoneMap[d.zone].total++;
    if (d.severity === 'Severe' || d.severity === 'Fatal') zoneMap[d.zone].severe++;
    zoneMap[d.zone].casualties += d.casualties;
  });
  return Object.entries(zoneMap).map(([zone, stats]) => ({ zone, ...stats }));
}

export function generateInsights(data: AccidentRecord[]) {
  const insights: { text: string; type: 'danger' | 'warning' | 'info' }[] = [];
  
  // Weather analysis
  const rainAccidents = data.filter(d => d.weather === 'Rain');
  const clearAccidents = data.filter(d => d.weather === 'Clear');
  if (rainAccidents.length > 0 && clearAccidents.length > 0) {
    const rainSeverity = rainAccidents.filter(d => d.severity === 'Severe' || d.severity === 'Fatal').length / rainAccidents.length;
    const clearSeverity = clearAccidents.filter(d => d.severity === 'Severe' || d.severity === 'Fatal').length / clearAccidents.length;
    if (rainSeverity > clearSeverity) {
      const pct = Math.round((rainSeverity / clearSeverity - 1) * 100);
      insights.push({ text: `Rain increases severe accident probability by ${pct}%`, type: 'danger' });
    }
  }

  // Night analysis
  const nightAccidents = data.filter(d => d.hour >= 20 || d.hour <= 5);
  const dayAccidents = data.filter(d => d.hour > 5 && d.hour < 20);
  if (nightAccidents.length > 0 && dayAccidents.length > 0) {
    const nightFatal = nightAccidents.filter(d => d.severity === 'Fatal').length / nightAccidents.length;
    const dayFatal = dayAccidents.filter(d => d.severity === 'Fatal').length / dayAccidents.length;
    if (nightFatal > dayFatal) {
      const ratio = (nightFatal / (dayFatal || 0.01)).toFixed(1);
      insights.push({ text: `Nighttime accidents are ${ratio}x more likely to be fatal`, type: 'danger' });
    }
  }

  // Highway analysis
  const hwAccidents = data.filter(d => d.roadType === 'Highway');
  if (hwAccidents.length > 0) {
    const hwCasualties = hwAccidents.reduce((s, d) => s + d.casualties, 0) / hwAccidents.length;
    const totalCasualties = data.reduce((s, d) => s + d.casualties, 0) / data.length;
    if (hwCasualties > totalCasualties) {
      insights.push({ text: `Highway accidents have ${Math.round((hwCasualties / totalCasualties) * 100 - 100)}% more casualties on average`, type: 'warning' });
    }
  }

  // Peak hours
  const hourCounts: Record<number, number> = {};
  data.forEach(d => { hourCounts[d.hour] = (hourCounts[d.hour] || 0) + 1; });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  if (peakHour) {
    insights.push({ text: `Peak accident hour: ${peakHour[0].padStart(2, '0')}:00 with ${peakHour[1]} incidents`, type: 'info' });
  }

  // Fog analysis
  const fogAccidents = data.filter(d => d.weather === 'Fog');
  if (fogAccidents.length > 0) {
    const fogFatal = fogAccidents.filter(d => d.severity === 'Fatal' || d.severity === 'Severe').length;
    insights.push({ text: `${Math.round(fogFatal / fogAccidents.length * 100)}% of fog accidents result in severe/fatal outcomes`, type: 'danger' });
  }

  // Zone analysis
  const zones = getZoneDistribution(data);
  const riskZone = zones.sort((a, b) => b.casualties - a.casualties)[0];
  if (riskZone) {
    insights.push({ text: `${riskZone.zone} is the highest-risk zone with ${riskZone.casualties} total casualties`, type: 'warning' });
  }

  return insights;
}

export function generateRecommendations(data: AccidentRecord[]) {
  const recs: { title: string; description: string; priority: 'high' | 'medium' | 'low' }[] = [];

  const nightHwAccidents = data.filter(d => (d.hour >= 20 || d.hour <= 5) && d.roadType === 'Highway');
  if (nightHwAccidents.length > 2) {
    recs.push({ title: "Increase street lighting on highways", description: "Install high-intensity LED lighting on highway stretches in Zone A and Zone C to reduce nighttime fatal accidents.", priority: 'high' });
  }

  const fogAccidents = data.filter(d => d.weather === 'Fog');
  if (fogAccidents.length > 2) {
    recs.push({ title: "Deploy fog warning systems", description: "Install automated fog detection and variable message signs on highways prone to fog-related incidents.", priority: 'high' });
  }

  recs.push({ title: "Deploy traffic police 8PM–11PM", description: "Increase patrol presence during peak nighttime accident hours across high-risk zones.", priority: 'high' });
  recs.push({ title: "Install speed breakers on rural roads", description: "Add speed reduction infrastructure near accident-prone intersections on rural roads.", priority: 'medium' });
  recs.push({ title: "Improve drainage on rain-prone routes", description: "Upgrade road drainage systems to reduce hydroplaning risks during monsoon season.", priority: 'medium' });
  recs.push({ title: "Add reflective road markings", description: "Enhance road visibility with retro-reflective lane markings on dark stretches.", priority: 'low' });

  return recs;
}

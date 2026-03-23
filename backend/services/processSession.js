const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

export const extractFeatures = (keystrokes) => {
  // Filter out any keystrokes where dwellTime or keyUpTime wasn't recorded
  // (last keystroke edge case, or modifier keys that slipped through)
  const completeKeystrokes = keystrokes.filter(
    k => k.dwellTime !== null && k.keyUpTime !== null
  );

  if (completeKeystrokes.length === 0) {
    return {
      avgDwellTime: 0,
      avgFlightTime: 0,
      typingSpeed: 0,
      errorRate: 0,
      backspaceCount: 0,
      sessionDuration: 0,
    };
  }

  // Dwell times — only complete keystrokes
  const dwellTimes = completeKeystrokes.map(k => k.dwellTime);
  const avgDwellTime = avg(dwellTimes);

  // Flight times — null on first and last keystroke, filter both out
  const flightTimes = completeKeystrokes
    .map(k => k.flightTime)
    .filter(f => f !== null && f > 0);
  const avgFlightTime = flightTimes.length ? avg(flightTimes) : 0;

  // Session duration in seconds
  const sessionDuration =
    (new Date(completeKeystrokes[completeKeystrokes.length - 1].keyUpTime) -
      new Date(completeKeystrokes[0].keyDownTime)) / 1000;

  // Typing speed in WPM — only printable single characters
  const validKeys = completeKeystrokes.filter(k => k.key.length === 1);
  const words = validKeys.length / 5;
  const typingSpeed = sessionDuration > 0 ? words / (sessionDuration / 60) : 0;

  // Error rate — backspaces over printable keys only
  const backspaceCount = keystrokes.filter(k => k.key === "Backspace").length;
  const errorRate = validKeys.length > 0 ? backspaceCount / validKeys.length : 0;

  return {
    avgDwellTime,
    avgFlightTime,
    typingSpeed,
    errorRate,
    backspaceCount,
    sessionDuration,
  };
};

// Average each feature across all subsessions
export const aggregateFeatures = (featuresArray) => {
  if (featuresArray.length === 0) return {};

  const keys = Object.keys(featuresArray[0]);

  return Object.fromEntries(
    keys.map(key => [
      key,
      avg(featuresArray.map(f => f[key]))
    ])
  );
};

export const extractDigraphFeatures = (keystrokes) => {
  const digraphs = {};

  for (let i = 1; i < keystrokes.length; i++) {
    const prev = keystrokes[i - 1];
    const curr = keystrokes[i];

    // Only care about printable characters
    if (prev.key.length !== 1 || curr.key.length !== 1) continue;
    if (curr.flightTime === null) continue;

    const pair = `${prev.key}${curr.key}`; // "th", "he", "er" etc.

    if (!digraphs[pair]) digraphs[pair] = [];
    digraphs[pair].push(curr.flightTime);
  }

  // Average each digraph across the attempt
  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  const digraphMeans = {};
  Object.entries(digraphs).forEach(([pair, times]) => {
    digraphMeans[pair] = avg(times);
  });

  return digraphMeans;
  // { "th": 38, "he": 72, "eq": 95, "qu": 41 ... }
};
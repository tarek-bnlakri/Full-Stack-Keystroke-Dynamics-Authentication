export const extractFeatures = (keystrokes) => {
  const dwellTimes = keystrokes.map(k => k.dwellTime)
  
  const flightTimes = keystrokes
    .map(k => k.flightTime)
    .filter(f => f !== null)

  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length

  const avgDwellTime = avg(dwellTimes)
  const avgFlightTime = flightTimes.length ? avg(flightTimes) : 0

  const sessionDuration =
    (new Date(keystrokes[keystrokes.length - 1].keyUpTime) -
      new Date(keystrokes[0].keyDownTime)) / 1000

  const typingSpeed = keystrokes.length / sessionDuration

  const backspaceCount = keystrokes.filter(k => k.key === "Backspace").length

  const errorRate = backspaceCount / keystrokes.length

  return {
    avgDwellTime,
    avgFlightTime,
    typingSpeed,
    backspaceCount,
    errorRate,
    sessionDuration
  }
}
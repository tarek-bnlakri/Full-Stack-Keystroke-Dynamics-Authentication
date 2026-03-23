import prisma from '../lib/prisma.js';
import { extractFeatures, aggregateFeatures } from "../services/processSession.js";

export const createSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { promptText, subsessions } = req.body;

    // 1. Validate
    if (!promptText || !Array.isArray(subsessions) || subsessions.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const validSubsessions = subsessions.filter(
      s => Array.isArray(s.keystrokes) && s.keystrokes.length > 0
    );

    if (validSubsessions.length === 0) {
      return res.status(400).json({ message: "No valid subsessions" });
    }

    // 2. Extract features per subsession
    const subsessionFeatures = validSubsessions.map(s =>
      extractFeatures(s.keystrokes)
    );

    // 3. Aggregate across all subsessions for session-level ML features
    const sessionFeatures = aggregateFeatures(subsessionFeatures);

    // 4. Session timing — first keystroke of attempt 1 to last keystroke of last attempt
    const firstAttempt = validSubsessions[0];
    const lastAttempt  = validSubsessions[validSubsessions.length - 1];

    const startedAt  = new Date(firstAttempt.keystrokes[0].keyDownTime);
    const finishedAt = new Date(
      lastAttempt.keystrokes[lastAttempt.keystrokes.length - 1].keyUpTime
    );

    // 5. Store
    const session = await prisma.typingSession.create({
      data: {
        userId,
        promptText,
        startedAt,
        finishedAt,

        // Session-level aggregated ML features
        avgDwellTime:    sessionFeatures.avgDwellTime,
        avgFlightTime:   sessionFeatures.avgFlightTime,
        typingSpeed:     sessionFeatures.typingSpeed,
        errorRate:       sessionFeatures.errorRate,
        backspaceCount:  sessionFeatures.backspaceCount,
        sessionDuration: sessionFeatures.sessionDuration,

        subSessions: {
          create: validSubsessions.map((s, i) => ({
            attemptNumber: i + 1,
            typedText:     s.typedText ?? "",
            keystrokes:    s.keystrokes,        // embedded as Json — no separate collection
            ...subsessionFeatures[i]
          }))
        }
      }
    });

    res.status(201).json(session);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
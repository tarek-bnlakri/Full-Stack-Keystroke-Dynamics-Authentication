import prisma from '../lib/prisma.js';
import { extractFeatures } from "../services/featureExtractionService.js"

export const createSession = async (req, res) => {
  try {
    const userId = req.userId
    console.log(req.body)
    const { promptText, typedText, keystrokes } = req.body

    // 1️⃣ Extract features
    const features = extractFeatures(keystrokes)
    console.log("features",features)
   // 2️⃣ Create session
    const session = await prisma.typingSession.create({
      data: {
        userId,
        promptText,
        typedText,
        startedAt: new Date(keystrokes[0].keyDownTime),
        finishedAt: new Date(keystrokes[keystrokes.length - 1].keyUpTime),

        ...features,

        keystrokeEvents: {
          create: keystrokes.map(k => ({
            key: k.key,
            keyDownTime: new Date(k.keyDownTime),
            keyUpTime: new Date(k.keyUpTime),
            dwellTime: k.dwellTime,
            flightTime: k.flightTime
          }))
        }
      }
    })

    res.status(201).json(session)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
import prisma from "../lib/prisma.js"

export const buildDataset = async (filters = {}) => {
  const whereClause = {}

  // if (filters.userId) {
  //   whereClause.userId = filters.userId
  // }

  const sessions = await prisma.typingSession.findMany({
    //where: whereClause,
    select: {
      id:true,
      userId: true,
      avgDwellTime: true,
      avgFlightTime: true,
      typingSpeed: true,
      errorRate: true,
      backspaceCount: true,
      sessionDuration: true,
    }
  })

  return sessions
}
import { buildDataset } from "../services/datasetBuilderService.js"
import { Parser } from "json2csv"

export const exportDataset = async (req, res) => {
  try {
    const { userId } = req.query

    const dataset = await buildDataset({ userId })

    if (!dataset.length) {
      return res.status(404).json({ message: "No sessions found" })
    }

    const fields = [
      "userId",
      "avgDwellTime",
      "avgFlightTime",
      "typingSpeed",
      "errorRate",
      "backspaceCount",
      "sessionDuration"
    ]

    const json2csv = new Parser({ fields })
    const csv = json2csv.parse(dataset)

    res.header("Content-Type", "text/csv")
    res.attachment("dataset.csv")
    res.send(csv)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to export dataset" })
  }
}
import { buildDataset } from "../services/datasetBuilderService.js"
import { Parser } from "json2csv"

export const exportDataset = async (req, res) => {
  try {

    const dataset = await buildDataset()

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

export const getDataset =async (req,res)=>{
  try {
     const dataset = await buildDataset()
    if (!dataset.length) {
      return res.status(404).json({ message: "No sessions found" })
    }
    return res.status(200).json(dataset)
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Somthing wrong"});
  }
 
}
import express from "express"

const router = express.Router()
import {exportDataset} from "../controllers/datasetController.js"
import { verifyJWT } from "../middleware/verifyJWT.js"

router.get('/export',verifyJWT,exportDataset)

export default router
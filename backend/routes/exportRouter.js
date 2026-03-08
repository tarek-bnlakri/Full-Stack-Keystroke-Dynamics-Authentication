import express from "express"

const router = express.Router()
import {exportDataset,getDataset} from "../controllers/datasetController.js"
import { verifyAdmin, verifyJWT } from "../middleware/verifyJWT.js"

router.get('/',verifyJWT,verifyAdmin,getDataset)
router.get('/export',verifyJWT,verifyAdmin,exportDataset)

export default router
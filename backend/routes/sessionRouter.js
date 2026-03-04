import express from "express"
const router = express.Router()
import { createSession} from "../controllers/sessionController.js"

import { verifyJWT } from "../middleware/verifyJWT.js"

router.post('/',verifyJWT,createSession)

export default router
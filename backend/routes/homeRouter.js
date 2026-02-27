import express from "express"
const router = express.Router()
import { verifyJWT } from "../middleware/verifyJWT.js"

router.use('/',verifyJWT,(req,res)=>{
    return res.status(200).json({"message":"Authenticated"})
})
export default router
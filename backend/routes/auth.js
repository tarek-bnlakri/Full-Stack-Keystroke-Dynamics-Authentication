import express from "express"
const router = express.Router()
import { register,login,logout } from "../controllers/authController.js"
import { verifyJWT } from "../middleware/verifyJWT.js"
router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/me', verifyJWT, (req, res) => {
    return res.status(200).json({ 
        success: true,
        message: "Authenticated",
    });
});
export default router
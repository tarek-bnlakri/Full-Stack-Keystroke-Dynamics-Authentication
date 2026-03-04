import express from "express"
const app= express()
import cookieParser from "cookie-parser";
import 'dotenv/config'
import cors from 'cors'
import authRouter from './routes/auth.js'
import homeRouter from './routes/homeRouter.js'
import sessionReouter from './routes/sessionRouter.js'
import exportRouter from './routes/exportRouter.js'

app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRouter)
app.use('/api/home',homeRouter)
app.use('/api/sessions',sessionReouter)
app.use('/api/dataset',exportRouter)

app.get("/", (req, res) => {
    res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
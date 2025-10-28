import express from "express";
import cors from 'cors'
import "dotenv/config"
import mongoConnect from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js"

const app = express();
const PORT = process.env.PORT  || 3000;

//database connection
mongoConnect()

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));


app.get('/', (req,res)=>res.send("Server is live..."));
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai',aiRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on this port: ${PORT}`);
    
})
import express from "express";
import dotenv from "dotenv";
dotenv.config({});
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/database.js"
import { app,server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOption={
    origin:'http://localhost:3000',
    credentials:true
};
app.use(cors(corsOption)); 


// routes
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);

server.listen(PORT, ()=> {
    connectDB();
    console.log("Server Listening at PORT : "+PORT);
})
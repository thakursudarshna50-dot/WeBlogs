/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from "express";
import dotenv from "dotenv";
import db from './config/db.js';
import userRoutes from "./Router/userRoutes.js";
import blogRoutes from "./Router/blogRoutes.js";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
dotenv.config();
db();

const app = express();
app.use(cookieParser());
// CORS: allow credentials for the specific frontend origin
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(passport.initialize());
// Serve uploaded files
app.use('/uploads', express.static('uploads'));
app.use("/api/user", userRoutes);
app.use("/api/blog",blogRoutes);
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send(`server started at port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});

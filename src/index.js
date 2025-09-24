/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import express from "express";
import dotenv from "dotenv";
import db from './config/db.js';
import userRoutes from "./Router/userRoutes.js";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
dotenv.config();
db();

const app = express();
app.use(cookieParser());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(passport.initialize());
app.use("/api/user", userRoutes);
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send(`server started at port ${PORT}`);
});
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});

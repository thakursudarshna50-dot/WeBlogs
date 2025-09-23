/* eslint-disable no-unused-vars */
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import db from './config/db.js'
import users from "./model/users.js";
dotenv.config();
db();

const app = express();
app.use(express.urlencoded);
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`server started at port ${PORT}`);
});

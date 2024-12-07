import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { dbConnection } from "./database/db.js";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

dbConnection();
app.listen(port, () => {
  console.log(`Server is running at port:${port}`);
});

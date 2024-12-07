import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { dbConnection } from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    Credential: true,
  })
);
app.use("/api/auth", authRouter);

//error middlewares
app.use((req, res, next) => {
  const error = new Error(`path not found: ${req.baseUrl}`);
  res.status(404);
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = req.statusCode === 200 ? 500 : req.statusCode;
  res.status(statusCode).json({ success: false, error: err });
});
dbConnection();
app.listen(port, () => {
  console.log(`Server is running at port:${port}`);
});

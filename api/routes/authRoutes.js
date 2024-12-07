import express from "express";
import {
  register,
  login,
  logOut,
  refresh,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logOut);
authRouter.post("/refresh", refresh);

export default authRouter;

import User from "../models/User.js";
import { inputValidation } from "../models/User.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const salt = bcrypt.genSaltSync(10);
const genAccessToken = (data) => {
  return Jwt.sign(data, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "5min",
  });
};
const genRefreshToken = (data) => {
  return Jwt.sign(data, process.env.REFRESH_SECRET_KEY, { expiresIn: "30min" });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const isNotValidInput = await inputValidation(req.body);

  try {
    if (isNotValidInput) {
      return res.status(404).json({ success: false, msg: isNotValidInput });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res
        .status(404)
        .json({ success: false, msg: "User is already exist..!" });
    }

    const hash = bcrypt.hashSync(password, salt);
    const user = await User.create({ username, email, password: hash });
    const refresh_token = genRefreshToken({ id: user._id });
    const access_token = genAccessToken({ id: user._id });
    user.refresh_Token = refresh_token;
    user.save();
    res.cookie("refreshToken", refresh_token);
    res.status(200).json({
      success: false,
      msg: "user registred with success..!",
      access_token: access_token,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const isNotValidInputs = await inputValidation(req.body);
  try {
    if (isNotValidInputs) {
      return res.status(404).json({ success: false, msg: isNotValidInputs });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "User not found..!" });
    }
    const isValidPass = bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return res
        .status(401)
        .json({ success: false, msg: "wrong credentials..!" });
    }
    const refresh_token = genRefreshToken({ id: user._id });
    const access_token = genAccessToken({ id: user._id });
    user.refresh_Token = refresh_token;
    user.save();
    res.cookie("refreshToken", refresh_token);
    res.status(200).json({
      success: true,
      msg: "you're logged in!",
      access_token,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, msg: "you're logOut!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, msg: "refreshToken not provided..!" });
    }
    const user = await User.findOne({ refresh_Token: refreshToken });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "refreshToken not exist in db..!" });
    }
    Jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, msg: "invalid token..!" });
      }
      const gen_new_refresh = genRefreshToken({ id: decoded.id });
      const gen_new_access = genAccessToken({ id: decoded.id });
      user.refresh_Token = gen_new_refresh;
      user.save();
      res.cookie("refreshToken", gen_new_refresh);
      res.status(200).json({
        success: true,
        msg: "tokens are updated..!",
        access_token: gen_new_access,
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

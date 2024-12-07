import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  refresh_Token: String,
});

export const inputValidation = async (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3),
    password: Joi.string().pattern(
      new RegExp(
        "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
      )
    ),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    refresh_Token: Joi.string(),
  });
  const { error } = schema.validate(data);
  return error?.details[0]?.message;
};

const User = mongoose.model("User", userSchema);

export default User;

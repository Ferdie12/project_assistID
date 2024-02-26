import { validate } from "../validation/validation.js";
import dotenv from "dotenv";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/auth-validation.js";
import { UserModel } from "../models/user-schema.js";
import ResponseError from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();
const { JWT_SECRET_KEY } = process.env;

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await UserModel.countDocuments({ email: user.email });

  if (countUser) {
    throw new ResponseError(400, "Email is already registered!");
  }

  user.password = await bcrypt.hash(user.password, 10);

  delete user.confirmpassword;

  return await UserModel.create(user);
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await UserModel.findOne({ email: loginRequest.email }).select(
    "+password +role +createdAt +company"
  );

  if (!user) {
    throw new ResponseError(401, "Invalid email or password!");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Invalid email or password!");
  }

  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    position: user.position,
    company: user.company,
  };

  const token = await jwt.sign(payload, JWT_SECRET_KEY);

  return token;
};

export default {
  register,
  login,
};

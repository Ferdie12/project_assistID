import dotenv from "dotenv";
import ResponseError from "../error/response-error.js";
import jwt from "jsonwebtoken";

dotenv.config();

const companyKeys = {
  A: process.env.JWT_SECRET_KEY_COMPANY_A,
  B: process.env.JWT_SECRET_KEY_COMPANY_B,
};

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new ResponseError(400, "You're not authorized!");
    }

    const [, company, token] = authorization.split(" ");

    if (!company || !token || !companyKeys[company]) {
      throw new ResponseError(400, "Invalid authorization format!");
    }
    const data = await jwt.verify(token, companyKeys[company]);

    if (!data) {
      throw new ResponseError(400, "Invalid token!");
    }

    req.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      position: data.position,
      company: data.company,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const adminOnly = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      throw new ResponseError(
        403,
        "You're not authorized to perform this action!"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default { authMiddleware, adminOnly };

import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = (req, res) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  res.json({
    success: true,
    data: { user: { id: req.user.userId, email: req.user.email, name: req.user.name } }
  });
};

export const logout: RequestHandler = (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

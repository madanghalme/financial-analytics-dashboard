import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtUser } from "../types/auth";

export function signToken(user: JwtUser): string {
  return jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtUser {
  return jwt.verify(token, env.jwtSecret) as JwtUser;
}

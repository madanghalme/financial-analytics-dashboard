import { JwtUser } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

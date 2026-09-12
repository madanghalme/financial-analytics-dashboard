import { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((i) => ({ path: i.path, message: i.message }))
    });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
};

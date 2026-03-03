import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { HttpError } from "../utils/http-error.js";

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const firstMessage = Object.values(err.errors)[0]?.message ?? "Validation failed";
    res.status(400).json({ message: firstMessage });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid ${err.path}` });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    const dup = err as { keyValue?: Record<string, unknown> };
    const field = Object.keys(dup.keyValue ?? {})[0] ?? "field";
    res.status(409).json({ message: `${field} already exists` });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

import { Types } from "mongoose";
import { HttpError } from "./http-error.js";

export const assertObjectId = (value: string, field: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(value)) {
    throw new HttpError(400, `${field} must be a valid object id`);
  }

  return new Types.ObjectId(value);
};

export const assertRequiredString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${field} is required`);
  }

  return value.trim();
};

export const assertRequiredNumber = (value: unknown, field: string): number => {
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new HttpError(400, `${field} must be a valid number`);
  }

  return num;
};

export const assertNonNegative = (value: number, field: string): number => {
  if (value < 0) {
    throw new HttpError(400, `${field} must be >= 0`);
  }

  return value;
};

export const assertEnumValue = <T extends string>(
  value: unknown,
  validValues: readonly T[],
  field: string,
): T => {
  if (typeof value !== "string" || !validValues.includes(value as T)) {
    throw new HttpError(400, `${field} must be one of: ${validValues.join(", ")}`);
  }

  return value as T;
};

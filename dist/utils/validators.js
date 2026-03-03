import { Types } from "mongoose";
import { HttpError } from "./http-error.js";
export const assertObjectId = (value, field) => {
    if (!Types.ObjectId.isValid(value)) {
        throw new HttpError(400, `${field} must be a valid object id`);
    }
    return new Types.ObjectId(value);
};
export const assertRequiredString = (value, field) => {
    if (typeof value !== "string" || value.trim().length === 0) {
        throw new HttpError(400, `${field} is required`);
    }
    return value.trim();
};
export const assertRequiredNumber = (value, field) => {
    const num = Number(value);
    if (Number.isNaN(num)) {
        throw new HttpError(400, `${field} must be a valid number`);
    }
    return num;
};
export const assertNonNegative = (value, field) => {
    if (value < 0) {
        throw new HttpError(400, `${field} must be >= 0`);
    }
    return value;
};
export const assertEnumValue = (value, validValues, field) => {
    if (typeof value !== "string" || !validValues.includes(value)) {
        throw new HttpError(400, `${field} must be one of: ${validValues.join(", ")}`);
    }
    return value;
};

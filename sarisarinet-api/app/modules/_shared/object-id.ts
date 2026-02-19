import { isValidObjectId } from "mongoose";

export const isObjectId = (value: string): boolean => {
	return isValidObjectId(value);
};

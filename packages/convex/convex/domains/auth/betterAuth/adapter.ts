import { createApi } from "@convex-dev/better-auth";
import { createAuth } from "../setup";
import schema from "./generatedSchema";

export const {
	create,
	findOne,
	findMany,
	updateOne,
	updateMany,
	deleteOne,
	deleteMany,
} = createApi(schema, createAuth);

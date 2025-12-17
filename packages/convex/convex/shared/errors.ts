import { ConvexError } from "convex/values";

export class UnauthorizedError extends ConvexError<{
	message: string;
	code: 401;
}> {
	constructor(message?: string) {
		super({
			message: message ?? "Unauthorized",
			code: 401 as const,
		});
	}
}

export class ForbiddenError extends ConvexError<{
	message: string;
	code: 403;
}> {
	constructor(message?: string) {
		super({
			message: message ?? "Forbidden",
			code: 403 as const,
		});
	}
}

export class NotFoundError extends ConvexError<{
	message: string;
	code: 404;
}> {
	constructor(message?: string) {
		super({
			message: message ?? "Not Found",
			code: 404 as const,
		});
	}
}

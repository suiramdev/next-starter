import { components } from "../_generated/api";
import { query } from "../_generated/server";
import { authComponent } from "../auth";

export const isLinked = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);

		if (!user) {
			return false;
		}

		const isLinked = await ctx.runQuery(
			components.betterAuth.queries.spotify.isLinked,
			{
				userId: user?._id,
			},
		);

		return isLinked;
	},
});

import { v } from "convex/values";
import { components } from "../../_generated/api";
import { query } from "../../_generated/server";
import { authComponent } from "../auth/setup";

export const hasSpotifyAccount = query({
	args: {},
	returns: v.boolean(),
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		console.log("user", user);

		if (!user) {
			return false;
		}

		const account = await ctx.runQuery(
			components.betterAuth.queries.spotify.getSpotifyAccount,
			{
				userId: user?._id,
			},
		);

		return !!account;
	},
});

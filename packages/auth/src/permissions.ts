import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
	user: ["create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
	owner: ac.newRole({
		...ownerAc.statements,
		user: ["create", "update", "delete"],
	}),
	admin: ac.newRole({
		...adminAc.statements,
		user: ["create", "update", "delete"],
	}),
	member: ac.newRole({
		...memberAc.statements,
		user: [],
	}),
};

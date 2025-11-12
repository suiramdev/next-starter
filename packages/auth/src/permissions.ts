import { createAccessControl } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
	...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const roles = {
	owner: ac.newRole({
		...ownerAc.statements,
	}),
	admin: ac.newRole({
		...adminAc.statements,
	}),
	member: ac.newRole({
		...memberAc.statements,
	}),
};

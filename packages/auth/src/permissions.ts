import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
  session: ["list", "revoke", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  admin: ac.newRole({
    user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
  }),
  editor: ac.newRole({
    user: ["create", "list"],
    session: ["list"],
  }),
  user: ac.newRole({
    user: ["list"],
    session: ["list"],
  }),
};
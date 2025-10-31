// Re-export the generated Zero schema from Prisma via @repo/db
export {
  zeroSchema as schema,
  type ZeroSchema as Schema,
  type ZeroUser as User,
  type ZeroSession as Session,
  type ZeroAccount as Account,
  type ZeroVerification as Verification,
} from "@repo/db";

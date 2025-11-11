import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/registry/new-york-v4/ui/breadcrumb";
import { zeroDb } from "@repo/zero/server";
import type { User } from "@repo/zero";

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Use Zero's ZQL on the server to query data directly against Postgres
  // @see https://zero.rocicorp.dev/docs/zql-on-the-server
  const user = await zeroDb.transaction(async (tx) => {
    if (!tx.query.user) {
      return undefined;
    }
    const result = await tx.query.user.where((eb) => eb.cmp("id", id)).one();
    // Zero server queries return the actual data when awaited
    return result as unknown as User | undefined;
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/users">Users</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{user?.name ?? id}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

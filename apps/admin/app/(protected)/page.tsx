"use client";

import Link from "next/link";
import { authClient } from "@repo/auth/helpers/react/client";
import { useQuery } from "@repo/zero/helpers/react";
import { getOrganizations } from "@repo/zero/queries";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { PlusIcon, ChevronRightIcon } from "@repo/ui/registry/admin/icons";
import {
  CurrentUserDropdown,
  CurrentUserDropdownTrigger,
} from "@/features/users/components/current-user-dropdown";
import { UserAvatar } from "@/features/users/components/user-avatar";
import { OrganizationAvatar } from "@/features/organizations/components/organization-avatar";
import {
  CreateOrganizationDialog,
  CreateOrganizationDialogTrigger,
} from "@/features/organizations/components/create-organization-dialog";
import { Separator } from "@repo/ui/registry/new-york-v4/ui/separator";

export default function Page() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? "anon";
  const [organizations] = useQuery(getOrganizations({ userId }));

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-4 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Welcome back</h1>
            {session?.user && (
              <CurrentUserDropdown>
                <CurrentUserDropdownTrigger>
                  <UserAvatar user={session?.user} />
                </CurrentUserDropdownTrigger>
              </CurrentUserDropdown>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Organizations</span>
            <CreateOrganizationDialog>
              <CreateOrganizationDialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon />
                  Create Organization
                </Button>
              </CreateOrganizationDialogTrigger>
            </CreateOrganizationDialog>
          </div>
          <div className="flex flex-col gap-2">
            {organizations?.map((organization) => (
              <Link
                key={organization.id}
                href={`/organizations/${organization.id}`}
              >
                <Button variant="ghost" className="w-full h-12">
                  <OrganizationAvatar organization={organization} />
                  {organization.name}
                  <ChevronRightIcon className="size-4 ml-auto" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

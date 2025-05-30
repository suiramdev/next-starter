"use client";

import { useState } from "react";
import { roles } from "@repo/auth/permissions";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/ui/registry/new-york-v4/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@repo/ui/registry/new-york-v4/ui/tabs";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/registry/new-york-v4/ui/select";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { DialogFooter } from "@repo/ui/registry/new-york-v4/ui/dialog";

type AddUserDialogProps = React.ComponentProps<typeof Dialog> & {
  children: React.ReactNode;
};

const inviteMethods = ["email", "magic", "whitelist"] as const;

const availableInviteMethods: (typeof inviteMethods)[number][] = [
  "whitelist",
] as const;

const inviteMethodLabels: Record<(typeof inviteMethods)[number], string> = {
  email: "Email Invite",
  magic: "Magic Link",
  whitelist: "Whitelist",
};

const roleOptions = Object.keys(roles);

export function AddUserDialog({ children, ...props }: AddUserDialogProps) {
  const [inviteMethod, setInviteMethod] =
    useState<(typeof availableInviteMethods)[number]>("whitelist");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
  };

  const handleInviteMethodChange = (value: string) => {
    if (inviteMethods.includes(value as (typeof inviteMethods)[number])) {
      setInviteMethod(value as (typeof inviteMethods)[number]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
      <DialogContent className="w-full max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Invite a new user to your application. Choose how you'd like to send
            the invitation.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={inviteMethod}
          onValueChange={handleInviteMethodChange as (value: string) => void}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {inviteMethods.map((method) => (
              <TabsTrigger
                key={method}
                value={method}
                disabled={!availableInviteMethods.includes(method)}
              >
                {inviteMethodLabels[method]}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={"whitelist"} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whitelist-email">Email Address</Label>
              <Input
                id="whitelist-email"
                type="email"
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="whitelist-role">Default Role</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-approve" />
              <Label htmlFor="auto-approve">Auto-approve registration</Label>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Whitelisted users can create accounts directly without requiring
                an invitation. They will be automatically assigned the selected
                role upon registration.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button>{inviteMethod === "whitelist" && "Add to Whitelist"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AddUserDialogTrigger = DialogTrigger;

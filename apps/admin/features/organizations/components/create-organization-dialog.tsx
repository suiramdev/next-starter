"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@repo/convex/_generated/api";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@repo/ui/registry/new-york-v4/ui/dialog";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";

type CreateOrganizationDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactNode;
};

export function CreateOrganizationDialog({
  children,
  ...props
}: CreateOrganizationDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createOrganization = useMutation(api.mutations.organizations.createOrganization);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
    if (!open) {
      setName("");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrganization({ name: name.trim() });
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to create organization:", error);
      // TODO: Add error handling/toast notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim() && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
      <DialogContent className="w-full max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Enter a name for your new organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="organization-name">Organization Name</Label>
            <Input
              id="organization-name"
              placeholder="Enter organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const CreateOrganizationDialogTrigger = DialogTrigger;

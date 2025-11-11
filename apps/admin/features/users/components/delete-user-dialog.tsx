"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@repo/ui/registry/new-york-v4/ui/dialog";
import { DialogDescription } from "@repo/ui/registry/new-york-v4/ui/dialog";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { DialogFooter } from "@repo/ui/registry/new-york-v4/ui/dialog";
import { useState } from "react";
import { useZero } from "@repo/zero/helpers/react";

type DeleteUserDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactNode;
  userId?: string;
};

export function DeleteUserDialog({
  children,
  userId,
  ...props
}: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const zero = useZero();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
  };

  const handleDelete = () => {
    if (!userId) return;

    zero.mutate.deleteUser({ userId });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              handleOpenChange(false);
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const DeleteUserDialogTrigger = DialogTrigger;

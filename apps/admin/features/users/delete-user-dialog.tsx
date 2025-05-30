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

type DeleteUserDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactNode;
};

export function DeleteUserDialog({
  children,
  ...props
}: DeleteUserDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
  };

  const handleDelete = () => {};

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user?
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

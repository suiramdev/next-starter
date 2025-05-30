import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/ui/registry/new-york-v4/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/registry/new-york-v4/ui/tabs";
import { Label } from "@repo/ui/registry/new-york-v4/ui/label";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@repo/ui/registry/new-york-v4/ui/select";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import { Textarea } from "@repo/ui/registry/new-york-v4/ui/textarea";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { DialogFooter } from "@repo/ui/registry/new-york-v4/ui/dialog";

type AddUserDialogProps = React.ComponentProps<typeof Dialog> & {
  children: React.ReactNode;
};

const inviteMethods = ["email", "magic", "whitelist"] as const;

export function AddUserDialog({ children, ...props }: AddUserDialogProps) {
  const [inviteMethod, setInviteMethod] = useState<typeof inviteMethods[number]>("email");
  const [open, setOpen] = useState(false);
  
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    props.onOpenChange?.(open);
  };

  const handleInviteMethodChange = (value: string) => {
    if (inviteMethods.includes(value as typeof inviteMethods[number])) {
      setInviteMethod(value as typeof inviteMethods[number]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
      <DialogContent className="w-full max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Invite a new user to your organization. Choose how you'd like to send the invitation.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={inviteMethod} onValueChange={handleInviteMethodChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email Invite</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea id="message" placeholder="Welcome to our team! We're excited to have you on board." rows={3} />
            </div>
          </TabsContent>

          <TabsContent value="magic" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magic-email">Email Address</Label>
              <Input id="magic-email" type="email" placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="magic-role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="one-time" />
              <Label htmlFor="one-time">One-time use link</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Link Expiry</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select expiry time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="whitelist" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whitelist-email">Email Address</Label>
              <Input id="whitelist-email" type="email" placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whitelist-role">Default Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-approve" />
              <Label htmlFor="auto-approve">Auto-approve registration</Label>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Whitelisted users can create accounts directly without requiring an invitation. They will be
                automatically assigned the selected role upon registration.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            {inviteMethod === "email" && "Send Invitation"}
            {inviteMethod === "magic" && "Generate Link"}
            {inviteMethod === "whitelist" && "Add to Whitelist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const AddUserDialogTrigger = DialogTrigger;
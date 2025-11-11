"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useZero } from "@repo/zero/helpers/react";
import { roles } from "@repo/auth/permissions";
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
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/registry/new-york-v4/ui/select";
import { Switch } from "@repo/ui/registry/new-york-v4/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/registry/new-york-v4/ui/form";
import type { User } from "@repo/db/zero";

type EditUserDialogProps = React.ComponentProps<typeof Dialog> & {
  children?: React.ReactNode;
  user?: User | null;
};

const roleOptions = Object.keys(roles);

const editUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().nullable(),
  image: z
    .union([z.string(), z.null()])
    .transform((val) => (val === "" ? null : val))
    .refine((val) => val === null || z.string().url().safeParse(val).success, {
      message: "Invalid URL",
    }),
  emailVerified: z.boolean(),
});

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

export function EditUserDialog({
  children,
  user,
  ...props
}: EditUserDialogProps) {
  const zero = useZero();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: null,
      image: null,
      emailVerified: false,
    },
  });

  // Initialize form with user data when dialog opens or user changes
  useEffect(() => {
    if (user && props.open) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? null,
        image: user.image ?? null,
        emailVerified: user.emailVerified ?? false,
      });
    }
  }, [user, props.open, form]);

  const handleOpenChange = (open: boolean) => {
    props.onOpenChange?.(open);
    if (!open && user) {
      // Reset form when closing
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? null,
        image: user.image ?? null,
        emailVerified: user.emailVerified ?? false,
      });
    }
  };

  const onSubmit = (values: EditUserFormValues) => {
    if (!user) return;

    zero.mutate.updateUser({
      userId: user.id,
      name: values.name || undefined,
      email: values.email || undefined,
      role: values.role || null,
      image: values.image || null,
      emailVerified: values.emailVerified,
    });
    handleOpenChange(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={props.open} onOpenChange={handleOpenChange} {...props}>
      {children}
      <DialogContent className="w-full max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="User name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(value) => {
                      field.onChange(value === "__clear__" ? null : value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__clear__">No role</SelectItem>
                      {roleOptions.map((roleOption) => (
                        <SelectItem key={roleOption} value={roleOption}>
                          {roleOption.charAt(0).toUpperCase() +
                            roleOption.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Email Verified</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const EditUserDialogTrigger = DialogTrigger;

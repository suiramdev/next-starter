"use client";

import { ArrowLeftIcon, CheckIcon } from "@repo/ui/registry/admin/icons";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/registry/new-york-v4/ui/form";
import { Button } from "@repo/ui/registry/new-york-v4/ui/button";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { SetupFormValues } from "./schema";

type Step2OwnerAccountProps = {
  form: UseFormReturn<SetupFormValues>;
  onBack: () => void;
  isSubmitting: boolean;
};

export function Step2OwnerAccount({
  form,
  onBack,
  isSubmitting,
}: Step2OwnerAccountProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-4 duration-300">
      <div className="grid gap-5">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  id="userName"
                  type="text"
                  placeholder="John Doe"
                  required
                  autoFocus
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  id="userEmail"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormDescription>
                Must be at least 8 characters long
              </FormDescription>
              <FormControl>
                <Input
                  id="userPassword"
                  type="password"
                  required
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {form.formState.errors.root?.serverError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive">
            {form.formState.errors.root.serverError.message}
          </p>
        </div>
      )}
      <div className="flex justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="min-w-[100px]"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !form.formState.isValid}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Setting up...
            </>
          ) : (
            <>
              Complete Setup
              <CheckIcon className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

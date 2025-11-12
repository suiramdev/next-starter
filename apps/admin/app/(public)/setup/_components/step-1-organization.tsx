"use client";

import { ArrowRightIcon, ArrowLeftIcon } from "@repo/ui/registry/admin/icons";
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

type Step1OrganizationProps = {
  form: UseFormReturn<SetupFormValues>;
  onNext: () => void;
};

export function Step1Organization({ form, onNext }: Step1OrganizationProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-4 duration-300">
      <FormField
        control={form.control}
        name="organizationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name</FormLabel>
            <FormDescription>
              This will be your default organization name
            </FormDescription>
            <FormControl>
              <Input
                id="organizationName"
                type="text"
                placeholder="Acme Inc."
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
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={onNext}
          disabled={!form.watch("organizationName")?.trim()}
          className="min-w-[100px]"
        >
          Next
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

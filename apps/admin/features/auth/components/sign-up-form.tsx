"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/registry/new-york-v4/ui/form";
import { Button } from "@repo/ui/registry/admin/ui/button";
import { Input } from "@repo/ui/registry/new-york-v4/ui/input";
import { useForm } from "react-hook-form";
import { authClient } from "@repo/auth/helpers/react/client";
import { useRouter } from "next/navigation";

export const signUpFormSchema = z.object({
  email: z.string().email(),
  nickname: z
    .string()
    .min(1, { message: "Nickname must be at least 1 character long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type SignUpFormProps = React.ComponentPropsWithoutRef<"div">;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useRouter();
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.nickname,
      fetchOptions: {
        onError: ({ error }) => {
          if (error.code === "USER_ALREADY_EXISTS") {
            form.setError("email", {
              message: "This email is already in use",
            });
          } else {
            form.setError("root.serverError", {
              ...error,
              message: error.message ?? "Something went wrong, please try again",
            });
          }

          form.resetField("password");
          form.resetField("confirmPassword");
        },
        onSuccess: () => {
          navigate.push("/");
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <span className="sr-only">Acme Inc.</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input
                        id="nickname"
                        type="text"
                        placeholder="Your nickname"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        required
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root?.serverError && (
                <FormMessage>
                  {form.formState.errors.root.serverError.message}
                </FormMessage>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={form.formState.isSubmitting}
            >
              Sign up
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By signing up, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}

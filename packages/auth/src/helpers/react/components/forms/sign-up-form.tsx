import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

type SignUpFormProps = React.ComponentPropsWithoutRef<"form"> & {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export function SignUpForm({ onSuccess, onError, ...props }: SignUpFormProps) {
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
              message:
                error.message ?? "Something went wrong, please try again",
            });
          }

          form.resetField("password");
          form.resetField("confirmPassword");

          onError?.(error);
        },
        onSuccess: () => {
          onSuccess?.();
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
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
                    <Input id="password" type="password" required {...field} />
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
  );
}

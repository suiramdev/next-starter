"use client";

import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { SignInForm as Form } from "@repo/auth/helpers/react/components/forms/sign-in-form";
import { useRouter } from "next/navigation";

type SignInFormProps = React.ComponentPropsWithoutRef<"div">;

export function SignInForm({ className, ...props }: SignInFormProps) {
  const navigate = useRouter();

  const onSuccess = () => {
    navigate.push("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <span className="sr-only">Acme Inc.</span>
          </a>
          <h1 className="text-xl font-bold">Welcome back to Acme Inc.</h1>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
        <Form onSuccess={onSuccess} />
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By signing in, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

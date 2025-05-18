"use client";

import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { SignUpForm as Form } from "@repo/auth/helpers/react/components/forms/sign-up-form";
import { useRouter } from "next/navigation";

type SignUpFormProps = React.ComponentPropsWithoutRef<"div">;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useRouter();

  const onSuccess = () => {
    navigate.push("/");
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
      <Form onSuccess={onSuccess} />
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By signing up, you agree to our{" "}
        <Link href="/terms-of-service">Terms of Service</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}

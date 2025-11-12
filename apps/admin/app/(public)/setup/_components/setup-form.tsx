"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@repo/ui/registry/new-york-v4/ui/form";
import { useMutation } from "convex/react";
import { api } from "@repo/convex/_generated/api";
import { useRouter } from "next/navigation";
import { setupFormSchema, type SetupFormValues } from "./schema";
import { StepIndicator } from "./step-indicator";
import { Step1Organization } from "./step-1-organization";
import { Step2OwnerAccount } from "./step-2-owner-account";

type SetupFormProps = React.ComponentPropsWithoutRef<"form"> & {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function SetupForm({ onSuccess, onError, ...props }: SetupFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, startTransition] = useTransition();
  const setupMutation = useMutation(api.mutations.setup.setup);
  const router = useRouter();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupFormSchema),
    defaultValues: {
      organizationName: "",
      userEmail: "",
      userPassword: "",
      confirmPassword: "",
      userName: "",
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await form.trigger("organizationName");
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      // Complete button - submit the form
      form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const onSubmit = async (values: SetupFormValues) => {
    if (values.userPassword !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      });
      return;
    }

    startTransition(async () => {
      try {
        await setupMutation({
          organizationName: values.organizationName,
          userEmail: values.userEmail,
          userPassword: values.userPassword,
          userName: values.userName,
        });

        onSuccess?.();
        router.push("/");
        router.refresh();
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Setup failed");
        form.setError("root.serverError", {
          message: err.message ?? "Something went wrong, please try again",
        });
        onError?.(err);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <div className="flex flex-col gap-6">
          <StepIndicator currentStep={step} />
          <div className="space-y-6">
            {step === 1 && (
              <Step1Organization form={form} onNext={handleNext} />
            )}

            {step === 2 && (
              <Step2OwnerAccount
                form={form}
                onBack={handleBack}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}

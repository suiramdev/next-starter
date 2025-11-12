"use client";

import { Progress } from "@repo/ui/registry/new-york-v4/ui/progress";

type StepIndicatorProps = {
  currentStep: 1 | 2;
};

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const steps = ["Organization", "Owner Account"];

  return (
    <div
      className="flex justify-center self-start pt-6 w-full"
      style={{
        all: "revert",
        display: "flex",
        justifyContent: "center",
        alignSelf: "flex-start",
        paddingTop: "1.5rem",
        width: "100%",
        fontSize: "14px",
        lineHeight: "1.5",
        letterSpacing: "normal",
      }}
    >
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-muted-foreground">
            {steps[currentStep - 1]}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}

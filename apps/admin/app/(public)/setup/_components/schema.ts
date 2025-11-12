import { z } from "zod";

export const setupFormSchema = z.object({
  organizationName: z
    .string()
    .min(1, { message: "Organization name is required" })
    .min(2, {
      message: "Organization name must be at least 2 characters long",
    }),
  userEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  userPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  userName: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
});

export type SetupFormValues = z.infer<typeof setupFormSchema>;

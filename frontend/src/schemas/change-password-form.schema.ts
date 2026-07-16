import { z } from "zod"

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),

    new_password: z
      .string()
      .min(1, "New password is required")
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
      .regex(/[a-z]/, "New password must contain at least one lowercase letter")
      .regex(/[0-9]/, "New password must contain at least one number"),

    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  })

export type ChangePasswordData = z.infer<typeof changePasswordSchema>

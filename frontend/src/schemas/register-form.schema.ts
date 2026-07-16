import z from "zod"

export const registerFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username or email is required")
    .max(30, "Username must be 30 characters or less")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z
    .email("Enter a valid email address")
    .min(1, "Email address is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number"),
})

export type RegisterFormData = z.infer<typeof registerFormSchema>

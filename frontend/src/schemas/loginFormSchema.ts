import z from "zod"

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  // .min(8, "Password must be at least 8 characters long"),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

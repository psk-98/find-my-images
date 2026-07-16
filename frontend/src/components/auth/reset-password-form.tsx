"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  ResetPasswordData,
  resetPasswordSchema,
} from "@/schemas/reset-password.schema"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  })

  async function onSubmit(values: ResetPasswordData) {
    setServerError(null)
    setSuccessMessage(null)

    const token: string | null = searchParams.get("token")

    // if (!token) {
    //   setServerError("Invalid or missing token")
    //   return
    // }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, ...values }),
      })

      const data: { message?: string } = await response.json()

      if (!response.ok) {
        setServerError(data.message ?? "Could not reset password, try again")
        return
      }

      setSuccessMessage(data.message ?? "Password reset successfully")
    } catch {
      setServerError("Something went wrong. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset your password?</CardTitle>
        <CardDescription>
          Enter your new password and confirm it to reset.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {serverError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {serverError}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                {successMessage}
              </div>
            ) : null}

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password">New Password</FieldLabel>

              <Input
                id="password"
                type="password"
                placeholder="new password"
                autoComplete="password"
                aria-invalid={Boolean(errors.password)}
                disabled={isSubmitting}
                {...register("password")}
              />

              {errors.password ? (
                <FieldError>{errors.password.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.confirm_password)}>
              <FieldLabel htmlFor="confirm_password">
                Confirm Password
              </FieldLabel>

              <Input
                id="confirm_password"
                type="password"
                placeholder="confirm password"
                autoComplete="confirm password"
                aria-invalid={Boolean(errors.confirm_password)}
                disabled={isSubmitting}
                {...register("confirm_password")}
              />

              {errors.confirm_password ? (
                <FieldError>{errors.confirm_password.message}</FieldError>
              ) : null}
            </Field>

            <Field>
              <Button
                type="submit"
                className="relative w-full"
                disabled={isSubmitting}
              >
                <span>Reset password</span>

                {isSubmitting ? (
                  <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin" />
                ) : null}
              </Button>

              <FieldDescription>
                Can't reset your password? Get another{" "}
                <Link href="/forgot-password">link</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

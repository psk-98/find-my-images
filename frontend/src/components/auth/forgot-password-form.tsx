"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  type ForgotPasswordData,
  forgotPasswordSchema,
} from "@/schemas/forgot-password.schema"

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: ForgotPasswordData) {
    setServerError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data: { message?: string } = await response.json()

      if (!response.ok) {
        setServerError(data.message ?? "Could not send reset link")
        return
      }

      setSuccessMessage(
        data.message ?? "If this email exists, a reset link has been sent.",
      )
    } catch {
      setServerError("Something went wrong. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email address and we’ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)}>
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

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                disabled={isSubmitting}
                {...register("email")}
              />

              {errors.email ? (
                <FieldError>{errors.email.message}</FieldError>
              ) : null}
            </Field>

            <Field>
              <Button
                type="submit"
                form="forgot-password-form"
                className="relative w-full"
                disabled={isSubmitting}
              >
                <span>Send reset link</span>

                {isSubmitting ? (
                  <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin" />
                ) : null}
              </Button>

              <FieldDescription>
                Remembered your password? <Link href="/login">Login</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

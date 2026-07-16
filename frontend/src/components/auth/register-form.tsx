"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  type RegisterFormData,
  registerFormSchema,
} from "@/schemas/register-form.schema"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field"
import { Loader2 } from "lucide-react"

export default function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: RegisterFormData) {
    setServerError(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data.message || "Register failed")
        return
      }

      router.push("/login")
      router.refresh()
    } catch (e) {
      setServerError("Something went wrong. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register to an account</CardTitle>
        <CardDescription>
          Enter your email, username and password below to register to an
          account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {serverError}
            </div>
          ) : null}

          <FieldGroup>
            <Field data-invalid={Boolean(errors.username)}>
              <FieldLabel htmlFor="username">Username</FieldLabel>

              <Input
                id="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
                aria-invalid={Boolean(errors.username)}
                disabled={isSubmitting}
                {...register("username")}
              />

              {errors.username ? (
                <FieldError>{errors.username.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="Email address"
                autoComplete="Email"
                aria-invalid={Boolean(errors.email)}
                disabled={isSubmitting}
                {...register("email")}
              />

              {errors.email ? (
                <FieldError>{errors.email.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                disabled={isSubmitting}
                {...register("password")}
              />

              {errors.password ? (
                <FieldError>{errors.password.message}</FieldError>
              ) : null}
            </Field>

            <Field>
              <Button
                type="submit"
                className="relative w-full"
                disabled={isSubmitting}
              >
                <span>Register</span>

                {isSubmitting ? (
                  <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin" />
                ) : null}
              </Button>

              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Login</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "../ui/input"
import * as loginFormSchema from "@/schemas/loginFormSchema"
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginFormSchema.LoginFormData>({
    resolver: zodResolver(loginFormSchema.loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: loginFormSchema.LoginFormData) {
    setServerError(null)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (!res.ok) {
        setServerError(data.message || "Login failed")
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch (e) {
      setServerError("Something went wrong. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email or username below to login to your account
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
              <FieldLabel htmlFor="username_email">
                Username or email
              </FieldLabel>

              <Input
                id="username_email"
                type="text"
                placeholder="Username or email"
                autoComplete="username"
                aria-invalid={Boolean(errors.username)}
                disabled={isSubmitting}
                {...register("username")}
              />

              {errors.username ? (
                <FieldError>{errors.username.message}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {/*<Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>*/}
              </div>

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
                <span>Login</span>

                {isSubmitting ? (
                  <Loader2 className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin" />
                ) : null}
              </Button>
              <FieldDescription className="text-center">
                Forgot password?{" "}
                <Link href="/forgot-password">Reset password</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

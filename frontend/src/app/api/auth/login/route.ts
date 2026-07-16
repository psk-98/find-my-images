import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  const formData = new URLSearchParams()

  formData.append("username", body.username)
  formData.append("password", body.password)
  const res = await fetch(`${process.env.BACKEND_URL}/auth/token/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  })

  if (!res.ok) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: res.status },
    )
  }
  const data = await res.json()
  const token = data.access_token

  const response = NextResponse.json({
    user: data.user,
    success: true,
  })

  response.cookies.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return response
}

import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log(body)

  const res = await fetch(`${process.env.BACKEND_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json()

    console.log(error)

    return NextResponse.json({ message: error.details }, { status: res.status })
  }

  // const data = await res.json()
  return NextResponse.json({
    // message: data.message,
    success: true,
  })
}

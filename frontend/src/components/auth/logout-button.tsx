"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    if (res.ok) {
      router.push("/dashboard")
      router.refresh()
    }
  }
  return (
    <Button variant="secondary" onClick={handleLogout}>
      Logout
    </Button>
  )
}

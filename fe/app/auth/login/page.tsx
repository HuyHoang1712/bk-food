"use client"

import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const params = useSearchParams()
  const role = params.get("role") // customer / restaurant / delivery

  return (
    <div>
      <h1>Đăng nhập - Role: {role}</h1>

      {/* form login ở đây */}
    </div>
  )
}

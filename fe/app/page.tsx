"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store" // adjust path

// Basic Auth header helper
const basicAuth = (username: string, password: string) =>
  "Basic " + btoa(`${username}:${password}`)

export default function HomePage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, setAuthHeader } = useStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!currentUser) return

    if (currentUser.role === "customer") router.push("/customer")
    else if (currentUser.role === "delivery") router.push("/delivery")
    else router.push("/restaurant")
  }, [currentUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
     const header = basicAuth(email, password)
    const res = await fetch("/api/me", {
  method: "GET",
  headers: { Authorization: header },
})

    if (!res.ok) {
      setError("Sai email hoặc mật khẩu.")
      return
    }

    const user = await res.json()

    // optional: save user to store if you want
    setCurrentUser(user)
    setAuthHeader(header) 

    // ✅ navigate based on role
    const role = String(user.role || "").toLowerCase()
    if (role === "customer") router.push("/customer")
    else if (role === "restaurant") router.push("/restaurant")
    else if (role === "delivery") router.push("/delivery")
    else setError("Role không hợp lệ trên hệ thống.")
  } catch {
    setError("Không thể kết nối server. Kiểm tra backend đang chạy chưa.")
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">BK Food</h1>
          <p className="text-gray-600">Giao đồ ăn nhanh cho sinh viên Bách Khoa</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-xl font-semibold text-center">Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Mật khẩu</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">Đây là web giao đồ ăn</p>
      </div>
    </div>
  )
}

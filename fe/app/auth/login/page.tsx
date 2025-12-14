"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabaseClient"

const roleLabels: Record<string, string> = {
  customer: "Khách hàng",
  restaurant: "Nhà hàng",
  delivery: "Đối tác giao hàng",
}

export default function LoginPage() {
  const params = useSearchParams()
  const role = params.get("role") || "customer"
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const token = params.get("token")
    if (token) {
      localStorage.setItem("bkfood_token", token)
      setMessage("Đăng nhập Google thành công qua Spring Boot + MySQL. Token đã được lưu.")
    }
  }, [params])

  const roleLabel = useMemo(
    () => roleLabels[role] || "Người dùng",
    [role],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    if (apiBaseUrl) {
      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const body = await response.json()
        if (!response.ok) {
          throw new Error(body.message || "Không thể đăng nhập")
        }

        localStorage.setItem("bkfood_token", body.token)
        setMessage("Đăng nhập thành công qua Spring Boot + MySQL. Token JWT đã lưu cho các API bảo vệ.")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
      }

      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
    } else {
      setMessage("Đăng nhập thành công! Dữ liệu sẽ được đồng bộ với hệ thống.")
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setMessage("")
    setError("")
    setGoogleLoading(true)

    if (apiBaseUrl) {
      window.location.href = `${apiBaseUrl}/api/auth/oauth2/authorize/google?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/login?role=${role}`)}`
      return
    }

    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/login?role=${role}`,
        scopes: "email profile",
      },
    })

    if (googleError) {
      setError(googleError.message)
    } else {
      setMessage(
        "Đang chuyển hướng tới Google để xác thực. Sau khi hoàn tất, phiên đăng nhập được lưu vào database/Spring Boot backend.",
      )
    }

    setGoogleLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-2xl shadow-amber-100/70 border border-amber-100 rounded-2xl overflow-hidden">
        <div className="grid gap-10 p-10 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
                Đăng nhập
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                {roleLabel} đăng nhập vào BK Food
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Hệ thống xác thực mặc định dùng Supabase Auth (PostgreSQL) làm
                kho dữ liệu người dùng, nhưng bạn có thể chuyển sang API Spring
                Boot + MySQL bằng cách trỏ các lời gọi bảo vệ (orders, menu,
                delivery) tới backend có JWT/Session hợp lệ.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email || !password}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm text-slate-500">Hoặc</span>
                <Separator className="flex-1" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={googleLoading}
                onClick={handleGoogleLogin}
              >
                {googleLoading ? "Đang mở Google..." : "Đăng nhập với Google"}
              </Button>
            </div>

            {(message || error) && (
              <div
                className={`rounded-lg border p-4 text-sm ${
                  error ? "border-destructive/50 text-destructive" : "border-emerald-200 text-emerald-700"
                } bg-emerald-50`}
              >
                {error || message}
              </div>
            )}
          </div>

          <div className="hidden lg:flex flex-col justify-between bg-amber-50 rounded-xl p-8 border border-amber-100">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-900">
                Quy trình lưu dữ liệu người dùng
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-amber-800">
                <li>Xác thực OAuth hoặc email/mật khẩu qua Supabase.</li>
                <li>
                  Supabase lưu thông tin người dùng vào PostgreSQL; Spring Boot
                  có thể đọc chung schema cho các dịch vụ backend.
                </li>
                <li>
                  Token đăng nhập trả về client để gọi API bảo vệ (order, menu,
                  delivery...).
                </li>
              </ol>
            </div>

            <div className="space-y-2 text-sm text-amber-800">
              <p className="font-semibold">Gợi ý cấu hình môi trường</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <code className="bg-amber-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                  và
                  <code className="bg-amber-100 px-2 py-1 rounded ml-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  cho luồng Supabase (tuỳ chọn).
                </li>
                <li>
                  <code className="bg-amber-100 px-2 py-1 rounded">NEXT_PUBLIC_API_BASE_URL</code>
                  trỏ tới backend Spring Boot dùng MySQL để front-end gọi API
                  CRUD/đăng nhập nếu không dùng Supabase trực tiếp.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
